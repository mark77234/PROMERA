"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { levelSurveyQuestions } from "@/data/level-survey";
import type { LevelSurveyAnswers } from "@/types/app";
import { cn, withHonorific } from "@/lib/utils";

interface LevelSurveyScreenProps {
  name: string;
  onComplete: (answers: LevelSurveyAnswers) => void;
}

export function LevelSurveyScreen({ name, onComplete }: LevelSurveyScreenProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<LevelSurveyAnswers>>({});
  const [multiPicks, setMultiPicks] = useState<string[]>([]);

  const question = levelSurveyQuestions[step];
  const total = levelSurveyQuestions.length;
  const progress = (step / total) * 100;

  const advance = (nextAnswers: Partial<LevelSurveyAnswers>) => {
    if (step + 1 >= total) {
      onComplete(nextAnswers as LevelSurveyAnswers);
    } else {
      setStep(step + 1);
      setMultiPicks([]);
    }
  };

  const pickSingle = (label: string) => {
    const next = { ...answers, [question.id]: label };
    setAnswers(next);
    // 선택 애니메이션이 보이도록 잠깐 뒤에 다음 문항으로
    setTimeout(() => advance(next), 350);
  };

  const toggleMulti = (label: string) => {
    setMultiPicks((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const submitMulti = () => {
    const next = { ...answers, [question.id]: multiPicks };
    setAnswers(next);
    advance(next);
  };

  const selected = (label: string) =>
    question.multiSelect
      ? multiPicks.includes(label)
      : answers[question.id] === label;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12">
      {/* 진행 바 */}
      <div className="mb-10 space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-primary">수준 파악하기</span>
          <span className="text-muted-foreground">
            {step + 1} / {total}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress + 100 / total}%` }}
          />
        </div>
      </div>

      {/* 문항 — key로 리마운트해 슬라이드 애니메이션 */}
      <div
        key={question.id}
        className="animate-in fade-in slide-in-from-right-8 space-y-6 duration-500"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-extrabold leading-snug">
            {step === 0 ? `${withHonorific(name)}, ` : ""}
            {question.question}
          </h2>
          <p className="text-sm text-muted-foreground">{question.description}</p>
        </div>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() =>
                question.multiSelect ? toggleMulti(option.label) : pickSingle(option.label)
              }
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]",
                selected(option.label)
                  ? "border-primary bg-secondary text-secondary-foreground shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-muted/60"
              )}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="flex-1">{option.label}</span>
              {selected(option.label) && <Check className="size-5 text-primary" />}
            </button>
          ))}
        </div>

        {question.multiSelect && (
          <Button
            size="lg"
            disabled={multiPicks.length === 0}
            onClick={submitMulti}
            className="h-13 w-full rounded-2xl text-base font-bold"
          >
            선택 완료 <ArrowRight className="size-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
