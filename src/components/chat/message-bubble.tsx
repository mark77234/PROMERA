"use client";

import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "assistant" | "user";
  children: React.ReactNode;
  wide?: boolean;
}

export function MessageBubble({ role, children, wide = false }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "animate-in fade-in flex items-end gap-2.5 duration-500",
        isUser ? "slide-in-from-right-4 justify-end" : "slide-in-from-left-4"
      )}
    >
      {!isUser && (
        <Mascot name="good" className="size-9" sizes="36px" />
      )}
      <div
        className={cn(
          "whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm",
          isUser
            ? "max-w-[85%] rounded-br-sm bg-primary text-primary-foreground sm:max-w-[70%]"
            : cn(
                "rounded-bl-sm border border-primary/10 bg-card",
                wide ? "max-w-full flex-1 sm:max-w-[92%]" : "max-w-[85%] sm:max-w-[75%]"
              )
        )}
      >
        {children}
      </div>
    </div>
  );
}
