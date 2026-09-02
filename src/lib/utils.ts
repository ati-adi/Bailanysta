import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** «только что», «15 мин назад», «2 ч назад», «1 д назад» из ISO-даты */
export function formatTimeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (diffSec < 60) return 'только что'
  const min = Math.floor(diffSec / 60)
  if (min < 60) return `${min} мин назад`
  const hours = Math.floor(min / 60)
  if (hours < 24) return `${hours} ч назад`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'вчера'
  if (days < 7) return `${days} д назад`
  const weeks = Math.floor(days / 7)
  return `${weeks} нед назад`
}

export interface TextPart {
  type: 'text' | 'hashtag'
  value: string
}

/** Разбивает текст поста на части, выделяя #хэштеги (кириллица включена) */
export function parseHashtags(text: string): TextPart[] {
  const parts: TextPart[] = []
  const regex = /#[\p{L}\p{N}_]+/gu
  let last = 0
  for (const match of text.matchAll(regex)) {
    const index = match.index ?? 0
    if (index > last) parts.push({ type: 'text', value: text.slice(last, index) })
    parts.push({ type: 'hashtag', value: match[0] })
    last = index + match[0].length
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) })
  return parts
}

/** Извлекает уникальные хэштеги из текста */
export function extractHashtags(text: string): string[] {
  return Array.from(text.matchAll(/#[\p{L}\p{N}_]+/gu), (m) => m[0].toLowerCase())
}

export function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}
