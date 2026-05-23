'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/types/product'
import { supabase } from '@/lib/supabase'

const categories: Category[] = ['스킨케어', '메이크업', '선케어', '바디케어', '헤어케어', '기타']

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200 focus:border-rose-300 transition-colors'

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '스킨케어' as Category,
    purchase_date: '',
    opened_date: '',
    expiry_date: '',
    memo: '',
    is_wishlist: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.from('products').insert({
      name: form.name,
      brand: form.brand || null,
      category: form.category,
      purchase_date: form.purchase_date || null,
      opened_date: form.opened_date || null,
      expiry_date: form.expiry_date || null,
      memo: form.memo || null,
      is_wishlist: form.is_wishlist,
    })

    setLoading(false)

    if (error) {
      setError('저장에 실패했어요. 다시 시도해주세요.')
      return
    }

    router.push('/products')
  }

  return (
    <div className="px-4 pt-12 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-500 text-lg"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800">화장품 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field label="제품명 *">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="예) 수분크림"
            required
            className={inputClass}
          />
        </Field>

        <Field label="브랜드">
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="예) 이니스프리"
            className={inputClass}
          />
        </Field>

        <Field label="카테고리">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </Field>

        <Field label="구매일">
          <input
            type="date"
            name="purchase_date"
            value={form.purchase_date}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="개봉일">
          <input
            type="date"
            name="opened_date"
            value={form.opened_date}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="유통기한">
          <input
            type="date"
            name="expiry_date"
            value={form.expiry_date}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="메모">
          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="사용감, 피부 반응 등 자유롭게 적어보세요"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <label className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm cursor-pointer">
          <input
            type="checkbox"
            name="is_wishlist"
            checked={form.is_wishlist}
            onChange={handleChange}
            className="w-5 h-5 rounded accent-rose-400"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">또살템으로 등록</p>
            <p className="text-xs text-gray-400">다시 구매하고 싶은 제품이에요</p>
          </div>
        </label>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-rose-400 text-white font-semibold rounded-2xl mt-2 active:bg-rose-500 transition-colors text-base shadow-sm shadow-rose-200 disabled:opacity-60"
        >
          {loading ? '저장 중...' : '등록하기'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
