import {
  categoryContent,
  genericPraise,
  improvementByElement,
  praiseByElement,
} from "@/data/chat-content";
import { analyzePrompt, ELEMENT_KEYS } from "@/lib/scoring";
import { withHonorific } from "@/lib/utils";
import type { CoachCard, Feedback } from "@/types/app";

function getContent(purposeId: string) {
  return categoryContent[purposeId] ?? categoryContent.other;
}

/** 챗 진입 시 프롬이 에이전트의 첫 인사 + 첫 챌린지 */
export function buildIntroMessages(params: {
  name: string;
  purposeLabel: string;
  purposeDetail: string;
  purposeId: string;
}): string[] {
  const { name, purposeLabel, purposeDetail, purposeId } = params;
  const content = getContent(purposeId);
  const detail = purposeDetail.trim();
  const honorific = withHonorific(name);
  return [
    `${honorific}, 반가워요! 저는 ${honorific}의 AI 활용 코치 프롬이예요. 🙌\n\n"${detail.length > 80 ? detail.slice(0, 80) + "…" : detail}"\n\n${purposeLabel}, 좋은 목표예요. 강의를 듣는 대신 직접 프롬프트를 써보면서 배울 거예요. 제가 답을 대신 써주진 않지만, 매번 더 좋아지는 방법을 알려드릴게요.`,
    `그럼 바로 첫 번째 실습이에요! 💪\n\n${content.challenges[0]}\n\n지금 떠오르는 대로 AI에게 말하듯 편하게 입력해보세요. 완벽하지 않아도 괜찮아요.`,
  ];
}

/** 사용자 프롬프트에 대한 구조화 피드백 생성 (턴마다 코치 카드·챌린지 로테이션) */
export function generateFeedback(params: {
  prompt: string;
  purposeId: string;
  turn: number; // 0부터 시작하는 실습 턴 번호
}): Feedback {
  const { prompt, purposeId, turn } = params;
  const content = getContent(purposeId);
  const signals = analyzePrompt(prompt);

  const present = ELEMENT_KEYS.filter((key) => signals[key]);
  const missing = ELEMENT_KEYS.filter((key) => !signals[key]);

  const praise =
    present.length > 0
      ? present.slice(0, 2).map((key) => praiseByElement[key])
      : [genericPraise[turn % genericPraise.length]];

  const improvements = missing.slice(0, 3).map((key) => improvementByElement[key]);

  const { scaffold } = content;
  const request = prompt.trim().replace(/\s+/g, " ");
  const modelPrompt = [
    scaffold.role,
    scaffold.context,
    "",
    `요청: ${request}`,
    "",
    scaffold.format,
    scaffold.constraints,
    scaffold.done,
  ].join("\n");

  const pool = content.coachCards;
  const first = pool[(turn * 2) % pool.length];
  const second = pool[(turn * 2 + 1) % pool.length];
  const coachCards: CoachCard[] = first === second ? [first] : [first, second];

  const nextChallenge = content.challenges[(turn + 1) % content.challenges.length];

  return { praise, improvements, modelPrompt, coachCards, nextChallenge };
}

/** 피드백 뒤에 붙는 다음 챌린지 안내 멘트 */
export function buildNextChallengeMessage(feedback: Feedback, turn: number): string {
  const cheers = ["좋아요, 계속 가볼까요?", "한 단계 더 성장해봐요!", "이 감각, 잊기 전에 바로 다음!", "실력이 붙고 있어요. 다음 실습이에요!"];
  return `${cheers[turn % cheers.length]} 🎯\n\n${feedback.nextChallenge}`;
}
