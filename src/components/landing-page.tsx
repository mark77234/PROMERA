"use client";

import { ArrowRight, Infinity as InfinityIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Mascot, type MascotName } from "@/components/mascot";
import { Reveal } from "@/components/reveal";
import { useCountUp } from "@/components/use-count-up";
import { useInView } from "@/components/use-in-view";
import { businessModels, personas } from "@/data/personas";

interface LandingPageProps {
  onStart: () => void;
}

const HOW_IT_WORKS = [
  {
    mascot: "hi",
    step: "STEP 1",
    title: "직접 프롬프트를 써봐요",
    description: "강의를 듣는 대신, 내 목적에 맞는 실습 미션에 직접 도전해요.",
  },
  {
    mascot: "teach",
    step: "STEP 2",
    title: "프롬이가 재료를 체크해요",
    description:
      "점수 대신, 프롬프트에 들어간 것과 빠진 것을 보여주고 하나씩만 물어봐요.",
  },
  {
    mascot: "running",
    step: "STEP 3",
    title: "레시피가 쌓이며 성장해요",
    description: "완성한 프롬프트는 레시피로 저장되고, 다음엔 내 정보가 자동으로 채워져요.",
  },
] satisfies { mascot: MascotName; step: string; title: string; description: string }[];

const STATS = [
  { value: 6, suffix: "가지", label: "학습 주제" },
  { value: 12, suffix: "종", label: "실습 미션" },
  { value: 7, suffix: "가지", label: "프롬프트 재료 체크" },
];

function StatItem({ value, suffix, label }: (typeof STATS)[number]) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const count = useCountUp(inView ? value : 0, 1000);
  return (
    <div ref={ref} className="flex flex-col items-center gap-0.5">
      <span className="text-3xl font-extrabold tabular-nums text-primary sm:text-4xl">
        {count}
        <span className="text-lg font-bold text-primary/70 sm:text-xl">{suffix}</span>
      </span>
      <span className="text-xs font-semibold text-muted-foreground sm:text-sm">
        {label}
      </span>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal>
      <div className="text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </span>
        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
      </div>
    </Reveal>
  );
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 border-b border-primary/10 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <BrandLogo />
          <Button
            onClick={onStart}
            className="rounded-full px-5 font-semibold shadow-sm shadow-primary/15"
          >
            바로 시작
          </Button>
        </div>
      </header>

      {/* 히어로 */}
      <section className="relative overflow-hidden bg-background">
        {/* 배경 장식 — 은은하게 떠다니는 그라데이션 */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-float-blob absolute -top-32 left-1/2 size-[480px] -translate-x-[65%] rounded-full bg-primary/10 blur-3xl" />
          <div className="animate-float-blob-slow absolute right-[-140px] top-44 size-[400px] rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-[-160px] left-[-120px] size-[360px] rounded-full bg-chart-5/20 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-20 text-center sm:py-24">
          <span className="animate-in fade-in slide-in-from-bottom-4 rounded-full border border-primary/20 bg-secondary/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm duration-700">
            🎓 대화하며 배우는 실기형 AI 훈련
          </span>
          <Mascot
            name="hurray"
            alt="두 팔을 들고 환영하는 프롬이"
            priority
            className="animate-in fade-in zoom-in-95 animate-prom-bob size-32 duration-700 sm:size-40"
            sizes="(max-width: 640px) 128px, 160px"
          />
          <h1 className="animate-in fade-in slide-in-from-bottom-6 text-4xl font-extrabold leading-tight tracking-tight duration-700 sm:text-6xl">
            AI, 배우지 말고
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary/70 bg-clip-text text-transparent">
              대화하며 익히세요
            </span>
          </h1>
          <p className="animate-in fade-in slide-in-from-bottom-8 max-w-2xl text-base text-muted-foreground duration-1000 sm:text-xl">
            PROMERA는 당신이 쓴 프롬프트에 AI 코치가 1:1 피드백을 주는 훈련 플랫폼이에요.
            영상 강의 없이, 직접 쓰고 고치며 전공자 수준의 AI 활용능력을 만들어요.
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-10 flex flex-col items-center gap-3 duration-1000">
            <Button
              size="lg"
              onClick={onStart}
              className="h-14 rounded-2xl px-10 text-lg font-bold shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
            >
              바로 시작하기 <ArrowRight className="size-5" />
            </Button>
            <span className="text-xs text-muted-foreground">
              가입 없이 · 설치 없이 바로 시작
            </span>
          </div>

          {/* 챗 미리보기 목업 */}
          <div className="animate-in fade-in zoom-in-95 mt-6 w-full max-w-xl rounded-3xl border border-primary/15 bg-card p-5 text-left shadow-xl shadow-primary/8 duration-1000">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-widest text-primary/70">
              PROMERA 코칭 미리보기
            </p>
            <div className="space-y-3 text-sm">
              <div className="animate-in fade-in slide-in-from-right-4 ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground delay-300 duration-700 fill-mode-both">
                우리 카페 홍보글 써줘
              </div>
              <div className="animate-in fade-in slide-in-from-left-4 flex items-start gap-2.5 delay-700 duration-700 fill-mode-both">
                <Mascot name="good" className="mt-1 size-10" sizes="40px" />
                <div className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm border border-primary/10 bg-secondary/70 px-4 py-2.5 text-secondary-foreground">
                  좋은 시작이에요! 🙌 그런데 AI는 아직 <b>어떤 카페</b>인지,{" "}
                  <b>누구에게</b> 알리고 싶은지 몰라요. 빠진 재료를 하나씩
                  채워볼까요?
                </div>
              </div>
              <div className="animate-in fade-in slide-in-from-left-4 w-fit max-w-[90%] rounded-xl border border-primary/20 bg-background px-4 py-2.5 text-xs leading-relaxed text-foreground delay-1000 duration-700 fill-mode-both">
                💡 모범 프롬프트 — &ldquo;부산 해운대 카페를 운영 중이야. 20대 손님을
                대상으로 신메뉴를 알리는 인스타 게시글을 밝은 말투로 300자 이내로
                써줘.&rdquo;
              </div>
            </div>
          </div>

          {/* 통계 스트립 */}
          <div className="animate-in fade-in mt-4 grid w-full max-w-2xl grid-cols-2 gap-6 rounded-3xl border border-primary/10 bg-card/80 px-6 py-6 shadow-sm shadow-primary/5 backdrop-blur duration-1000 sm:grid-cols-4">
            {STATS.map((stat) => (
              <StatItem key={stat.label} {...stat} />
            ))}
            <div className="flex flex-col items-center gap-0.5">
              <span className="flex h-10 items-center text-primary">
                <InfinityIcon className="size-8" strokeWidth={2.5} />
              </span>
              <span className="text-xs font-semibold text-muted-foreground sm:text-sm">
                반복 학습
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3단계 */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <SectionHeading
          eyebrow="How it works"
          title="PROMERA는 이렇게 훈련시켜요"
          subtitle="답을 대신 써주지 않아요. 좋은 질문을 스스로 완성하게 만들어요."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item, idx) => (
            <Reveal key={item.step} delay={idx * 150}>
              <div className="group h-full rounded-3xl border border-primary/10 bg-card p-7 shadow-sm shadow-primary/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                <Mascot
                  name={item.mascot}
                  className="size-16 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  sizes="64px"
                />
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
      <section className="border-y border-primary/10 bg-muted/60 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <SectionHeading
            eyebrow="Use cases"
            title="누구에게나, 각자의 성장 스토리"
            subtitle="아이부터 어르신까지, 마케터부터 개발자까지 — PROMERA와 대화하며 성장했어요."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {personas.map((persona, idx) => (
              <Reveal key={persona.title} delay={(idx % 3) * 120}>
                <div className="h-full rounded-3xl border border-primary/10 bg-card p-6 shadow-sm shadow-primary/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
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
        <SectionHeading
          eyebrow="For everyone"
          title="개인부터 기업·공공까지"
          subtitle="같은 훈련 엔진 위에서 개인·기업·지자체 교육으로 확장돼요."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {businessModels.map((model, idx) => (
            <Reveal key={model.title} delay={idx * 150}>
              <div className="h-full rounded-3xl border-2 border-primary/15 bg-card p-7 text-center shadow-sm shadow-primary/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
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
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-accent px-6 py-14 text-center text-primary-foreground shadow-xl shadow-primary/25 sm:px-12">
            <div
              aria-hidden
              className="animate-float-blob pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-white/10 blur-2xl"
            />
            <Mascot name="handsUp" className="mx-auto size-28" sizes="112px" />
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              오늘부터 AI와 대화하며 성장하세요
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/80 sm:text-base">
              첫 미션까지 3분이면 충분해요. 프롬이가 기다리고 있어요.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={onStart}
              className="mt-7 h-14 rounded-2xl px-10 text-lg font-bold text-primary shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              바로 시작하기 <ArrowRight className="size-5" />
            </Button>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-primary/10 bg-background py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 text-center">
          <BrandLogo size="sm" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            실기형 AI 활용능력 훈련 플랫폼 · 2026 제11회 부울경 AI 융합 해커톤
            <br />
            프롬프트를 직접 쓰고, 재료를 채우고, 레시피로 저장하세요.
          </p>
        </div>
      </footer>
    </div>
  );
}
