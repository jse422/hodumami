'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Product } from '@/types/product'
import { supabase } from '@/lib/supabase'
import { getExpiryStatus, categoryEmoji } from '@/lib/utils'
import ExpiryBadge from '@/components/ExpiryBadge'

export default function ProductDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      if (!error) setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const handleDelete = async () => {
    if (!confirm('정말 삭제할까요?')) return
    setDeleting(true)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      alert('삭제에 실패했어요. 다시 시도해주세요.')
      setDeleting(false)
      return
    }
    router.push('/products')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300 text-sm">
        불러오는 중...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400 gap-3">
        <p className="text-5xl">🧴</p>
        <p className="text-sm">제품을 찾을 수 없어요</p>
        <Link href="/products" className="text-sm text-rose-400 mt-2">목록으로 →</Link>
      </div>
    )
  }

  const status = getExpiryStatus(product.expiry_date)

  return (
    <div className="px-4 pt-12 pb-8">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-500 text-lg"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800">제품 상세</h1>
      </div>

      {/* 제품 헤더 카드 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 rounded-xl bg-rose-50 flex items-center justify-center text-4xl flex-shrink-0">
            {categoryEmoji(product.category)}
          </div>
          <div className="flex-1 min-w-0">
            {product.brand && <p className="text-sm text-gray-400">{product.brand}</p>}
            <p className="text-xl font-bold text-gray-800 leading-tight">{product.name}</p>
            <p className="text-sm text-gray-400 mt-0.5">{product.category}</p>
            <div className="flex items-center gap-2 mt-2">
              {status && <ExpiryBadge status={status} />}
              {product.is_wishlist && (
                <span className="text-xs text-rose-400 font-medium">♥ 또살템</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 정보 카드 */}
      {(product.purchase_date || product.opened_date || product.expiry_date) && (
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          {product.purchase_date && (
            <InfoRow label="구매일" value={product.purchase_date} />
          )}
          {product.opened_date && (
            <InfoRow label="개봉일" value={product.opened_date} />
          )}
          {product.expiry_date && (
            <InfoRow label="유통기한" value={product.expiry_date} last />
          )}
        </div>
      )}

      {/* 메모 */}
      {product.memo && (
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <p className="text-xs text-gray-400 mb-1">메모</p>
          <p className="text-sm text-gray-700 leading-relaxed">{product.memo}</p>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-3">
        <Link
          href={`/products/${id}/edit`}
          className="flex-1 py-4 bg-rose-400 text-white font-semibold rounded-2xl text-center text-base shadow-sm shadow-rose-200"
        >
          수정
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 py-4 bg-white text-gray-400 font-semibold rounded-2xl text-base shadow-sm disabled:opacity-60"
        >
          {deleting ? '삭제 중...' : '삭제'}
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex justify-between px-4 py-3 ${!last ? 'border-b border-gray-50' : ''}`}>
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-700">{value}</span>
    </div>
  )
}
