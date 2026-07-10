# PROMERA

**비전공자를 전공자처럼 — 실기형 AI 활용능력 진단·훈련 코치**

2026 제11회 부울경 AI 융합 해커톤 (AI + X) 참가작.
사용자가 직접 쓴 프롬프트에서 필요한 재료(목적·대상·형식·조건 등)를 체크하고, 빠진 재료를 한 번에 하나씩 질문해 스스로 채우게 하는 대화형 프롬프트 훈련 플랫폼입니다. 완성한 프롬프트는 레시피로 저장되고, 다음 연습부터는 내 정보가 자동으로 채워집니다.

PROMERA TO ANDROMEDA

## 실행 방법

```bash
npm install
npm run dev
# http://localhost:3000
```

## AI 응답 설정 (목업 ↔ 실제 AI)

`.env.local`에서 코칭 응답 엔진을 선택할 수 있습니다.

```bash
# true  → 규칙 기반 목업 응답 (네트워크 불필요, 영상 촬영·시연에 안정적)
# false → 무조건 실제 OpenAI 호출 (OPENAI_API_KEY 필수)
USE_MOCK_AI=true

# USE_MOCK_AI=false일 때 필수
OPENAI_API_KEY=sk-...

# 사용할 모델 (기본값: gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini
```

- 환경변수를 바꾸면 dev 서버를 재시작해야 반영됩니다.
- `USE_MOCK_AI=false`에서는 목업으로 대체하지 않습니다 — 키 누락·호출 실패(타임아웃 등) 시 채팅 화면에 오류 말풍선과 토스트가 표시되고, 입력 내용이 입력창에 복원되어 바로 재시도할 수 있습니다.
- 서버 라우트 [src/app/api/coach/route.ts](src/app/api/coach/route.ts)가 목업/실제 AI 분기를 담당하고, API 키는 서버에서만 사용됩니다.

## 구조 요약

- 플로우: 랜딩 → 로그인(목업) → 온보딩 → 수준 설문(6문항) → 목적 선택 → 상세 목표 → 코칭 챗봇 (무한 반복 학습)
- 코칭 엔진: [src/lib/prompt-coach.ts](src/lib/prompt-coach.ts) (재료 추출·분석·레시피), [src/data/prompt-missions.ts](src/data/prompt-missions.ts) (6개 주제 × 미션·재료 정의)
- 영상 촬영 가이드: [TUTORIAL.md](TUTORIAL.md)

## 기술 스택

Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · sonner · OpenAI API (선택)

인증·DB 없음 — 사용자 데이터는 localStorage(`promera-user`)에만 저장됩니다.
