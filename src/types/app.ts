export interface UserProfile {
  email: string;
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
