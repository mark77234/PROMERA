"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const FUNNEL_STEPS = ["기본 정보", "수준 진단", "학습 주제", "상세 목표"];

interface FunnelProgressProps {
  /** 0=기본 정보, 1=수준 진단, 2=학습 주제, 3=상세 목표 */
  current: number;
}

export function FunnelProgress({ current }: FunnelProgressProps) {
  return (
    <nav aria-label="가입 진행 단계" className="mx-auto w-full max-w-xl px-4">
      <ol className="flex items-center">
        {FUNNEL_STEPS.map((label, idx) => (
          <li
            key={label}
            className={cn("flex items-center", idx > 0 && "flex-1")}
          >
            {idx > 0 && (
              <span
                aria-hidden
                className={cn(
                  "mx-2 h-1 flex-1 rounded-full transition-colors duration-500",
                  idx <= current ? "bg-primary" : "bg-secondary"
                )}
              />
            )}
            <span className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs font-extrabold transition-all duration-300",
                  idx < current
                    ? "bg-primary text-primary-foreground"
                    : idx === current
                      ? "border-2 border-primary bg-background text-primary shadow-sm shadow-primary/20"
                      : "border border-border bg-background text-muted-foreground"
                )}
              >
                {idx < current ? <Check className="size-3.5" /> : idx + 1}
              </span>
              <span
                className={cn(
                  "hidden text-[11px] font-bold sm:block",
                  idx === current ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
