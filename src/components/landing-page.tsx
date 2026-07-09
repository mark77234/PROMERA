"use client";

import { ArrowRight, MessageCircle, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { businessModels, personas } from "@/data/personas";

interface LandingPageProps {
  onStart: () => void;
}

const HOW_IT_WORKS = [
  {
    icon: MessageCircle,
    step: "STEP 1",
    title: "직접 프롬프트를 써봐요",
    description: "강의를 듣는 대신, 내 목적에 맞는 실습 과제에 직접 도전해요.",
  },
  {
    icon: Sparkles,
    step: "STEP 2",
    title: "AI 코치가 피드백해요",
    description:
      "모범 프롬프트, 수정 방안, 나에게 맞는 AI 모델·도구까지 콕 집어 알려줘요.",
  },
  {
    icon: TrendingUp,
    step: "STEP 3",
    title: "대화하며 계속 성장해요",
    description: "챗봇과 무한 반복 실습. 쓰면 쓸수록 전공자처럼 AI를 다루게 돼요.",
  },
];

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-dvh bg-background">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-sm text-primary-foreground">
              PP
            </span>
            <span className="text-lg">Process Path</span>
          </div>
          <Button onClick={onStart} className="rounded-full px-5 font-semibold">
            로그인
          </Button>
        </div>
      </header>

      {/* 히어로 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/60 via-secondary/20 to-background">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-20 text-center sm:py-28">
          <span className="animate-in fade-in slide-in-from-bottom-4 rounded-full border border-primary/30 bg-background px-4 py-1.5 text-sm font-semibold text-primary duration-700">
            🎓 대화하며 배우는 실기형 AI 훈련
          </span>
          <h1 className="animate-in fade-in slide-in-from-bottom-6 text-4xl font-extrabold leading-tight tracking-tight duration-700 sm:text-6xl">
            AI, 배우지 말고
            <br />
            <span className="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">
              대화하며 익히세요
            </span>
          </h1>
          <p className="animate-in fade-in slide-in-from-bottom-8 max-w-2xl text-base text-muted-foreground duration-1000 sm:text-xl">
            PP는 당신이 쓴 프롬프트에 AI 코치가 1:1 피드백을 주는 훈련 플랫폼이에요.
            영상 강의 없이, 직접 쓰고 고치며 전공자 수준의 AI 활용능력을 만들어요.
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-10 flex flex-col items-center gap-3 duration-1000">
            <Button
              size="lg"
              onClick={onStart}
              className="h-14 rounded-2xl px-10 text-lg font-bold shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
            >
              무료로 시작하기 <ArrowRight className="size-5" />
            </Button>
            <span className="text-xs text-muted-foreground">
              가입 30초 · 설치 없이 바로 시작
            </span>
          </div>

          {/* 챗 미리보기 목업 */}
          <div className="animate-in fade-in zoom-in-95 mt-6 w-full max-w-xl rounded-3xl border bg-background p-5 text-left shadow-xl duration-1000">
            <div className="space-y-3 text-sm">
              <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground">
                우리 카페 홍보글 써줘
              </div>
              <div className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5">
                좋은 시작이에요! 🙌 그런데 AI는 아직 <b>어떤 카페</b>인지,{" "}
                <b>누구에게</b> 알리고 싶은지 몰라요. 위치·고객·말투를 함께 알려주면
                결과가 완전히 달라져요. 이렇게 바꿔볼까요?
              </div>
              <div className="w-fit max-w-[90%] rounded-xl border border-primary/30 bg-secondary/40 px-4 py-2.5 text-xs leading-relaxed text-secondary-foreground">
                💡 모범 프롬프트 — &ldquo;부산 해운대 카페를 운영 중이야. 20대 손님을
                대상으로 신메뉴를 알리는 인스타 게시글을 밝은 말투로 300자 이내로
                써줘.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3단계 */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold sm:text-4xl">
            PP는 이렇게 훈련시켜요
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item, idx) => (
            <Reveal key={item.step} delay={idx * 150}>
              <div className="group h-full rounded-3xl border bg-background p-7 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-lg">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary transition-transform group-hover:scale-110">
                  <item.icon className="size-6 text-primary" />
                </div>
                <p className="mt-4 text-xs font-bold tracking-widest text-primary">
                  {item.step}
                </p>
                <h3 className="mt-1 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 페르소나 활용 사례 */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <Reveal>
            <h2 className="text-center text-3xl font-extrabold sm:text-4xl">
              누구에게나, 각자의 성장 스토리
            </h2>
            <p className="mt-3 text-center text-muted-foreground">
              아이부터 어르신까지, 마케터부터 개발자까지 — PP와 대화하며 성장했어요.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {personas.map((persona, idx) => (
              <Reveal key={persona.title} delay={(idx % 3) * 120}>
                <div className="h-full rounded-3xl border bg-background p-6 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{persona.emoji}</span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-secondary-foreground">
                      {persona.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold leading-snug">
                    {persona.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {persona.story}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 비즈니스 모델 */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold sm:text-4xl">
            개인부터 기업·공공까지
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {businessModels.map((model, idx) => (
            <Reveal key={model.title} delay={idx * 150}>
              <div className="h-full rounded-3xl border-2 border-primary/15 bg-gradient-to-b from-secondary/40 to-background p-7 text-center transition-all hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg">
                <span className="text-4xl">{model.emoji}</span>
                <h3 className="mt-3 text-lg font-bold">{model.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {model.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="bg-gradient-to-br from-primary to-fuchsia-600 py-20 text-primary-foreground">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center">
          <Reveal>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              오늘부터 AI와 대화하며 성장하세요
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <Button
              size="lg"
              variant="secondary"
              onClick={onStart}
              className="h-14 rounded-2xl px-10 text-lg font-bold text-primary shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              무료로 시작하기 <ArrowRight className="size-5" />
            </Button>
          </Reveal>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        PP · Process Path — 실기형 AI 활용능력 훈련 플랫폼 · 2026 부울경 AI 융합 해커톤
      </footer>
    </div>
  );
}
