"use client";

import { GraduationCap, LogOut, RefreshCw } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot";
import { getPurposeById } from "@/data/purpose-options";
import type { PromptRecipe, UserProfile } from "@/types/app";

interface ChatSidebarProps {
  user: UserProfile;
  turn: number;
  recipes: PromptRecipe[];
  onChangePurpose: () => void;
  onLogout: () => void;
}

export function ChatSidebar({
  user,
  turn,
  recipes,
  onChangePurpose,
  onLogout,
}: ChatSidebarProps) {
  const purpose = getPurposeById(user.purposeId ?? "other");

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r bg-muted/40 p-5 md:flex">
      <BrandLogo />

      {/* 프로필 */}
      <div className="mt-6 rounded-2xl border bg-background p-4">
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
      <div className="mt-4 rounded-2xl border bg-background p-4">
        <p className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
          <GraduationCap className="size-4" /> 지금 배우는 중
        </p>
        <div className="mt-3 flex justify-center">
          <Mascot
            name={turn >= 3 ? "reward" : turn >= 1 ? "good" : "seat"}
            alt="학습을 함께하는 프롬이"
            className="size-24"
            sizes="96px"
          />
        </div>
        <p className="mt-2 text-sm font-bold">
          {purpose.emoji} {purpose.label}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          저장한 레시피 {turn}개 {turn >= 3 ? "✨" : turn >= 1 ? "💪" : ""}
        </p>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                i < Math.min(turn, 5) ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border bg-background p-4">
        <p className="text-xs font-bold text-muted-foreground">내 프롬프트 레시피</p>
        <div className="mt-3 space-y-2">
          {recipes.length === 0 ? (
            <p className="rounded-xl bg-muted px-3 py-3 text-xs leading-relaxed text-muted-foreground">
              완성한 프롬프트를 저장하면 여기에 쌓입니다.
            </p>
          ) : (
            recipes.slice(0, 4).map((recipe) => (
              <div key={recipe.id} className="rounded-xl bg-secondary/70 px-3 py-2">
                <p className="truncate text-xs font-extrabold text-secondary-foreground">
                  {recipe.title}
                </p>
                <p className="mt-1 max-h-8 overflow-hidden text-[11px] leading-relaxed text-muted-foreground">
                  {recipe.prompt}
                </p>
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
    </aside>
  );
}
