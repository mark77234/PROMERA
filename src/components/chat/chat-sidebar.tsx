"use client";

import { useState } from "react";
import { GraduationCap, LogOut, RefreshCw, TrendingUp } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot";
import { getPurposeById } from "@/data/purpose-options";
import type { PromptRecipe, TrainingStats, UserProfile } from "@/types/app";
import { RecipeDetailModal } from "./recipe-detail-modal";

interface ChatSidebarProps {
  user: UserProfile;
  stats: TrainingStats;
  recipes: PromptRecipe[];
  onChangePurpose: () => void;
  onLogout: () => void;
}

function levelByQna(qnaCount: number) {
  if (qnaCount >= 12) return { label: "실전 코치형", next: 20 };
  if (qnaCount >= 7) return { label: "프롬프트 실전러", next: 12 };
  if (qnaCount >= 3) return { label: "재료 수집가", next: 7 };
  return { label: "첫 질문 연습", next: 3 };
}

export function ChatSidebar({
  user,
  stats,
  recipes,
  onChangePurpose,
  onLogout,
}: ChatSidebarProps) {
  const purpose = getPurposeById(user.purposeId ?? "other");
  const [selectedRecipe, setSelectedRecipe] = useState<PromptRecipe | null>(null);
  const level = levelByQna(stats.qnaCount);
  const progress = Math.min(100, Math.round((stats.qnaCount / level.next) * 100));
  const firstCount = stats.firstIngredientCount ?? 0;
  const growth = Math.max(0, stats.bestIngredientCount - firstCount);
  const mascotName = stats.qnaCount >= 12 ? "reward" : stats.qnaCount >= 3 ? "good" : "seat";

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-primary/10 bg-background p-5 md:flex">
      <BrandLogo />

      {/* 프로필 */}
      <div className="mt-6 rounded-2xl border border-primary/10 bg-card p-4 shadow-sm shadow-primary/5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-secondary text-xl">
            {user.name.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
            {user.ageGroup}
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
            {user.job}
          </span>
        </div>
      </div>

      {/* 학습 현황 */}
      <div className="mt-4 rounded-2xl border border-primary/10 bg-card p-4 shadow-sm shadow-primary/5">
        <p className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
          <GraduationCap className="size-4" /> 지금 배우는 중
        </p>
        <div className="mt-3 flex justify-center">
          <Mascot
            name={mascotName}
            alt="학습을 함께하는 프롬이"
            className="size-24"
            sizes="96px"
          />
        </div>
        <p className="mt-2 text-sm font-bold">
          {purpose.emoji} {purpose.label}
        </p>
        <p className="mt-1 text-xs font-bold text-primary">
          {level.label} · 질의응답 {stats.qnaCount}회
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-primary/10 bg-background p-2">
            <p className="font-bold text-muted-foreground">처음</p>
            <p className="mt-0.5 font-extrabold">{firstCount}개 재료</p>
          </div>
          <div className="rounded-xl border border-primary/10 bg-background p-2">
            <p className="font-bold text-muted-foreground">최고</p>
            <p className="mt-0.5 font-extrabold">
              {stats.bestIngredientCount}/{stats.totalIngredientCount || 0}개
            </p>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <TrendingUp className="size-3.5 text-primary" />
          처음보다 재료 {growth}개를 더 명확히 넣었어요.
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          완성 프롬프트 {stats.completedPrompts}개 · 저장 레시피 {recipes.length}개
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-primary/10 bg-card p-4 shadow-sm shadow-primary/5">
        <p className="text-xs font-bold text-muted-foreground">내 프롬프트 레시피</p>
        <div className="mt-3 space-y-2">
          {recipes.length === 0 ? (
            <p className="rounded-xl border border-primary/10 bg-background px-3 py-3 text-xs leading-relaxed text-muted-foreground">
              완성한 프롬프트를 저장하면 여기에 쌓입니다.
            </p>
          ) : (
            recipes.slice(0, 4).map((recipe) => (
              <div
                key={recipe.id}
                className="rounded-xl border border-primary/10 bg-background px-3 py-2"
              >
                <p className="truncate text-xs font-extrabold text-secondary-foreground">
                  {recipe.title}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  {recipe.prompt}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedRecipe(recipe)}
                  className="mt-2 text-[11px] font-extrabold text-primary underline-offset-2 hover:underline"
                >
                  전체 보기
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-auto space-y-2 pt-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl"
          onClick={onChangePurpose}
        >
          <RefreshCw className="size-4" /> 새로운 주제로 학습
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 rounded-xl text-muted-foreground"
          onClick={onLogout}
        >
          <LogOut className="size-4" /> 로그아웃
        </Button>
      </div>

      {selectedRecipe && (
        <RecipeDetailModal
          title={selectedRecipe.title}
          template={selectedRecipe.template}
          prompt={selectedRecipe.prompt}
          open={Boolean(selectedRecipe)}
          onOpenChange={(open) => {
            if (!open) setSelectedRecipe(null);
          }}
        />
      )}
    </aside>
  );
}
