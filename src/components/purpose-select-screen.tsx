"use client";

import { Button } from "@/components/ui/button";
import { purposeOptions } from "@/data/purpose-options";
import { withHonorific } from "@/lib/utils";

interface PurposeSelectScreenProps {
  name: string;
  onSelect: (purposeId: string) => void;
}

export function PurposeSelectScreen({ name, onSelect }: PurposeSelectScreenProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="animate-in fade-in slide-in-from-bottom-6 space-y-2 text-center duration-500">
        <span className="text-5xl">🎯</span>
        <h1 className="text-3xl font-extrabold">
          {withHonorific(name)}, 어떤 능력을 키우고 싶나요?
        </h1>
        <p className="text-muted-foreground">
          선택한 목적에 맞춰 실습 챌린지와 코칭을 준비할게요.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {purposeOptions.map((option, idx) => (
          <Button
            key={option.id}
            variant="ghost"
            onClick={() => onSelect(option.id)}
            className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both flex h-auto flex-col items-start gap-2 whitespace-normal rounded-3xl border-2 border-border p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:border-primary hover:bg-secondary/50 hover:shadow-lg active:scale-[0.98]"
            style={{ animationDelay: `${idx * 90}ms` }}
          >
            <span className="text-4xl">{option.emoji}</span>
            <span className="text-base font-bold">{option.label}</span>
            <span className="text-sm font-normal leading-relaxed text-muted-foreground">
              {option.description}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
