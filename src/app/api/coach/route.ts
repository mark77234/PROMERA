import { NextResponse } from "next/server";
import { getMissionsByPurpose } from "@/data/prompt-missions";
import { extractPromptValues } from "@/lib/prompt-coach";
import type { Mission, PromptIngredient } from "@/types/app";

// USE_MOCK_AI=true(기본): 규칙 기반 목업 응답 — 네트워크 불필요, 시연 안정.
// USE_MOCK_AI=false: 무조건 실제 OpenAI 호출 — 목업 폴백 없이,
// 키 누락·호출 실패 시 오류를 반환해 클라이언트가 사용자에게 표시한다.

interface CoachRequest {
  action: "extract" | "normalize";
  purposeId: string;
  missionId: string;
  prompt?: string;
  ingredientId?: string;
  answer?: string;
}

type Engine = "mock" | "ai";

function isMockEnabled(): boolean {
  return (process.env.USE_MOCK_AI ?? "true").trim().toLowerCase() !== "false";
}

function getModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

function findMission(purposeId: string, missionId: string): Mission | undefined {
  return getMissionsByPurpose(purposeId).find((m) => m.id === missionId);
}

async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<Record<string, unknown>> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: getModel(),
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI 응답에 content가 없습니다.");
  return JSON.parse(content) as Record<string, unknown>;
}

function ingredientSpec(ingredient: PromptIngredient): string {
  const examples = ingredient.options.map((o) => o.value).join(" / ");
  return `- id: "${ingredient.id}" · 재료명: ${ingredient.label} · 질문: ${ingredient.question} · 값 예시: ${examples}`;
}

function sanitizeValue(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed || trimmed.length > 60) return undefined;
  return trimmed;
}

async function extractWithAI(
  apiKey: string,
  mission: Mission,
  prompt: string
): Promise<Record<string, string>> {
  const systemPrompt = [
    "너는 프롬프트 코칭 서비스의 정보 추출기다.",
    "사용자가 AI에게 보낸 프롬프트에서 아래 재료 값을 찾아 JSON으로만 반환한다.",
    "",
    "재료 목록:",
    ...mission.ingredients.map(ingredientSpec),
    "",
    "규칙:",
    "1. 프롬프트에 실제로 담긴 정보만 추출한다. 추측하거나 지어내지 않는다.",
    "2. 없는 재료는 키를 생략한다.",
    "3. 값은 프롬프트 문장에 바로 넣을 수 있는 간결한 한국어 명사구로 정리한다 (60자 이내).",
    '4. 출력 형식: {"values": {"재료id": "값", ...}}',
  ].join("\n");

  const parsed = await callOpenAI(apiKey, systemPrompt, `프롬프트: ${prompt}`);
  const raw = (parsed.values ?? {}) as Record<string, unknown>;
  const validIds = new Set(mission.ingredients.map((i) => i.id));
  const values: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    const clean = sanitizeValue(value);
    if (validIds.has(key) && clean) values[key] = clean;
  }
  return values;
}

async function normalizeWithAI(
  apiKey: string,
  ingredient: PromptIngredient,
  answer: string
): Promise<string> {
  const systemPrompt = [
    "너는 프롬프트 코칭 서비스의 답변 정리기다. 결과는 반드시 JSON으로만 반환한다.",
    `사용자가 "${ingredient.question}"라는 질문에 답했다.`,
    "답의 의미를 바꾸지 말고, 프롬프트 문장에 바로 넣을 수 있는 간결한 한국어 구로 정리해라 (60자 이내).",
    `참고 예시 값: ${ingredient.options.map((o) => o.value).join(" / ")}`,
    'JSON 출력 형식: {"value": "정리된 값"}',
  ].join("\n");

  const parsed = await callOpenAI(apiKey, systemPrompt, `답변: ${answer}`);
  return sanitizeValue(parsed.value) ?? answer.trim();
}

export async function POST(request: Request) {
  let body: CoachRequest;
  try {
    body = (await request.json()) as CoachRequest;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const mission = findMission(body.purposeId, body.missionId);
  if (!mission) {
    return NextResponse.json({ error: "미션을 찾을 수 없습니다." }, { status: 404 });
  }

  const mockMode = isMockEnabled();
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  // AI 모드인데 키가 없으면 목업으로 숨기지 않고 설정 오류를 그대로 알린다.
  if (!mockMode && !apiKey) {
    return NextResponse.json(
      { error: "USE_MOCK_AI=false인데 OPENAI_API_KEY가 설정되지 않았습니다. .env.local을 확인해주세요." },
      { status: 500 }
    );
  }

  if (body.action === "extract") {
    const prompt = (body.prompt ?? "").trim();
    if (!prompt) {
      return NextResponse.json({ error: "프롬프트가 비어 있습니다." }, { status: 400 });
    }

    if (mockMode) {
      return NextResponse.json({
        values: extractPromptValues(mission, prompt),
        engine: "mock" satisfies Engine,
        model: null,
      });
    }

    try {
      const values = await extractWithAI(apiKey as string, mission, prompt);
      return NextResponse.json({
        values,
        engine: "ai" satisfies Engine,
        model: getModel(),
      });
    } catch (error) {
      console.error("[coach] OpenAI 추출 실패:", error);
      return NextResponse.json(
        { error: `AI 응답을 받지 못했어요. (${error instanceof Error ? error.message : "알 수 없는 오류"})` },
        { status: 502 }
      );
    }
  }

  if (body.action === "normalize") {
    const answer = (body.answer ?? "").trim();
    const ingredient = mission.ingredients.find((i) => i.id === body.ingredientId);
    if (!answer || !ingredient) {
      return NextResponse.json({ error: "답변 또는 재료가 없습니다." }, { status: 400 });
    }

    if (mockMode) {
      return NextResponse.json({
        value: answer,
        engine: "mock" satisfies Engine,
        model: null,
      });
    }

    try {
      const value = await normalizeWithAI(apiKey as string, ingredient, answer);
      return NextResponse.json({
        value,
        engine: "ai" satisfies Engine,
        model: getModel(),
      });
    } catch (error) {
      console.error("[coach] OpenAI 정리 실패:", error);
      return NextResponse.json(
        { error: `AI 응답을 받지 못했어요. (${error instanceof Error ? error.message : "알 수 없는 오류"})` },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ error: "지원하지 않는 action입니다." }, { status: 400 });
}
