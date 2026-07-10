"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand-logo";
import { FunnelProgress } from "@/components/funnel-progress";
import { LandingPage } from "@/components/landing-page";
import { OnboardingScreen } from "@/components/onboarding-screen";
import { LevelSurveyScreen } from "@/components/level-survey-screen";
import { PurposeSelectScreen } from "@/components/purpose-select-screen";
import { PurposeDetailScreen } from "@/components/purpose-detail-screen";
import { ChatScreen } from "@/components/chat/chat-screen";
import { getPurposeById } from "@/data/purpose-options";
import { deriveSavedContext } from "@/lib/prompt-coach";
import { clearUser, loadUser, saveUser } from "@/lib/user-store";
import { withHonorific } from "@/lib/utils";
import type { LevelSurveyAnswers, UserProfile } from "@/types/app";

type Screen =
  | "landing"
  | "onboarding"
  | "survey"
  | "purpose"
  | "detail"
  | "chat";

export function PromeraApp() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [user, setUser] = useState<UserProfile | null>(null);

  const update = (patch: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...(prev as UserProfile), ...patch };
      saveUser(next);
      return next;
    });
  };

  const handleStart = () => {
    const stored = loadUser();
    if (stored) {
      setUser(stored);
      if (stored.onboarded && stored.purposeId && stored.purposeDetail) {
        setScreen("chat");
        toast.success(`다시 오셨네요, ${withHonorific(stored.name)}! 이어서 학습해요 🎉`);
        return;
      }
      if (stored.purposeId) {
        setScreen("detail");
        return;
      }
      if (stored.surveyAnswers) {
        setScreen("purpose");
        return;
      }
      if (stored.onboarded) {
        setScreen("survey");
        return;
      }
    }

    setUser({ name: "", ageGroup: "", job: "", onboarded: false });
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
    update({
      purposeId,
      purposeLabel: getPurposeById(purposeId).label,
      purposeDetail: undefined,
      savedContext: undefined,
    });
    setScreen("detail");
  };

  const handleDetail = (detail: string) => {
    update({
      purposeDetail: detail,
      savedContext: deriveSavedContext(user?.purposeId ?? "other", detail),
    });
    setScreen("chat");
  };

  const handleLogout = () => {
    // 학습 데이터는 브라우저에 남겨두고 시작 화면으로만 이동한다.
    setUser(null);
    setScreen("landing");
    toast.info("시작 화면으로 돌아왔어요.");
  };

  const handleReset = () => {
    clearUser();
    setUser(null);
    setScreen("landing");
  };

  if (screen === "landing") {
    return <LandingPage onStart={handleStart} />;
  }
  if (screen === "chat" && user) {
    return (
      <ChatScreen
        key={`${user.purposeId}-${user.purposeDetail}`}
        user={user}
        onUpdateUser={update}
        onChangePurpose={() => setScreen("purpose")}
        onLogout={handleLogout}
      />
    );
  }

  // 온보딩 ~ 목적 서술: 공통 셸(로고 헤더 + 진행 단계 + 중앙 컨텐츠)
  const funnelSteps: Partial<Record<Screen, number>> = {
    onboarding: 0,
    survey: 1,
    purpose: 2,
    detail: 3,
  };
  const funnelStep = funnelSteps[screen] ?? 0;

  // 이미 학습 중인 사용자가 "새로운 주제로 학습"으로 왔다면 뒤로가기는 챗으로 돌아간다.
  const backTarget: Screen | null =
    screen === "onboarding"
      ? "landing"
      : screen === "survey"
        ? "onboarding"
        : screen === "purpose"
          ? user?.purposeDetail
            ? "chat"
            : "survey"
          : screen === "detail"
            ? "purpose"
            : null;

  return (
    <div className="min-h-dvh bg-background">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <div className="flex items-center gap-1">
          {backTarget && (
            <button
              type="button"
              onClick={() => setScreen(backTarget)}
              aria-label="이전 단계로"
              className="mr-1 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}
          <button type="button" onClick={handleReset} className="flex items-center">
            <BrandLogo size="sm" />
          </button>
        </div>
        {user?.name && (
          <span className="rounded-full bg-secondary px-3 py-1 text-sm font-bold text-secondary-foreground">
            {withHonorific(user.name)}
          </span>
        )}
      </header>
      <div className="pt-2">
        <FunnelProgress current={funnelStep} />
      </div>
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
