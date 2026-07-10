import type {
  CoachProfile,
  CoachTurnResult,
  Mission,
  MissionContext,
  MissionGenerationResult,
} from "@/types/app";

async function postJson<T>(
  endpoint: string,
  body: Record<string, unknown>,
  errorLabel: string
): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || `${errorLabel} (${response.status})`);
  }
  return data;
}

function missionContext(mission: Mission): MissionContext {
  return {
    title: mission.title,
    description: mission.description,
    situation: mission.situation,
  };
}

export function generatePersonalizedMissions(
  purposeId: string,
  profile: CoachProfile
): Promise<MissionGenerationResult> {
  return postJson<MissionGenerationResult>(
    "/api/missions",
    { purposeId, profile },
    "미션 생성 API 오류"
  );
}

export function startCoachTurn(
  mission: Mission,
  prompt: string,
  savedValues: Record<string, string>,
  profile: CoachProfile
): Promise<CoachTurnResult> {
  return postJson<CoachTurnResult>("/api/coach", {
    action: "start",
    purposeId: mission.purposeId,
    missionId: mission.sourceMissionId ?? mission.id,
    prompt,
    savedValues,
    profile,
    missionContext: missionContext(mission),
  }, "코치 API 오류");
}

export function answerCoachTurn(
  mission: Mission,
  originalPrompt: string,
  knownValues: Record<string, string>,
  ingredientId: string,
  answer: string,
  profile: CoachProfile
): Promise<CoachTurnResult> {
  return postJson<CoachTurnResult>("/api/coach", {
    action: "answer",
    purposeId: mission.purposeId,
    missionId: mission.sourceMissionId ?? mission.id,
    originalPrompt,
    knownValues,
    ingredientId,
    answer,
    profile,
    missionContext: missionContext(mission),
  }, "코치 API 오류");
}
