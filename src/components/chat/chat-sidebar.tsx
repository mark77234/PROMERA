"use client";

import { GraduationCap, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPurposeById } from "@/data/purpose-options";
import type { UserProfile } from "@/types/app";

interface ChatSidebarProps {
  user: UserProfile;
  turn: number;
  onChangePurpose: () => void;
  onLogout: () => void;
}

export function ChatSidebar({ user, turn, onChangePurpose, onLogout }: ChatSidebarProps) {
  const purpose = getPurposeById(user.purposeId ?? "other");

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r bg-muted/40 p-5 md:flex">
      <div className="flex items-center gap-2 font-extrabold">
        <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-sm text-primary-foreground">
          PP
        </span>
        Process Path
      </div>

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
        <p className="mt-2 text-sm font-bold">
          {purpose.emoji} {purpose.label}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          오늘 실습 {turn}회 완료 {turn >= 3 ? "🔥" : turn >= 1 ? "💪" : ""}
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
