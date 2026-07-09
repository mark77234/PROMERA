import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// "사장님" + "님" = "사장님님"이 되지 않도록 존칭을 중복 없이 붙인다.
export function withHonorific(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return ""
  return trimmed.endsWith("님") ? trimmed : `${trimmed}님`
}
