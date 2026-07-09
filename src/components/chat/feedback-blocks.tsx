"use client";

import { CheckCircle2, Wrench } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import type { Feedback } from "@/types/app";

const KIND_STYLE: Record<string, string> = {
  model: "bg-blue-50 border-blue-200 text-blue-900",
  mcp: "bg-emerald-50 border-emerald-200 text-emerald-900",
  agent: "bg-amber-50 border-amber-200 text-amber-900",
  process: "bg-rose-50 border-rose-200 text-rose-900",
  planmode: "bg-indigo-50 border-indigo-200 text-indigo-900",
  docs: "bg-teal-50 border-teal-200 text-teal-900",
};

interface FeedbackBlocksProps {
  feedback: Feedback;
}

export function FeedbackBlocks({ feedback }: FeedbackBlocksProps) {
  return (
    <div className="space-y-4">
      {/* 잘한 점 */}
      <div className="space-y-1.5">
        <p className="text-sm font-bold text-emerald-700">✅ 잘한 점</p>
        {feedback.praise.map((line) => (
          <p key={line} className="flex gap-2 text-[15px] leading-relaxed">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-500" />
            {line}
          </p>
        ))}
      </div>

      {/* 수정 방안 */}
      {feedback.improvements.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-sm font-bold text-amber-700">🔧 이렇게 업그레이드해보세요</p>
          {feedback.improvements.map((line) => (
            <p key={line} className="flex gap-2 text-[15px] leading-relaxed">
              <Wrench className="mt-1 size-4 shrink-0 text-amber-500" />
              {line}
            </p>
          ))}
        </div>
      )}

      {/* 모범 프롬프트 */}
      <div className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-background">
        <div className="flex items-center justify-between border-b bg-secondary/50 px-4 py-2.5">
          <span className="text-sm font-bold text-secondary-foreground">
            💡 모범 프롬프트
          </span>
          <CopyButton text={feedback.modelPrompt} label="복사" />
        </div>
        <pre className="whitespace-pre-wrap px-4 py-3.5 font-sans text-sm leading-relaxed text-foreground">
          {feedback.modelPrompt}
        </pre>
      </div>

      {/* 코치 카드 */}
      <div className="grid gap-3 sm:grid-cols-2">
        {feedback.coachCards.map((card, idx) => (
          <div
            key={card.title}
            className={`animate-in fade-in slide-in-from-bottom-3 fill-mode-both rounded-2xl border-2 p-4 duration-700 ${KIND_STYLE[card.kind] ?? KIND_STYLE.process}`}
            style={{ animationDelay: `${300 + idx * 200}ms` }}
          >
            <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide">
              {card.badge}
            </span>
            <p className="mt-2 text-sm font-bold">{card.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed opacity-90">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
