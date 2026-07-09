import type { LevelSurveyAnswers } from "@/types/app";

export interface LevelSurveyQuestion {
  id: keyof LevelSurveyAnswers;
  question: string;
  description: string;
  multiSelect?: boolean;
  options: { label: string; emoji: string }[];
}

export const levelSurveyQuestions: LevelSurveyQuestion[] = [
  {
    id: "frequency",
    question: "AI를 얼마나 자주 사용하시나요?",
    description: "챗GPT, 클로드, 제미나이 등 어떤 AI든 좋아요.",
    options: [
      { label: "거의 사용해본 적 없어요", emoji: "🌱" },
      { label: "한 달에 몇 번 사용해요", emoji: "🙂" },
      { label: "일주일에 몇 번 사용해요", emoji: "💪" },
      { label: "거의 매일 사용해요", emoji: "🔥" },
    ],
  },
  {
    id: "tools",
    question: "사용해본 AI 도구를 모두 골라주세요",
    description: "여러 개 선택할 수 있어요.",
    multiSelect: true,
    options: [
      { label: "ChatGPT", emoji: "💬" },
      { label: "Claude", emoji: "🤖" },
      { label: "Gemini", emoji: "✨" },
      { label: "이미지 생성 AI (미드저니 등)", emoji: "🎨" },
      { label: "코딩 AI (Copilot, Claude Code 등)", emoji: "💻" },
      { label: "아직 없어요", emoji: "🌱" },
    ],
  },
  {
    id: "whenBadAnswer",
    question: "AI가 원하는 답을 주지 않으면 어떻게 하시나요?",
    description: "가장 가까운 행동 하나를 골라주세요.",
    options: [
      { label: "같은 질문을 다시 입력해요", emoji: "🔁" },
      { label: "질문을 더 자세히 바꿔서 물어봐요", emoji: "✏️" },
      { label: "조건을 추가하며 여러 번 수정 요청해요", emoji: "🎯" },
      { label: "포기하고 직접 해요", emoji: "😮‍💨" },
    ],
  },
  {
    id: "promptStyle",
    question: "AI에게 질문할 때 어떤 정보까지 넣으시나요?",
    description: "평소 프롬프트를 떠올려보세요.",
    options: [
      { label: "하고 싶은 일만 짧게 말해요", emoji: "🗣️" },
      { label: "배경 상황도 함께 설명해요", emoji: "📖" },
      { label: "원하는 형식·조건까지 지정해요", emoji: "📐" },
      { label: "역할·예시·검증 기준까지 설계해요", emoji: "🏗️" },
    ],
  },
  {
    id: "agentExperience",
    question: "AI 에이전트나 자동화를 써본 적 있나요?",
    description: "AI가 여러 단계를 스스로 처리하게 해본 경험이에요.",
    options: [
      { label: "에이전트가 뭔지 처음 들어봐요", emoji: "❓" },
      { label: "들어봤지만 써본 적은 없어요", emoji: "👀" },
      { label: "간단한 자동화를 해봤어요", emoji: "⚙️" },
      { label: "에이전트·MCP를 활용하고 있어요", emoji: "🚀" },
    ],
  },
  {
    id: "usage",
    question: "AI를 주로 어디에 쓰시나요?",
    description: "가장 비중이 큰 쪽 하나를 골라주세요.",
    options: [
      { label: "궁금한 것을 물어보는 용도", emoji: "🔍" },
      { label: "학교·학습 과제", emoji: "🎓" },
      { label: "업무·부업에 활용", emoji: "💼" },
      { label: "업무 핵심 도구로 매일 활용", emoji: "🏆" },
    ],
  },
];
