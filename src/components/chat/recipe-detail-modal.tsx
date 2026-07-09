"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";

interface RecipeDetailModalProps {
  title: string;
  template: string;
  prompt: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecipeDetailModal({
  title,
  template,
  prompt,
  open,
  onOpenChange,
}: RecipeDetailModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={() => onOpenChange(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} 상세`}
        className="max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-primary/15 bg-background p-5 shadow-2xl shadow-primary/20"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
              Prompt Recipe
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-foreground">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              같은 상황에서 다시 쓸 수 있는 프롬프트 자산입니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/10 text-muted-foreground transition hover:border-primary/30 hover:bg-secondary hover:text-foreground"
            aria-label="레시피 모달 닫기"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <section className="rounded-2xl border border-primary/10 bg-card p-4">
            <p className="text-sm font-extrabold text-muted-foreground">
              레시피 템플릿
            </p>
            <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-secondary/35 p-3 font-sans text-sm leading-relaxed">
              {template}
            </pre>
          </section>

          <section className="rounded-2xl border border-primary/15 bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold text-primary">완성 프롬프트</p>
              <CopyButton text={prompt} label="복사" />
            </div>
            <p className="mt-3 whitespace-pre-wrap rounded-xl border border-primary/10 bg-background p-3 text-sm font-semibold leading-relaxed">
              {prompt}
            </p>
          </section>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
