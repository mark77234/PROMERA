"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface OnboardingScreenProps {
  onComplete: (info: { name: string; ageGroup: string; job: string }) => void;
}

const AGE_GROUPS = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];
const JOBS = [
  { label: "학생", emoji: "🎓" },
  { label: "직장인", emoji: "💼" },
  { label: "자영업·소상공인", emoji: "🏪" },
  { label: "개발자", emoji: "💻" },
  { label: "디자이너·크리에이터", emoji: "🎨" },
  { label: "기타", emoji: "✨" },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [job, setJob] = useState("");

  const ready = name.trim().length > 0 && ageGroup && job;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12">
      <div className="animate-in fade-in slide-in-from-bottom-6 space-y-2 text-center duration-500">
        <span className="text-5xl">👋</span>
        <h1 className="text-3xl font-extrabold">처음이신가요?</h1>
        <p className="text-muted-foreground">
          맞춤 코칭을 위해 몇 가지만 알려주세요. 30초면 끝나요!
        </p>
      </div>

      <div className="mt-10 space-y-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-2 duration-700">
          <Label htmlFor="name" className="text-base font-bold">
            어떻게 불러드릴까요?
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 또는 닉네임 (예: 카페 사장님)"
            className="h-13 rounded-xl text-base"
          />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-3 duration-1000">
          <Label className="text-base font-bold">연령대</Label>
          <div className="grid grid-cols-3 gap-2.5">
            {AGE_GROUPS.map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => setAgeGroup(age)}
                className={cn(
                  "rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all hover:scale-[1.03] active:scale-95",
                  ageGroup === age
                    ? "border-primary bg-secondary text-secondary-foreground"
                    : "border-border hover:border-primary/40"
                )}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-3 duration-1000">
          <Label className="text-base font-bold">어떤 일을 하시나요?</Label>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {JOBS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setJob(item.label)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-4 text-sm font-semibold transition-all hover:scale-[1.03] active:scale-95",
                  job === item.label
                    ? "border-primary bg-secondary text-secondary-foreground"
                    : "border-border hover:border-primary/40"
                )}
              >
                <span className="text-2xl">{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          size="lg"
          disabled={!ready}
          onClick={() => onComplete({ name: name.trim(), ageGroup, job })}
          className="h-14 w-full rounded-2xl text-base font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          다음으로 <ArrowRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}
