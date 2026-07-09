"use client";

import { useState } from "react";
import { Lightbulb, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getPurposeById } from "@/data/purpose-options";

interface PurposeDetailScreenProps {
  purposeId: string;
  onComplete: (detail: string) => void;
}

export function PurposeDetailScreen({ purposeId, onComplete }: PurposeDetailScreenProps) {
  const purpose = getPurposeById(purposeId);
  const [detail, setDetail] = useState("");

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12">
      <div className="animate-in fade-in slide-in-from-bottom-6 space-y-2 text-center duration-500">
        <span className="text-5xl">{purpose.emoji}</span>
        <h1 className="text-3xl font-extrabold">{purpose.label}</h1>
        <p className="text-muted-foreground">
          조금 더 자세히 알려주세요. 구체적일수록 코칭이 정확해져요.
        </p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 mt-10 space-y-4 duration-700">
        <Textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder={purpose.detailPlaceholder}
          className="min-h-40 rounded-2xl p-4 text-base leading-relaxed"
        />
        <button
          type="button"
          onClick={() => setDetail(purpose.detailExample)}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-2 hover:underline"
        >
          <Lightbulb className="size-4" /> 예시로 채워보기
        </button>
        <Button
          size="lg"
          disabled={detail.trim().length < 5}
          onClick={() => onComplete(detail.trim())}
          className="h-14 w-full rounded-2xl text-base font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Rocket className="size-5" /> AI 코치 만나러 가기
        </Button>
      </div>
    </div>
  );
}
