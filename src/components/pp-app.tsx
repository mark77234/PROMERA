"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LandingPage } from "@/components/landing-page";
import { LoginScreen } from "@/components/login-screen";
import { OnboardingScreen } from "@/components/onboarding-screen";
import { LevelSurveyScreen } from "@/components/level-survey-screen";
import { PurposeSelectScreen } from "@/components/purpose-select-screen";
import { PurposeDetailScreen } from "@/components/purpose-detail-screen";
import { ChatScreen } from "@/components/chat/chat-screen";
import { getPurposeById } from "@/data/purpose-options";
import { clearUser, loadUser, saveUser } from "@/lib/user-store";
import { withHonorific } from "@/lib/utils";
import type { LevelSurveyAnswers, UserProfile } from "@/types/app";

type Screen =
  | "landing"
  | "login"
  | "onboarding"
  | "survey"
  | "purpose"
  | "detail"
  | "chat";

export function PPApp() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [user, setUser] = useState<UserProfile | null>(null);

  const update = (patch: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...(prev as UserProfile), ...patch };
      saveUser(next);
      return next;
    });
  };

  const handleLogin = (email: string) => {
    const stored = loadUser();
    if (stored && stored.onboarded && stored.purposeId && stored.purposeDetail) {
      // 재방문 사용자 — 온보딩·설문 건너뛰고 바로 학습으로
      const next = { ...stored, email };
      setUser(next);
      saveUser(next);
      setScreen("chat");
      toast.success(`다시 오셨네요, ${withHonorific(stored.name)}! 이어서 학습해요 🎉`);
      return;
    }
    setUser({ email, name: "", ageGroup: "", job: "", onboarded: false });
    setScreen("onboarding");
  };

  const handleOnboarded = (info: { name: string; ageGroup: string; job: string }) => {
    update({ ...info, onboarded: true });
    setScreen("survey");
  };

  const handleSurveyDone = (answers: LevelSurveyAnswers) => {
    update({ surveyAnswers: answers });
    setScreen("purpose");
  };

  const handlePurpose = (purposeId: string) => {
    update({ purposeId, purposeLabel: getPurposeById(purposeId).label });
    setScreen("detail");
  };

  const handleDetail = (detail: string) => {
    update({ purposeDetail: detail });
    setScreen("chat");
  };

  const handleLogout = () => {
    // 프로필은 남겨두어 재로그인 시 "다시 오셨네요" 경험 유지
    setUser(null);
    setScreen("landing");
    toast.info("로그아웃되었습니다. 다음에 또 만나요!");
  };

  const handleReset = () => {
    clearUser();
    setUser(null);
    setScreen("landing");
  };

  if (screen === "landing") {
    return <LandingPage onStart={() => setScreen("login")} />;
  }
  if (screen === "login") {
    return <LoginScreen onLogin={handleLogin} onBack={() => setScreen("landing")} />;
  }
  if (screen === "chat" && user) {
    return (
      <ChatScreen
        key={`${user.purposeId}-${user.purposeDetail}`}
        user={user}
        onChangePurpose={() => setScreen("purpose")}
        onLogout={handleLogout}
      />
    );
  }

  // 온보딩 ~ 목적 서술: 공통 셸(로고 헤더 + 중앙 컨텐츠)
  return (
    <div className="min-h-dvh bg-gradient-to-b from-secondary/30 to-background">
      <header className="flex h-14 items-center justify-between px-5">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 font-extrabold tracking-tight"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
            PP
          </span>
          Process Path
        </button>
        {user?.name && (
          <span className="text-sm font-semibold text-muted-foreground">
            {withHonorific(user.name)}
          </span>
        )}
      </header>
      <main>
        {screen === "onboarding" && <OnboardingScreen onComplete={handleOnboarded} />}
        {screen === "survey" && user && (
          <LevelSurveyScreen name={user.name} onComplete={handleSurveyDone} />
        )}
        {screen === "purpose" && user && (
          <PurposeSelectScreen name={user.name} onSelect={handlePurpose} />
        )}
        {screen === "detail" && user?.purposeId && (
          <PurposeDetailScreen purposeId={user.purposeId} onComplete={handleDetail} />
        )}
      </main>
    </div>
  );
}
