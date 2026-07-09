"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SendHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatSidebar } from "./chat-sidebar";
import { FeedbackBlocks } from "./feedback-blocks";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { categoryContent } from "@/data/chat-content";
import { getPurposeById } from "@/data/purpose-options";
import {
  buildIntroMessages,
  buildNextChallengeMessage,
  generateFeedback,
} from "@/lib/feedback-engine";
import type { ChatItem, UserProfile } from "@/types/app";

interface ChatScreenProps {
  user: UserProfile;
  onChangePurpose: () => void;
  onLogout: () => void;
}

let nextId = 0;
const uid = () => `msg-${++nextId}`;

export function ChatScreen({ user, onChangePurpose, onLogout }: ChatScreenProps) {
  const [items, setItems] = useState<ChatItem[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [turn, setTurn] = useState(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const initRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const purposeId = user.purposeId ?? "other";
  const purpose = getPurposeById(purposeId);
  const content = categoryContent[purposeId] ?? categoryContent.other;

  const later = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  // 첫 인사 + 첫 챌린지 (타이핑 연출과 함께)
  // StrictMode 이중 마운트에서 타이머가 정리되면 가드도 함께 되돌려 재예약한다.
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const [hello, challenge] = buildIntroMessages({
      name: user.name,
      purposeLabel: purpose.label,
      purposeDetail: user.purposeDetail ?? "",
      purposeId,
    });

    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    setTyping(true);
    schedule(() => {
      setTyping(false);
      setItems([{ id: uid(), role: "assistant", kind: "text", text: hello }]);
    }, 900);
    schedule(() => setTyping(true), 1300);
    schedule(() => {
      setTyping(false);
      setItems((prev) => [
        ...prev,
        { id: uid(), role: "assistant", kind: "text", text: challenge },
      ]);
    }, 2400);

    return () => {
      timers.forEach(clearTimeout);
      initRef.current = false;
      setTyping(false);
      setItems([]);
    };
  }, [user.name, user.purposeDetail, purpose.label, purposeId]);

  // 새 메시지·타이핑 시 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [items, typing]);

  const send = () => {
    const text = input.trim();
    if (!text || typing) return;

    setInput("");
    setItems((prev) => [...prev, { id: uid(), role: "user", kind: "text", text }]);
    setTyping(true);

    const delay = 1200 + Math.random() * 1000;
    later(() => {
      const feedback = generateFeedback({ prompt: text, purposeId, turn });
      setTyping(false);
      setItems((prev) => [...prev, { id: uid(), role: "assistant", kind: "feedback", feedback }]);

      // 잠시 후 다음 챌린지 제시 → 무한 학습 루프
      later(() => setTyping(true), 900);
      later(() => {
        setTyping(false);
        setItems((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            kind: "text",
            text: buildNextChallengeMessage(feedback, turn),
          },
        ]);
      }, 2100);

      setTurn((t) => t + 1);
    }, delay);
  };

  return (
    <div className="flex h-dvh bg-background">
      <ChatSidebar
        user={user}
        turn={turn}
        onChangePurpose={onChangePurpose}
        onLogout={onLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 모바일 상단 바 */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs text-primary-foreground md:hidden">
              PP
            </span>
            <span className="text-sm text-muted-foreground">
              {purpose.emoji} {purpose.label} 트레이닝
            </span>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
            실습 {turn}회 완료
          </span>
        </header>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
            {items.map((item) => (
              <MessageBubble key={item.id} role={item.role} wide={item.kind === "feedback"}>
                {item.kind === "feedback" && item.feedback ? (
                  <FeedbackBlocks feedback={item.feedback} />
                ) : (
                  item.text
                )}
              </MessageBubble>
            ))}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="shrink-0 border-t bg-background p-4">
          <div className="mx-auto max-w-3xl space-y-2">
            <button
              type="button"
              onClick={() => setInput(content.sampleAnswer)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary underline-offset-2 hover:underline"
            >
              <Sparkles className="size-3.5" /> 예시 답변으로 채우기
            </button>
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="AI에게 보낼 프롬프트를 직접 써보세요…"
                className="max-h-40 min-h-13 flex-1 resize-none rounded-2xl px-4 py-3.5 text-[15px]"
              />
              <Button
                size="lg"
                onClick={send}
                disabled={!input.trim() || typing}
                className="size-13 shrink-0 rounded-2xl p-0 transition-transform hover:scale-105 active:scale-95"
              >
                <SendHorizontal className="size-5" />
              </Button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">
              PP는 답을 대신 써주지 않아요. 직접 쓸수록 실력이 늘어요 💪
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
