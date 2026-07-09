"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  HelpCircle,
  RefreshCw,
  Save,
  SendHorizontal,
  Sparkles,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand-logo";
import { CopyButton } from "@/components/copy-button";
import { Mascot } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getMissionsByPurpose } from "@/data/prompt-missions";
import {
  analyzeDraft,
  createDraft,
  createRecipe,
  optionValue,
  updateDraftValue,
} from "@/lib/prompt-coach";
import { cn, withHonorific } from "@/lib/utils";
import type {
  IngredientStatus,
  Mission,
  PromptAnalysis,
  PromptDraft,
  UserProfile,
} from "@/types/app";
import { ChatSidebar } from "./chat-sidebar";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";

interface ChatScreenProps {
  user: UserProfile;
  onUpdateUser: (patch: Partial<UserProfile>) => void;
  onChangePurpose: () => void;
  onLogout: () => void;
}

interface CoachEvent {
  title: string;
  body: string;
  badge: string;
}

type CoachChatItem =
  | {
      id: string;
      role: "assistant" | "user";
      kind: "text";
      text: string;
    }
  | {
      id: string;
      role: "assistant";
      kind: "missions";
    }
  | {
      id: string;
      role: "assistant";
      kind: "coach";
      mission: Mission;
      analysis: PromptAnalysis;
      phase: "first" | "answer";
    }
  | {
      id: string;
      role: "assistant";
      kind: "result";
      mission: Mission;
      draft: PromptDraft;
      analysis: PromptAnalysis;
    }
  | {
      id: string;
      role: "assistant";
      kind: "event";
      event: CoachEvent;
    };

let nextId = 0;
const uid = () => `msg-${++nextId}`;

const repeatEvents: CoachEvent[] = [
  {
    title: "반복 감지 이벤트",
    body: "같은 말이 다시 들어왔어요. 이번에는 답을 길게 설명하지 않고, 빠진 재료 하나만 콕 집어서 이어갈게요.",
    badge: "PROMERA EVENT",
  },
  {
    title: "프롬이 질문 전환",
    body: "비슷한 입력이 반복돼서 질문 방식을 바꿨어요. 버튼 하나를 눌러도 프롬프트가 앞으로 나아가게 만들게요.",
    badge: "NEW ANGLE",
  },
  {
    title: "막힘 해소 모드",
    body: "지금은 더 잘 쓰려고 애쓰기보다 빈칸을 하나씩 채우는 게 좋아요. 다음 질문만 답하면 됩니다.",
    badge: "COACH MODE",
  },
];

const milestoneEvent: CoachEvent = {
  title: "재료 3개 완성",
  body: "좋아요. 이제 AI가 대충 쓰는 단계는 지났어요. 남은 재료만 채우면 결과물이 확 달라집니다.",
  badge: "LEVEL UP",
};

function sourceLabel(source?: IngredientStatus["source"]) {
  if (source === "prompt") return "입력에서 찾음";
  if (source === "saved") return "저장 정보";
  if (source === "chip") return "선택 완료";
  if (source === "typed") return "직접 입력";
  return "";
}

function normalizeRepeatKey(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function IngredientRows({
  title,
  empty,
  items,
  checked,
}: {
  title: string;
  empty: string;
  items: IngredientStatus[];
  checked: boolean;
}) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-background/80 p-3">
      <p className="text-xs font-extrabold text-foreground">{title}</p>
      <div className="mt-2 space-y-1.5">
        {items.length === 0 ? (
          <p className="rounded-xl bg-secondary/60 px-3 py-2 text-xs font-semibold text-muted-foreground">
            {empty}
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-2 rounded-xl px-3 py-2 text-sm",
                checked ? "animate-ingredient-pop bg-secondary/70" : "bg-muted/70"
              )}
            >
              {checked ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              ) : (
                <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <span className="font-semibold">
                  {checked ? item.label : item.missingLabel}
                </span>
                {item.value && (
                  <span className="ml-1 text-muted-foreground">: {item.value}</span>
                )}
                {checked && item.source && (
                  <p className="mt-0.5 text-[11px] font-bold text-primary/80">
                    {sourceLabel(item.source)}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MissionPickerMessage({
  missions,
  onSelect,
}: {
  missions: Mission[];
  onSelect: (mission: Mission) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Mascot name="seat" className="size-16 animate-prom-bob" sizes="64px" />
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
            PROMERA Mission
          </p>
          <p className="mt-1 text-lg font-extrabold">오늘의 미션을 골라보세요</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            챗봇처럼 대화하면서 필요한 재료를 하나씩 채워볼게요.
          </p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {missions.map((mission, index) => (
          <button
            key={mission.id}
            type="button"
            onClick={() => onSelect(mission)}
            className="group animate-in fade-in slide-in-from-bottom-2 fill-mode-both rounded-2xl border border-primary/10 bg-background/90 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-secondary/50"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-2xl">{mission.emoji}</span>
              <ArrowRight className="size-4 text-primary opacity-70 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 font-extrabold text-foreground">{mission.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {mission.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function CoachEventMessage({ event }: { event: CoachEvent }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-secondary/70 p-4 text-secondary-foreground">
      <span className="pointer-events-none absolute right-7 top-5 animate-save-sparkle" />
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
        {event.badge}
      </p>
      <p className="mt-1 flex items-center gap-2 font-extrabold">
        <Wand2 className="size-4" /> {event.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed">{event.body}</p>
    </div>
  );
}

function CoachMessage({
  analysis,
  active,
  onPick,
}: {
  analysis: PromptAnalysis;
  active: boolean;
  onPick: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <IngredientRows
          title="지금 프롬프트에 들어간 것"
          empty="아직 확인된 재료가 없어요."
          items={analysis.presentIngredients}
          checked
        />
        <IngredientRows
          title="아직 부족한 것"
          empty="필요한 재료가 모두 들어갔어요."
          items={analysis.missingIngredients}
          checked={false}
        />
      </div>

      {analysis.nextIngredient && (
        <div className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-primary/15 bg-secondary/60 p-4 duration-300">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
            다음 질문
          </p>
          <p className="mt-1 text-lg font-extrabold text-foreground">
            {analysis.nextIngredient.question}
          </p>
          <div className="mt-3 rounded-2xl bg-background/80 p-3 text-sm leading-relaxed">
            <p className="flex items-center gap-1.5 font-extrabold">
              <HelpCircle className="size-4 text-primary" /> 왜 이렇게 물어봐야 할까요?
            </p>
            <p className="mt-1 text-muted-foreground">{analysis.nextIngredient.why}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.chipOptions.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onPick(optionValue(option))}
                disabled={!active}
                className="rounded-full border border-primary/15 bg-background px-3.5 py-2 text-sm font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">
            직접 쓰고 싶으면 아래 입력창에 답해도 돼요.
          </p>
        </div>
      )}
    </div>
  );
}

function ResultMessage({
  draft,
  analysis,
  saved,
  onSave,
  onRestart,
}: {
  draft: PromptDraft;
  analysis: PromptAnalysis;
  saved: boolean;
  onSave: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Mascot name="reward" className="size-16 animate-prom-bob" sizes="64px" />
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
            완성
          </p>
          <p className="mt-1 text-lg font-extrabold">
            프롬프트가 훨씬 구체적이 됐어요
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            점수 대신 무엇이 좋아졌는지 바로 볼 수 있게 정리했어요.
          </p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-primary/10 bg-background/80 p-4">
          <p className="text-xs font-extrabold text-muted-foreground">Before</p>
          <p className="mt-2 whitespace-pre-wrap rounded-xl bg-muted/70 p-3 text-sm leading-relaxed">
            {draft.originalPrompt}
          </p>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-secondary/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-extrabold text-primary">After</p>
            <CopyButton text={analysis.improvedPrompt} label="복사" />
          </div>
          <p className="mt-2 whitespace-pre-wrap rounded-xl bg-background/85 p-3 text-sm font-semibold leading-relaxed">
            {analysis.improvedPrompt}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/10 bg-background/80 p-4">
        <p className="text-sm font-extrabold">좋아진 점</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {analysis.improvements.map((line) => (
            <p
              key={line}
              className="animate-ingredient-pop flex items-center gap-2 rounded-xl bg-secondary/70 px-3 py-2 text-sm font-semibold"
            >
              <CheckCircle2 className="size-4 shrink-0 text-primary" />
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-primary/10 bg-background/80 p-4">
          <p className="text-xs font-extrabold text-muted-foreground">처음 결과</p>
          <p className="mt-2 text-sm leading-relaxed">{analysis.beforePreview}</p>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary text-primary-foreground p-4">
          <p className="text-xs font-extrabold opacity-80">개선 결과</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed">
            {analysis.afterPreview}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-background/85 p-4">
        {saved && <span className="pointer-events-none absolute right-7 top-5 animate-save-sparkle" />}
        <p className="text-sm font-extrabold">내 프롬프트 레시피</p>
        <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-muted/70 p-3 font-sans text-sm leading-relaxed">
          {analysis.recipeTemplate}
        </pre>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onRestart}
            className="h-10 rounded-xl font-bold"
          >
            <RefreshCw className="size-4" /> 다시 연습
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={saved}
            className="h-10 rounded-xl font-bold"
          >
            <Save className="size-4" /> {saved ? "저장됨" : "레시피 저장"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ChatScreen({
  user,
  onUpdateUser,
  onChangePurpose,
  onLogout,
}: ChatScreenProps) {
  const purposeId = user.purposeId ?? "other";
  const missions = useMemo(() => getMissionsByPurpose(purposeId), [purposeId]);
  const recipes = user.promptRecipes ?? [];
  const [items, setItems] = useState<CoachChatItem[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [draft, setDraft] = useState<PromptDraft | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [savedResultIds, setSavedResultIds] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const initRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const repeatMapRef = useRef<Record<string, number>>({});
  const milestoneRef = useRef<Set<string>>(new Set());

  const currentAnalysis =
    selectedMission && draft ? analyzeDraft(selectedMission, draft) : null;

  const later = useCallback((fn: () => void, ms: number) => {
    const timer = setTimeout(fn, ms);
    timersRef.current.push(timer);
  }, []);

  const scheduleAssistant = useCallback(
    (nextItems: CoachChatItem[], delay = 850) => {
      setTyping(true);
      later(() => {
        setTyping(false);
        setItems((prev) => [...prev, ...nextItems]);
      }, delay);
    },
    [later]
  );

  const registerRepeatEvent = (text: string) => {
    const key = normalizeRepeatKey(text);
    if (!key) return null;
    const nextCount = (repeatMapRef.current[key] ?? 0) + 1;
    repeatMapRef.current[key] = nextCount;
    if (nextCount < 2) return null;
    return repeatEvents[(nextCount - 2) % repeatEvents.length];
  };

  const buildResponseItems = (
    mission: Mission,
    nextDraft: PromptDraft,
    phase: "first" | "answer",
    events: CoachEvent[] = []
  ) => {
    const analysis = analyzeDraft(mission, nextDraft);
    const eventItems: CoachChatItem[] = events.map((event) => ({
      id: uid(),
      role: "assistant",
      kind: "event",
      event,
    }));

    if (analysis.complete) {
      setActiveQuestionId(null);
      return [
        ...eventItems,
        {
          id: uid(),
          role: "assistant",
          kind: "result",
          mission,
          draft: nextDraft,
          analysis,
        } satisfies CoachChatItem,
      ];
    }

    const coachId = uid();
    setActiveQuestionId(coachId);
    return [
      ...eventItems,
      {
        id: coachId,
        role: "assistant",
        kind: "coach",
        mission,
        analysis,
        phase,
      } satisfies CoachChatItem,
    ];
  };

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const honorific = withHonorific(user.name);
    const detail = (user.purposeDetail ?? "").trim();
    const clippedDetail = detail.length > 80 ? `${detail.slice(0, 80)}...` : detail;

    setTyping(true);
    later(() => {
      setTyping(false);
      setItems([
        {
          id: uid(),
          role: "assistant",
          kind: "text",
          text: `${honorific}, 반가워요. 저는 AI 활용 코치 프롬이예요.\n\n${clippedDetail ? `"${clippedDetail}"\n\n` : ""}이제 점수 대신 프롬프트에 필요한 재료를 하나씩 채워볼게요.`,
        },
      ]);
    }, 800);
    later(() => setTyping(true), 1150);
    later(() => {
      setTyping(false);
      setItems((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          kind: "missions",
        },
      ]);
    }, 1900);

    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      initRef.current = false;
      setTyping(false);
      setItems([]);
    };
  }, [later, user.name, user.purposeDetail]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [items, typing]);

  const chooseMission = (mission: Mission) => {
    if (typing) return;
    setSelectedMission(mission);
    setDraft(null);
    setInput("");
    setActiveQuestionId(null);
    setSavedResultIds([]);
    setItems((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: mission.title },
    ]);
    scheduleAssistant([
      {
        id: uid(),
        role: "assistant",
        kind: "text",
        text: `${mission.emoji} 좋아요. "${mission.situation}"\n\n먼저 AI에게 어떻게 말할지 아래 입력창에 편하게 써보세요. 완벽하지 않아도 제가 빠진 재료를 하나씩 물어볼게요.`,
      },
    ]);
  };

  const startDraft = (text: string) => {
    const mission = selectedMission ?? missions[0];
    const repeatEvent = registerRepeatEvent(text);
    const nextDraft = createDraft(mission, text, user.savedContext);
    setSelectedMission(mission);
    setDraft(nextDraft);
    setInput("");
    setItems((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text },
    ]);

    const events = repeatEvent ? [repeatEvent] : [];
    scheduleAssistant(buildResponseItems(mission, nextDraft, "first", events), 950);
  };

  const submitIngredientAnswer = (value: string, source: "chip" | "typed") => {
    if (!selectedMission || !draft || !currentAnalysis?.nextIngredient) return;
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    const ingredient = currentAnalysis.nextIngredient;
    const repeatEvent = registerRepeatEvent(trimmedValue);
    if (repeatEvent && source === "typed") {
      setInput("");
      setItems((prev) => [
        ...prev,
        { id: uid(), role: "user", kind: "text", text: trimmedValue },
      ]);
      scheduleAssistant(
        buildResponseItems(selectedMission, draft, "answer", [repeatEvent]),
        750
      );
      return;
    }

    const nextDraft = updateDraftValue(draft, ingredient.id, trimmedValue, source);
    const nextAnalysis = analyzeDraft(selectedMission, nextDraft);
    const nextEvents: CoachEvent[] = [];
    const milestoneKey = `${selectedMission.id}-3`;

    if (repeatEvent) nextEvents.push(repeatEvent);
    if (
      nextAnalysis.presentIngredients.length >= 3 &&
      !nextAnalysis.complete &&
      !milestoneRef.current.has(milestoneKey)
    ) {
      milestoneRef.current.add(milestoneKey);
      nextEvents.push(milestoneEvent);
    }

    setDraft(nextDraft);
    setInput("");
    setItems((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: trimmedValue },
    ]);

    if (ingredient.savedContextKey) {
      onUpdateUser({
        savedContext: {
          ...user.savedContext,
          purposeId,
          [ingredient.savedContextKey]: trimmedValue,
        },
      });
    }

    scheduleAssistant(buildResponseItems(selectedMission, nextDraft, "answer", nextEvents), 850);
  };

  const send = () => {
    const text = input.trim();
    if (!text || typing) return;

    if (draft && currentAnalysis?.nextIngredient) {
      submitIngredientAnswer(text, "typed");
      return;
    }

    startDraft(text);
  };

  const saveRecipe = (
    resultId: string,
    mission: Mission,
    analysis: PromptAnalysis
  ) => {
    if (savedResultIds.includes(resultId)) return;
    const recipe = createRecipe(mission, analysis, purposeId);
    onUpdateUser({
      promptRecipes: [recipe, ...recipes].slice(0, 12),
    });
    setSavedResultIds((prev) => [...prev, resultId]);
    toast.success("프롬프트 레시피를 저장했어요.");
  };

  const restartMission = (mission: Mission) => {
    setSelectedMission(mission);
    setDraft(null);
    setInput(mission.starterPrompt);
    setActiveQuestionId(null);
    scheduleAssistant([
      {
        id: uid(),
        role: "assistant",
        kind: "text",
        text: "좋아요. 같은 미션으로 다시 연습해볼게요. 예시 프롬프트를 넣어뒀으니 바로 보내도 됩니다.",
      },
    ], 500);
  };

  const fillExample = () => {
    const mission = selectedMission ?? missions[0];
    setSelectedMission(mission);
    setInput(mission.starterPrompt);
  };

  const inputPlaceholder = currentAnalysis?.nextIngredient
    ? currentAnalysis.nextIngredient.placeholder
    : selectedMission
      ? selectedMission.starterPrompt
      : "미션을 고르거나, 지금 만들고 싶은 프롬프트를 입력해보세요.";

  return (
    <div className="flex h-dvh bg-background">
      <ChatSidebar
        user={user}
        turn={recipes.length}
        recipes={recipes}
        onChangePurpose={onChangePurpose}
        onLogout={onLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-primary/10 bg-background/90 px-4 backdrop-blur md:px-6">
          <div className="flex min-w-0 items-center gap-2 font-bold">
            <BrandLogo size="sm" showText={false} className="md:hidden" />
            <span className="truncate text-sm text-muted-foreground">
              {selectedMission
                ? `${selectedMission.emoji} ${selectedMission.title}`
                : "PROMERA 코칭 챗봇"}
            </span>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
            레시피 {recipes.length}개
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
            {items.map((item) => {
              if (item.kind === "missions") {
                return (
                  <MessageBubble key={item.id} role="assistant" wide>
                    <MissionPickerMessage missions={missions} onSelect={chooseMission} />
                  </MessageBubble>
                );
              }
              if (item.kind === "coach") {
                return (
                  <MessageBubble key={item.id} role="assistant" wide>
                    <CoachMessage
                      analysis={item.analysis}
                      active={item.id === activeQuestionId && !typing}
                      onPick={(value) => submitIngredientAnswer(value, "chip")}
                    />
                  </MessageBubble>
                );
              }
              if (item.kind === "result") {
                return (
                  <MessageBubble key={item.id} role="assistant" wide>
                    <ResultMessage
                      draft={item.draft}
                      analysis={item.analysis}
                      saved={savedResultIds.includes(item.id)}
                      onSave={() => saveRecipe(item.id, item.mission, item.analysis)}
                      onRestart={() => restartMission(item.mission)}
                    />
                  </MessageBubble>
                );
              }
              if (item.kind === "event") {
                return (
                  <MessageBubble key={item.id} role="assistant" wide>
                    <CoachEventMessage event={item.event} />
                  </MessageBubble>
                );
              }
              return (
                <MessageBubble key={item.id} role={item.role}>
                  {item.text}
                </MessageBubble>
              );
            })}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </main>

        <div className="shrink-0 border-t border-primary/10 bg-background/95 p-4 backdrop-blur">
          <div className="mx-auto max-w-3xl space-y-2">
            <button
              type="button"
              onClick={fillExample}
              className="flex items-center gap-1.5 text-xs font-extrabold text-primary underline-offset-2 hover:underline"
            >
              <Sparkles className="size-3.5" /> 예시 프롬프트 채우기
            </button>
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    send();
                  }
                }}
                placeholder={inputPlaceholder}
                className="max-h-40 min-h-13 flex-1 resize-none rounded-2xl border-primary/15 bg-card px-4 py-3.5 text-[15px] shadow-sm focus-visible:ring-primary/25"
              />
              <Button
                size="lg"
                onClick={send}
                disabled={!input.trim() || typing}
                className="size-13 shrink-0 rounded-2xl p-0 transition-transform hover:scale-105 active:scale-95"
              >
                {currentAnalysis?.nextIngredient ? (
                  <Check className="size-5" />
                ) : (
                  <SendHorizontal className="size-5" />
                )}
              </Button>
            </div>
            <p className="text-center text-[11px] font-semibold text-muted-foreground">
              PROMERA는 답을 대신 끝내기보다, 좋은 질문을 직접 완성하도록 도와줘요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
