"use client";

import { Mascot } from "@/components/mascot";

export function TypingIndicator() {
  return (
    <div className="animate-in fade-in flex items-end gap-2.5 duration-300">
      <Mascot name="question" className="size-9" sizes="36px" />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-primary/10 bg-card px-4 py-3.5 shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="animate-typing-dot size-2 rounded-full bg-primary/70"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
