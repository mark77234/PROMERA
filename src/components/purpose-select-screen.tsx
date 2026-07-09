"use client";

import { ArrowRight } from "lucide-react";
import { Mascot } from "@/components/mascot";
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
        <Mascot
          name="indicate"
          alt="방향을 가리키는 프롬이"
          className="mx-auto size-24"
          sizes="96px"
        />
        <h1 className="text-3xl font-extrabold">
          {withHonorific(name)}, 어떤 능력을 키우고 싶나요?
        </h1>
        <p className="text-muted-foreground">
          선택한 목적에 맞춰 실습 챌린지와 코칭을 준비할게요.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {purposeOptions.map((option, idx) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className="group animate-in fade-in slide-in-from-bottom-4 fill-mode-both flex flex-col items-start gap-2 rounded-3xl border-2 border-border bg-card p-6 text-left shadow-sm shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-secondary/40 hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]"
            style={{ animationDelay: `${idx * 90}ms` }}
          >
            <span className="flex w-full items-start justify-between">
              <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                {option.emoji}
              </span>
              <ArrowRight className="size-4 translate-x-0 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
            </span>
            <span className="text-base font-bold">{option.label}</span>
            <span className="text-sm font-normal leading-relaxed text-muted-foreground">
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
