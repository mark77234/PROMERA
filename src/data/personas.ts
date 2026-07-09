export interface Persona {
  emoji: string;
  tag: string;
  title: string;
  story: string;
}

export const personas: Persona[] = [
  {
    emoji: "🧒",
    tag: "B2C · 어린이 학습",
    title: "아이가 AI와 대화하며 스스로 배워요",
    story:
      "초등학생 지우는 PP와 대화하며 궁금한 걸 질문하는 법을 배웠어요. 이제 숙제를 베끼는 대신, AI에게 좋은 질문을 던지며 스스로 답을 찾아요.",
  },
  {
    emoji: "👵",
    tag: "B2G · 시니어 디지털 교육",
    title: "어르신이 AI 사용법을 자연스럽게 익혀요",
    story:
      "스마트폰도 어려웠던 김 여사님은 PP의 친절한 코칭 질문을 따라가며 AI에게 말 거는 법을 배웠어요. 이제 병원 예약 문의도 AI로 해결해요.",
  },
  {
    emoji: "📣",
    tag: "B2C · 마케터",
    title: "AI가 어렵던 마케터가 콘텐츠를 쏟아내요",
    story:
      "홍보글이 막막했던 1인 카페 사장님이 PP에서 프롬프트를 훈련한 뒤, 인스타 콘텐츠를 매일 직접 만들어 방문 고객이 늘었어요.",
  },
  {
    emoji: "📄",
    tag: "B2B · 직장인",
    title: "보고서 작성 시간이 절반으로 줄었어요",
    story:
      "기획서 초안에 하루를 쓰던 대리님이 맥락·형식·조건을 넣는 프롬프트 습관을 익히고, 문서 초안 작성 시간을 절반으로 줄였어요.",
  },
  {
    emoji: "🎨",
    tag: "B2C · 디자이너",
    title: "디자이너의 이미지 생성 활용력이 올라갔어요",
    story:
      "생성 AI 결과물이 늘 아쉬웠던 디자이너가 스타일·구도·조명을 지정하는 법을 훈련해, 시안 탐색 속도가 3배 빨라졌어요.",
  },
  {
    emoji: "💻",
    tag: "B2B · 개발자",
    title: "바이브코딩을 잘하고 싶던 개발자의 성공사례",
    story:
      "AI 코딩이 손에 안 익던 개발자가 Plan 모드, AGENTS.md, MCP 활용법을 배우고 에이전트에게 일을 맡기는 법을 익혀 개발 속도가 달라졌어요.",
  },
];

export const businessModels = [
  {
    emoji: "🙋",
    title: "B2C 개인 학습",
    description:
      "누구나 무료로 시작하는 AI 활용 트레이닝. 대화하며 배우는 나만의 AI 코치.",
  },
  {
    emoji: "🏢",
    title: "B2B 기업 교육",
    description:
      "임직원 AI 역량을 실습 기반으로 훈련. 팀별 맞춤 커리큘럼과 활용 격차 해소.",
  },
  {
    emoji: "🏛️",
    title: "B2G 공공·지자체",
    description:
      "시니어·소상공인 디지털 교육 프로그램. 지역 AI 활용 격차를 좁히는 훈련 인프라.",
  },
];
