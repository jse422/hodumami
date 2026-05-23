import { Category } from '@/types/product'

export const categories: Category[] = ['스킨케어', '메이크업', '선케어', '바디케어', '헤어케어', '기타']

export const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200 focus:border-rose-300 transition-colors'

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
