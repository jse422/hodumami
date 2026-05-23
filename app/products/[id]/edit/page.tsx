'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Category } from '@/types/product'
import { supabase } from '@/lib/supabase'
import { categories, inputClass, Field } from '@/components/ProductForm'
import ImagePicker from '@/components/ImagePicker'
import ImageSearch from '@/components/ImageSearch'
import { getImageUrl } from '@/lib/supabase'

type FormState = {
  name: string
  brand: string
  category: Category
  purchase_date: string
  opened_date: string
  expiry_date: string
  memo: string
  is_wishlist: boolean
}

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [form, setForm] = useState<FormState | null>(null)
  const [existingImagePath, setExistingImagePath] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageTab, setImageTab] = useState<'upload' | 'search'>('upload')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      if (!error && data) {
        setForm({
          name: data.name ?? '',
          brand: data.brand ?? '',
          category: data.category as Category,
          purchase_date: data.purchase_date ?? '',
          opened_date: data.opened_date ?? '',
          expiry_date: data.expiry_date ?? '',
          memo: data.memo ?? '',
          is_wishlist: data.is_wishlist ?? false,
        })
        setExistingImagePath(data.image_path ?? null)
      }
    }
    fetchProduct()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => prev ? { ...prev, [name]: type === 'checkbox' ? checked : value } : prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setLoading(true)
    setError('')

    let image_path = imageUrl ?? existingImagePath

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const filePath = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile)
      if (uploadError) {
        setError('사진 업로드에 실패했어요. 다시 시도해주세요.')
        setLoading(false)
        return
      }
      image_path = filePath
    }

    const { error } = await supabase.from('products').update({
      name: form.name,
      brand: form.brand || null,
      category: form.category,
      purchase_date: form.purchase_date || null,
      opened_date: form.opened_date || null,
      expiry_date: form.expiry_date || null,
      memo: form.memo || null,
      is_wishlist: form.is_wishlist,
      image_path,
    }).eq('id', id)

    setLoading(false)

    if (error) {
      setError('저장에 실패했어요. 다시 시도해주세요.')
      return
    }

    router.push(`/products/${id}`)
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300 text-sm">
        불러오는 중...
      </div>
    )
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
        <h1 className="text-xl font-bold text-gray-800">화장품 수정</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field label="사진">
          <div className="flex gap-2 mb-3">
            {(['upload', 'search'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setImageTab(tab)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  imageTab === tab
                    ? 'bg-[#C8A882] text-white'
                    : 'bg-white text-gray-400 border border-gray-200'
                }`}
              >
                {tab === 'upload' ? '직접 업로드' : '검색해서 추가'}
              </button>
            ))}
          </div>
          {imageTab === 'upload' ? (
            <ImagePicker
              file={imageFile}
              existingUrl={imageUrl ? imageUrl : existingImagePath ? getImageUrl(existingImagePath) : undefined}
              onChange={(f) => { setImageFile(f); setImageUrl(null) }}
            />
          ) : (
            <ImageSearch onSelect={(url) => { setImageUrl(url); setImageFile(null) }} />
          )}
          {imageUrl && imageTab === 'search' && (
            <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden">
              <img src={imageUrl} alt="선택된 이미지" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          )}
        </Field>

        <Field label="제품명 *">
          <input name="name" value={form.name} onChange={handleChange}
            placeholder="예) 수분크림" required className={inputClass} />
        </Field>

        <Field label="브랜드">
          <input name="brand" value={form.brand} onChange={handleChange}
            placeholder="예) 이니스프리" className={inputClass} />
        </Field>

        <Field label="카테고리">
          <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </Field>

        <Field label="구매일">
          <input type="date" name="purchase_date" value={form.purchase_date}
            onChange={handleChange} className={inputClass} />
        </Field>

        <Field label="개봉일">
          <input type="date" name="opened_date" value={form.opened_date}
            onChange={handleChange} className={inputClass} />
        </Field>

        <Field label="유통기한">
          <input type="date" name="expiry_date" value={form.expiry_date}
            onChange={handleChange} className={inputClass} />
        </Field>

        <Field label="메모">
          <textarea name="memo" value={form.memo} onChange={handleChange}
            placeholder="사용감, 피부 반응 등 자유롭게 적어보세요"
            rows={3} className={`${inputClass} resize-none`} />
        </Field>

        <label className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm cursor-pointer">
          <input type="checkbox" name="is_wishlist" checked={form.is_wishlist}
            onChange={handleChange} className="w-5 h-5 rounded accent-[#C8A882]" />
          <div>
            <p className="text-sm font-medium text-gray-700">또살템으로 등록</p>
            <p className="text-xs text-gray-400">다시 구매하고 싶은 제품이에요</p>
          </div>
        </label>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-4 bg-[#C8A882] text-white font-semibold rounded-2xl mt-2 active:bg-[#B8956E] transition-colors text-base shadow-sm shadow-[#E0CDB5] disabled:opacity-60">
          {loading ? '저장 중...' : '저장하기'}
        </button>
      </form>
    </div>
  )
}
