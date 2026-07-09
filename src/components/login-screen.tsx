"use client";

import { useState } from "react";
import { ArrowLeft, LogIn } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mascot } from "@/components/mascot";
import { toast } from "sonner";

interface LoginScreenProps {
  onLogin: (email: string) => void;
  onBack: () => void;
}

export function LoginScreen({ onLogin, onBack }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (!email.trim()) {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    onLogin(email.trim());
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-secondary/50 to-background px-4">
      <div className="animate-in fade-in zoom-in-95 w-full max-w-md rounded-3xl border bg-background p-8 shadow-xl duration-500">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> 돌아가기
        </button>

        <div className="flex items-start justify-between gap-4">
          <BrandLogo size="lg" />
          <Mascot
            name="hi"
            alt="손을 흔드는 프롬이"
            className="-mt-3 size-20"
            sizes="80px"
          />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold">환영해요! 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          로그인하고 나만의 AI 코치를 만나보세요.
        </p>

        <div className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-12 rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
          </div>
          <Button
            size="lg"
            onClick={submit}
            className="h-12 w-full rounded-xl text-base font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="size-4" /> 로그인
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          또는
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-2.5">
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl border-primary/20 bg-background font-semibold hover:bg-secondary"
            onClick={() => onLogin("google-user@promera.demo")}
          >
            <span className="text-base">🇬</span> Google로 계속하기
          </Button>
          <Button
            variant="secondary"
            className="h-12 w-full rounded-xl border border-primary/15 font-semibold text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
            onClick={() => onLogin("kakao-user@promera.demo")}
          >
            <span className="text-base">💬</span> 카카오로 계속하기
          </Button>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          데모 버전 — 아무 이메일로나 로그인할 수 있어요.
        </p>
      </div>
    </div>
  );
}
