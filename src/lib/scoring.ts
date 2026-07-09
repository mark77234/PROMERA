// 프롬프트에서 5개 핵심 요소(목표·맥락·형식·조건·검증)의 존재 여부를
// 키워드·패턴으로 감지한다. 챗 피드백 엔진이 잘한 점/수정 방안을 고를 때 사용.

const RESULT_NOUN =
  /(홍보글|게시글|포스트|광고|문구|카피|글|리뷰|소개|콘텐츠|이메일|메일|보고서|기획서|요약|답변|캡션|스토리|스크립트|코드|기능|이미지|썸네일|포스터|시안|챗봇|목차|계획|일정)/;
const CHANNEL =
  /(인스타그램|인스타|블로그|페이스북|유튜브|스레드|트위터|엑스|카카오|네이버|틱톡|링크드인|슬랙|노션)/;
const REGION =
  /(부산|서울|대구|인천|광주|대전|울산|세종|경기|강원|충청|전라|경상|제주|해운대|서면|광안리|남포동|센텀|기장|동래|수영|전포)/;
const BIZ =
  /(카페|가게|식당|매장|음식점|베이커리|빵집|미용실|헬스장|학원|회사|팀|쇼핑몰|공방|서점|숙소|펜션|프로젝트|서비스|스타트업)/;
const BIZ_BACKGROUND = /(운영|하고 있|저는|나는|우리는|우리 팀|입니다|개발 중|만들고 있)/;
const AUDIENCE =
  /(\d+대|대학생|직장인|학생|주부|고객|손님|타겟|타깃|대상으로|가족|아이|어린이|관광객|외국인|초보자|사용자|유저)/;
const FORMAT_EXPLICIT =
  /(게시글|포스트|목록|리스트|표로|표 형태|카드뉴스|스크립트|초안|형식|양식|개조식|번호를 매겨|단계별|마크다운|json|JSON)/;
const LENGTH_NUM = /\d+\s*(자|줄|문장|단어|글자|분량|장|개 항목)/;
const TONE =
  /(말투|톤|어조|친근|밝고|밝은|정중|따뜻|재치|유머|진지|감성|전문적|간결하|캐주얼|격식)/;
const CONSTRAINT_WORD =
  /(해시태그|#|포함|넣어|들어가|제외|금지|빼고|강조|없이|유지|지키|따라|스타일|규칙|조건)/;
const COUNT_COND = /\d+\s*(개|가지|번)|\d+\s*(자|줄)\s*(이내|이하|내외)/;
const VERIFY_WORD =
  /(유도|이끌|첫 문장|첫문장|눈길|후킹|시선|기준|검증|확인할|체크|테스트|통과|완료 기준|반드시)/;

export type ElementKey = "goal" | "context" | "format" | "constraints" | "verify";

export const ELEMENT_KEYS: ElementKey[] = [
  "goal",
  "context",
  "format",
  "constraints",
  "verify",
];

export type PromptSignals = Record<ElementKey, boolean>;

export function analyzePrompt(prompt: string): PromptSignals {
  const p = prompt.trim();
  return {
    goal: RESULT_NOUN.test(p),
    context:
      REGION.test(p) || AUDIENCE.test(p) || (BIZ.test(p) && BIZ_BACKGROUND.test(p)),
    format: FORMAT_EXPLICIT.test(p) || LENGTH_NUM.test(p) || CHANNEL.test(p),
    constraints: TONE.test(p) || COUNT_COND.test(p) || CONSTRAINT_WORD.test(p),
    verify: VERIFY_WORD.test(p),
  };
}
