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

## AI 응답 설정

`.env.local`에서 코칭 응답 엔진을 선택할 수 있습니다.

```bash
# false → 실제 OpenAI 호출 (알파 운영 기본값, OPENAI_API_KEY 필수)
# true  → 규칙 기반 목업 응답 (오프라인 개발·시연 전용)
USE_MOCK_AI=false

# USE_MOCK_AI=false일 때 필수
OPENAI_API_KEY=sk-...

# 사용할 모델 (기본값: gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini
```

- 환경변수를 바꾸면 dev 서버를 재시작해야 반영됩니다.
- `USE_MOCK_AI`를 생략해도 실제 AI 모드로 동작합니다. 목업은 `USE_MOCK_AI=true`로 명시한 경우에만 사용합니다.
- 실제 AI 모드에서는 목업으로 대체하지 않습니다. 키 누락·호출 실패(타임아웃 등) 시 채팅 화면에 오류 말풍선과 토스트가 표시되고, 입력 내용이 입력창에 복원되어 바로 재시도할 수 있습니다.
- 수준 설문, 직업, 연령대, 사용 목적과 저장 정보가 코칭 컨텍스트로 전달됩니다. 프롬프트 분석, 다음 질문, 질문 이유, 추천 선택지, 최종 프롬프트, 개선점과 레시피 템플릿은 매 턴의 구조화 AI 응답으로 생성됩니다.
- 서버 라우트 [src/app/api/coach/route.ts](src/app/api/coach/route.ts)가 목업/실제 AI 분기를 담당하고, API 키는 서버에서만 사용됩니다.

## Vercel 배포 환경변수

Next.js Route Handler인 `/api/missions`, `/api/coach`가 Vercel Functions로 함께 배포되므로 별도 API 서버는 필요하지 않습니다. Vercel 프로젝트의 **Settings → Environment Variables**에 다음 값을 등록합니다.

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
USE_MOCK_AI=false
```

- 최소 필수값은 `OPENAI_API_KEY`입니다. `OPENAI_MODEL`을 생략하면 `gpt-4o-mini`, `USE_MOCK_AI`를 생략하면 실제 AI 모드가 기본값입니다.
- 알파 테스트에 사용하는 도메인에 맞춰 `Production`, `Preview`, `Development` 적용 범위를 선택합니다. 보통 세 환경 모두 같은 이름으로 등록합니다.
- API 키에는 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다. 이 접두사를 붙이면 브라우저 번들에 노출될 수 있습니다.
- 환경변수를 추가하거나 변경한 뒤에는 새로 배포해야 적용됩니다. 로컬의 `.env.local` 파일은 Vercel에 자동 업로드되지 않습니다.
- 맞춤 미션은 카테고리, 상세 목표, 직업과 수준 설문을 반영해 `/api/missions`에서 AI가 3개를 생성합니다. 선택한 미션 문맥은 이후 `/api/coach`의 모든 코칭 턴에 이어집니다.

## 구조 요약

- 플로우: 랜딩에서 원클릭 시작 → 온보딩 → 수준 설문(6문항) → 목적 선택 → 상세 목표 → 코칭 챗봇 (재방문 시 바로 이어서 학습)
- 코칭 엔진: [src/lib/prompt-coach.ts](src/lib/prompt-coach.ts) (재료 추출·분석·레시피), [src/data/prompt-missions.ts](src/data/prompt-missions.ts) (6개 주제 × 미션·재료 정의)
- 영상 촬영 가이드: [TUTORIAL.md](TUTORIAL.md)

## 기술 스택

Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · sonner · OpenAI API (선택)

인증·DB 없음 — 별도 로그인 없이 사용자 데이터는 localStorage(`promera-user`)에만 저장됩니다.
