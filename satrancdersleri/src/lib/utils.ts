import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ı/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function levelLabel(level: string): string {
  const map: Record<string, string> = {
    BEGINNER: 'Başlangıç',
    INTERMEDIATE: 'Orta',
    ADVANCED: 'İleri',
  }
  return map[level] ?? level
}

export function levelColor(level: string): string {
  const map: Record<string, string> = {
    BEGINNER: 'text-emerald-700 bg-emerald-100',
    INTERMEDIATE: 'text-amber-700 bg-amber-100',
    ADVANCED: 'text-red-700 bg-red-100',
  }
  return map[level] ?? 'text-slate-700 bg-slate-100'
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
