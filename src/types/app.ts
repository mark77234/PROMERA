export interface UserProfile {
  name: string;
  ageGroup: string;
  job: string;
  onboarded: boolean;
  surveyAnswers?: LevelSurveyAnswers;
  purposeId?: string;
  purposeLabel?: string;
  purposeDetail?: string;
  savedContext?: SavedContext;
  promptRecipes?: PromptRecipe[];
  trainingStats?: TrainingStats;
}

export interface LevelSurveyAnswers {
  frequency: string;
  tools: string[];
  whenBadAnswer: string;
  promptStyle: string;
  agentExperience: string;
  usage: string;
}

export type CoachCardKind =
  | "model"
  | "mcp"
  | "agent"
  | "process"
  | "planmode"
  | "docs";

export interface CoachCard {
  kind: CoachCardKind;
  badge: string;
  title: string;
  body: string;
}

export interface Feedback {
  praise: string[];
  improvements: string[];
  modelPrompt: string;
  coachCards: CoachCard[];
  nextChallenge: string;
}

export interface SavedContext {
  purposeId?: string;
  summary?: string;
  businessName?: string;
  location?: string;
  audience?: string;
  product?: string;
  tone?: string;
  platform?: string;
  role?: string;
  topic?: string;
  outputFormat?: string;
  constraints?: string;
}

export interface IngredientOption {
  label: string;
  value: string;
}

export interface PromptIngredient {
  id: string;
  label: string;
  missingLabel: string;
  question: string;
  why: string;
  placeholder: string;
  options: IngredientOption[];
  detect: string[];
  savedContextKey?: keyof SavedContext;
}

export interface Mission {
  id: string;
  /** AI 맞춤 미션이 기반으로 사용하는 서버 등록 미션 id */
  sourceMissionId?: string;
  purposeId: string;
  emoji: string;
  title: string;
  description: string;
  situation: string;
  starterPrompt: string;
  ingredients: PromptIngredient[];
  promptTemplate: string;
  recipeTemplate: string;
  beforePreview: string;
  afterPreviewTemplate: string;
}

export interface PersonalizedMission {
  id: string;
  sourceMissionId: string;
  purposeId: string;
  emoji: string;
  title: string;
  description: string;
  situation: string;
  starterPrompt: string;
}

export interface MissionGenerationResult {
  missions: PersonalizedMission[];
  engine: "mock" | "ai";
  model: string | null;
}

export interface MissionContext {
  title: string;
  description: string;
  situation: string;
}

export interface PromptDraft {
  missionId: string;
  originalPrompt: string;
  values: Record<string, string>;
  sources: Record<string, "prompt" | "saved" | "chip" | "typed">;
}

export interface IngredientStatus extends PromptIngredient {
  value?: string;
  source?: "prompt" | "saved" | "chip" | "typed";
}

export interface PromptAnalysis {
  presentIngredients: IngredientStatus[];
  missingIngredients: IngredientStatus[];
  nextQuestion?: string;
  nextIngredient?: PromptIngredient;
  chipOptions: IngredientOption[];
  improvedPrompt: string;
  improvements: string[];
  beforePreview: string;
  afterPreview: string;
  recipeTemplate: string;
  complete: boolean;
}

/** 코치 턴 응답 — 다음 질문 블록 (AI 모드에서는 실제 AI가 생성) */
export interface CoachNextContent {
  ingredientId: string;
  question: string;
  why: string;
  chips: IngredientOption[];
}

/** 코치 턴 응답 — 완성 블록 */
export interface CoachCompleteContent {
  improvedPrompt: string;
  improvements: string[];
  recipeTemplate: string;
}

/** /api/coach start·answer 액션의 공통 응답 */
export interface CoachTurnResult {
  /** start: 프롬프트에서 추출된 재료 값 */
  values?: Record<string, string>;
  /** answer: 정리된 답변 값 */
  value?: string;
  next: CoachNextContent | null;
  complete: CoachCompleteContent | null;
  engine: "mock" | "ai";
}

/** AI 개인화에 쓰이는 사용자 컨텍스트 */
export interface CoachProfile {
  name: string;
  ageGroup: string;
  job: string;
  purposeLabel: string;
  purposeDetail: string;
  surveyAnswers?: LevelSurveyAnswers;
}

export interface PromptRecipe {
  id: string;
  missionId: string;
  purposeId: string;
  title: string;
  template: string;
  prompt: string;
  createdAt: string;
}

export interface TrainingStats {
  qnaCount: number;
  completedPrompts: number;
  firstIngredientCount?: number;
  lastIngredientCount: number;
  bestIngredientCount: number;
  totalIngredientCount: number;
  startedAt?: string;
  lastPracticedAt?: string;
}

export type ChatRole = "assistant" | "user";

export interface ChatItem {
  id: string;
  role: ChatRole;
  kind: "text" | "feedback";
  text?: string;
  feedback?: Feedback;
}
