export interface PurposeOption {
  id: string;
  label: string;
  description: string;
  emoji: string;
  detailPlaceholder: string;
  detailExample: string;
}

export const purposeOptions: PurposeOption[] = [
  {
    id: "marketing",
    label: "홍보 콘텐츠 제작",
    description: "SNS 게시글, 광고 문구, 홍보글 만들기",
    emoji: "📣",
    detailPlaceholder: "예: 어떤 상품·서비스를, 어떤 채널에서, 누구에게 홍보하고 싶나요?",
    detailExample:
      "부산 해운대에서 개인 카페를 운영 중이에요. 20대 손님을 대상으로 신메뉴를 알리는 인스타그램 게시글을 잘 만들고 싶어요.",
  },
  {
    id: "document",
    label: "업무 문서 작성",
    description: "보고서, 기획서, 이메일 작성",
    emoji: "📄",
    detailPlaceholder: "예: 어떤 문서를, 누구에게 보고하기 위해 작성하나요?",
    detailExample:
      "마케팅팀 대리인데, 매주 팀장님께 올리는 주간 성과 보고서와 협력사 제안 메일을 AI로 빠르게 잘 쓰고 싶어요.",
  },
  {
    id: "chatbot",
    label: "챗봇 활용",
    description: "고객 응대, 자동 답변 만들기",
    emoji: "💬",
    detailPlaceholder: "예: 어떤 고객 문의를 챗봇으로 처리하고 싶나요?",
    detailExample:
      "온라인 쇼핑몰을 운영해요. 배송·교환·환불 문의가 반복되는데, AI 챗봇으로 자동 응대하는 법을 배우고 싶어요.",
  },
  {
    id: "image",
    label: "이미지 생성",
    description: "포스터, 썸네일, 제품 이미지 만들기",
    emoji: "🎨",
    detailPlaceholder: "예: 어떤 용도의 이미지를 어떤 스타일로 만들고 싶나요?",
    detailExample:
      "유튜브 썸네일과 인스타 카드뉴스를 직접 만들어요. 원하는 스타일과 구도를 AI에게 정확히 지시하는 법을 배우고 싶어요.",
  },
  {
    id: "vibecoding",
    label: "바이브코딩 · 에이전트",
    description: "AI 에이전트로 코딩·자동화하기",
    emoji: "🤖",
    detailPlaceholder: "예: 어떤 프로젝트를 AI 에이전트와 함께 만들고 싶나요?",
    detailExample:
      "웹 개발자인데 Claude Code 같은 코딩 에이전트를 잘 못 다뤄요. 사이드 프로젝트를 에이전트와 함께 빠르게 만드는 법을 배우고 싶어요.",
  },
  {
    id: "other",
    label: "기타",
    description: "나만의 목적을 직접 알려주세요",
    emoji: "✨",
    detailPlaceholder: "예: AI로 해결하고 싶은 일을 자유롭게 적어주세요.",
    detailExample:
      "여행 계획 짜기, 자기소개서 다듬기, 영어 공부 등 일상에서 AI를 더 똑똑하게 쓰고 싶어요.",
  },
];

export function getPurposeById(id: string): PurposeOption {
  return purposeOptions.find((p) => p.id === id) ?? purposeOptions[purposeOptions.length - 1];
}
