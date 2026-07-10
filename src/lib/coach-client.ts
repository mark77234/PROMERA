import type { CoachProfile, CoachTurnResult, Mission } from "@/types/app";

async function postCoach(body: Record<string, unknown>): Promise<CoachTurnResult> {
  const response = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as CoachTurnResult & {
    error?: string;
  };
  if (!response.ok) {
    throw new Error(data.error || `코치 API 오류 (${response.status})`);
  }
  return data;
}

export function startCoachTurn(
  mission: Mission,
  prompt: string,
  savedValues: Record<string, string>,
  profile: CoachProfile
): Promise<CoachTurnResult> {
  return postCoach({
    action: "start",
    purposeId: mission.purposeId,
    missionId: mission.id,
    prompt,
    savedValues,
    profile,
  });
}

export function answerCoachTurn(
  mission: Mission,
  originalPrompt: string,
  knownValues: Record<string, string>,
  ingredientId: string,
  answer: string,
  profile: CoachProfile
): Promise<CoachTurnResult> {
  return postCoach({
    action: "answer",
    purposeId: mission.purposeId,
    missionId: mission.id,
    originalPrompt,
    knownValues,
    ingredientId,
    answer,
    profile,
  });
}
