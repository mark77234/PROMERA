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

export type ChatRole = "assistant" | "user";

export interface ChatItem {
  id: string;
  role: ChatRole;
  kind: "text" | "feedback";
  text?: string;
  feedback?: Feedback;
}
