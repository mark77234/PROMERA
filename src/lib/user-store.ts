import type { UserProfile } from "@/types/app";

const STORAGE_KEY = "promera-user";
const LEGACY_STORAGE_KEY = "pp-user";

export function loadUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    if (
      !parsed ||
      typeof parsed.name !== "string" ||
      typeof parsed.ageGroup !== "string" ||
      typeof parsed.job !== "string" ||
      typeof parsed.onboarded !== "boolean"
    ) {
      return null;
    }
    return parsed as UserProfile;
  } catch {
    return null;
  }
}

export function saveUser(user: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // 저장 실패(시크릿 모드 등)해도 세션 동작에는 지장 없음
  }
}

export function clearUser(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore
  }
}
