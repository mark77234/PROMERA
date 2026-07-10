import type { Mission } from "@/types/app";

// /api/coach 호출 래퍼 — 서버가 목업/실제 AI를 결정한다.
// USE_MOCK_AI=false에서는 목업 폴백 없이 서버 오류를 그대로 던지고,
// 채팅 화면이 사용자에게 오류를 표시한다.

async function postCoach<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `코치 API 오류 (${res.status})`);
  }
  return data;
}

export async function extractValuesRemote(
  mission: Mission,
  prompt: string
): Promise<Record<string, string>> {
  const data = await postCoach<{ values?: Record<string, string> }>({
    action: "extract",
    purposeId: mission.purposeId,
    missionId: mission.id,
    prompt,
  });
  return data.values ?? {};
}

export async function normalizeAnswerRemote(
  mission: Mission,
  ingredientId: string,
  answer: string
): Promise<string> {
  const data = await postCoach<{ value?: string }>({
    action: "normalize",
    purposeId: mission.purposeId,
    missionId: mission.id,
    ingredientId,
    answer,
  });
  return data.value?.trim() || answer.trim();
}
