import { getMissionsByPurpose } from "@/data/prompt-missions";
import type {
  IngredientOption,
  CoachTurnResult,
  Mission,
  PromptAnalysis,
  PromptDraft,
  PromptIngredient,
  PromptRecipe,
  SavedContext,
} from "@/types/app";

const REGION_PATTERN =
  /(부산\s*해운대|부산\s*광안리|서울\s*성수|서울\s*홍대|서울\s*강남|부산|서울|대구|인천|광주|대전|울산|세종|제주|해운대|광안리|서면|성수|홍대|강남|동네\s*주택가)/;
const AUDIENCE_PATTERN =
  /(\d+대\s*(손님|고객)?|관광객|동네\s*주민|가족\s*단위\s*(손님|고객)?|직장인|학생|고객|손님|팀장님|팀장|협력사|담당자|초보자|쇼핑몰\s*고객|예약\s*고객)/;
const PRODUCT_PATTERN =
  /(딸기\s*크림\s*라떼|바스크\s*치즈케이크|신메뉴|디저트|라떼|케이크|세트\s*메뉴|이벤트|상품|메뉴)/;
const PLATFORM_PATTERN =
  /(인스타그램|인스타|블로그|카카오톡\s*공지|카카오|문자|유튜브|1:1|16:9|정방형|세로\s*포스터|가로\s*이미지)/;
const TONE_PATTERN =
  /(밝고?\s*귀여운|밝고?\s*감성적인|밝게|고급스럽게|친근하게|재밌게|정중하게|간결하게|감성적|미니멀|파스텔톤|차분한|안심시키는|말투|톤|문체)/;
const LENGTH_PATTERN = /(\d+\s*(자|글자|문장|줄)\s*(이내|내외)?|짧은\s*제목\s*\d+개|짧게|5문장)/;
const BUSINESS_PATTERN = /([가-힣A-Za-z0-9]+\s*(카페|식당|공방|서점|쇼핑몰|매장|서비스))/;

const VALUE_PATTERNS: Record<string, RegExp[]> = {
  location: [REGION_PATTERN],
  audience: [AUDIENCE_PATTERN],
  product: [PRODUCT_PATTERN],
  platform: [PLATFORM_PATTERN],
  tone: [TONE_PATTERN],
  length: [LENGTH_PATTERN],
};

function normalizeWhitespace(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function includesAny(text: string, words: string[]) {
  const compact = text.toLowerCase();
  return words.some((word) => compact.includes(word.toLowerCase()));
}

function extractByPattern(prompt: string, ingredient: PromptIngredient): string | undefined {
  const patterns = VALUE_PATTERNS[ingredient.id] ?? [];
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[0]) return normalizeWhitespace(match[0]);
  }

  if (includesAny(prompt, ingredient.detect)) {
    if (ingredient.id === "goal") {
      const option = ingredient.options.find((item) => prompt.includes(item.label));
      return option?.value ?? ingredient.options[0]?.value ?? ingredient.label;
    }
    return ingredient.options.find((item) => prompt.includes(item.label))?.value;
  }

  return undefined;
}

function valueFromSavedContext(
  ingredient: PromptIngredient,
  savedContext?: SavedContext
): string | undefined {
  if (!ingredient.savedContextKey || !savedContext) return undefined;
  const value = savedContext[ingredient.savedContextKey];
  return typeof value === "string" && value.trim() ? normalizeWhitespace(value) : undefined;
}

function fillTemplate(template: string, values: Record<string, string>, ingredients: PromptIngredient[]) {
  return template.replace(/\{(\w+)\}/g, (_, id: string) => {
    const value = values[id];
    if (value) return value;
    return `[${ingredients.find((item) => item.id === id)?.missingLabel ?? id}]`;
  });
}

function subjectParticle(label: string) {
  const lastChar = label.charCodeAt(label.length - 1);
  if (lastChar < 0xac00 || lastChar > 0xd7a3) return "이";
  return (lastChar - 0xac00) % 28 === 0 ? "가" : "이";
}

export function deriveSavedContext(purposeId: string, detail: string): SavedContext {
  const context: SavedContext = {
    purposeId,
    summary: detail.trim(),
  };
  const location = detail.match(REGION_PATTERN)?.[0];
  const audience = detail.match(AUDIENCE_PATTERN)?.[0];
  const product = detail.match(PRODUCT_PATTERN)?.[0];
  const tone = detail.match(TONE_PATTERN)?.[0];
  const platform = detail.match(PLATFORM_PATTERN)?.[0];
  const businessName = detail.match(BUSINESS_PATTERN)?.[0];

  if (location) context.location = normalizeWhitespace(location);
  if (audience) context.audience = normalizeWhitespace(audience);
  if (product) context.product = normalizeWhitespace(product);
  if (tone) context.tone = normalizeWhitespace(tone);
  if (platform) context.platform = normalizeWhitespace(platform);
  if (businessName) context.businessName = normalizeWhitespace(businessName);

  // topic은 서술 전체 문장을 그대로 넣으면 완성 프롬프트가 어색해지므로
  // 자동 저장하지 않는다 — 미션에서 칩/입력으로 직접 채우게 한다.

  return context;
}

/** 저장 정보에서 이 미션의 재료 값으로 쓸 수 있는 것들만 추린다 */
export function savedValuesFor(
  mission: Mission,
  savedContext?: SavedContext
): Record<string, string> {
  const values: Record<string, string> = {};
  for (const ingredient of mission.ingredients) {
    const saved = valueFromSavedContext(ingredient, savedContext);
    if (saved) values[ingredient.id] = saved;
  }
  return values;
}

/** 프롬프트 텍스트에서 재료 값만 추출한다 (규칙 기반 — 목업 엔진의 핵심) */
export function extractPromptValues(
  mission: Mission,
  originalPrompt: string
): Record<string, string> {
  const values: Record<string, string> = {};
  const prompt = normalizeWhitespace(originalPrompt);
  for (const ingredient of mission.ingredients) {
    const promptValue = extractByPattern(prompt, ingredient);
    if (promptValue) values[ingredient.id] = promptValue;
  }
  return values;
}

/**
 * 추출된 프롬프트 값(규칙 기반이든 실제 AI든)과 저장 정보를 합쳐
 * 출처 라벨이 붙은 드래프트를 만든다.
 */
export function buildDraft(
  mission: Mission,
  originalPrompt: string,
  promptValues: Record<string, string>,
  savedContext?: SavedContext
): PromptDraft {
  const values: Record<string, string> = {};
  const sources: PromptDraft["sources"] = {};
  const prompt = normalizeWhitespace(originalPrompt);

  for (const ingredient of mission.ingredients) {
    const promptValue = promptValues[ingredient.id];
    if (promptValue) {
      values[ingredient.id] = normalizeWhitespace(promptValue);
      sources[ingredient.id] = "prompt";
      continue;
    }

    const savedValue = valueFromSavedContext(ingredient, savedContext);
    if (savedValue) {
      values[ingredient.id] = savedValue;
      sources[ingredient.id] = "saved";
    }
  }

  return {
    missionId: mission.id,
    originalPrompt: prompt,
    values,
    sources,
  };
}

export function createDraft(
  mission: Mission,
  originalPrompt: string,
  savedContext?: SavedContext
): PromptDraft {
  return buildDraft(
    mission,
    originalPrompt,
    extractPromptValues(mission, originalPrompt),
    savedContext
  );
}

export function updateDraftValue(
  draft: PromptDraft,
  ingredientId: string,
  value: string,
  source: "chip" | "typed"
): PromptDraft {
  const nextValue = normalizeWhitespace(value);
  if (!nextValue) return draft;
  return {
    ...draft,
    values: { ...draft.values, [ingredientId]: nextValue },
    sources: { ...draft.sources, [ingredientId]: source },
  };
}

export function analyzeDraft(mission: Mission, draft: PromptDraft): PromptAnalysis {
  const presentIngredients = mission.ingredients
    .filter((ingredient) => Boolean(draft.values[ingredient.id]))
    .map((ingredient) => ({
      ...ingredient,
      value: draft.values[ingredient.id],
      source: draft.sources[ingredient.id],
    }));
  const missingIngredients = mission.ingredients
    .filter((ingredient) => !draft.values[ingredient.id])
    .map((ingredient) => ({ ...ingredient }));
  const nextIngredient = missingIngredients[0];
  const improvedPrompt = fillTemplate(mission.promptTemplate, draft.values, mission.ingredients);
  const afterPreview = fillTemplate(
    mission.afterPreviewTemplate,
    draft.values,
    mission.ingredients
  );

  return {
    presentIngredients,
    missingIngredients,
    nextIngredient,
    nextQuestion: nextIngredient?.question,
    chipOptions: nextIngredient?.options ?? [],
    improvedPrompt,
    improvements: presentIngredients.map(
      (ingredient) => `${ingredient.label}${subjectParticle(ingredient.label)} 추가됐어요`
    ),
    beforePreview: mission.beforePreview,
    afterPreview,
    recipeTemplate: mission.recipeTemplate,
    complete: missingIngredients.length === 0,
  };
}

/**
 * 로컬 분석은 진행 상태만 계산하고, 사용자에게 보이는 코칭 문구는
 * 서버에서 검증된 AI 턴 응답으로 교체한다.
 */
export function analyzeCoachTurn(
  mission: Mission,
  draft: PromptDraft,
  turn: CoachTurnResult
): PromptAnalysis {
  const analysis = analyzeDraft(mission, draft);

  if (analysis.complete) {
    if (!turn.complete) {
      throw new Error("AI가 완성된 프롬프트를 반환하지 않았어요. 다시 시도해주세요.");
    }
    return {
      ...analysis,
      improvedPrompt: turn.complete.improvedPrompt,
      improvements: turn.complete.improvements,
      recipeTemplate: turn.complete.recipeTemplate,
    };
  }

  if (!turn.next || turn.next.ingredientId !== analysis.nextIngredient?.id) {
    throw new Error("AI의 다음 질문을 확인하지 못했어요. 다시 시도해주세요.");
  }

  const nextIngredient: PromptIngredient = {
    ...analysis.nextIngredient,
    question: turn.next.question,
    why: turn.next.why,
    options: turn.next.chips,
  };

  return {
    ...analysis,
    nextIngredient,
    nextQuestion: nextIngredient.question,
    chipOptions: nextIngredient.options,
  };
}

export function getDefaultMission(purposeId: string): Mission {
  return getMissionsByPurpose(purposeId)[0];
}

export function createRecipe(
  mission: Mission,
  analysis: PromptAnalysis,
  purposeId: string
): PromptRecipe {
  return {
    id: `${mission.id}-${Date.now()}`,
    missionId: mission.id,
    purposeId,
    title: `${mission.title} 레시피`,
    template: analysis.recipeTemplate,
    prompt: analysis.improvedPrompt,
    createdAt: new Date().toISOString(),
  };
}

export function optionValue(option: IngredientOption) {
  return option.value || option.label;
}
