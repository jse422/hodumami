import { ExpiryStatus } from '@/types/product'

export function getExpiryStatus(expiryDate?: string): ExpiryStatus | null {
  if (!expiryDate) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return '만료'
  if (diffDays <= 30) return '주의'
  return '정상'
}

export function categoryEmoji(category: string): string {
  const map: Record<string, string> = {
    스킨케어: '🧴',
    메이크업: '💄',
    선케어: '☀️',
    바디케어: '🧼',
    헤어케어: '💇',
    기타: '✨',
  }
  return map[category] ?? '🧴'
}
