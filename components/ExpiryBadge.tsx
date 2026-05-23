import { ExpiryStatus } from '@/types/product'

const styles: Record<ExpiryStatus, string> = {
  정상: 'bg-emerald-100 text-emerald-700',
  주의: 'bg-amber-100 text-amber-600',
  위험: 'bg-red-100 text-red-500',
  만료: 'bg-gray-100 text-gray-500',
}

export default function ExpiryBadge({ status }: { status: ExpiryStatus }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  )
}
