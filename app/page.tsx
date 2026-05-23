'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Product } from '@/types/product'
import { supabase } from '@/lib/supabase'
import { getExpiryStatus } from '@/lib/utils'
import ProductCard from '@/components/ProductCard'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setProducts(data ?? [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const total = products.length
  const expiring = products.filter((p) => getExpiryStatus(p.expiry_date) === '주의').length
  const expired = products.filter((p) => getExpiryStatus(p.expiry_date) === '만료').length
  const recent = products.slice(0, 3)

  return (
    <div className="px-4 pt-14 pb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">나만의 화장대 💄</h1>
      <p className="text-sm text-gray-400 mb-7">내 화장품을 한눈에 관리해요</p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-800">{loading ? '-' : total}</p>
          <p className="text-xs text-gray-400 mt-1">전체</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-amber-500">{loading ? '-' : expiring}</p>
          <p className="text-xs text-amber-400 mt-1">곧 만료</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-red-400">{loading ? '-' : expired}</p>
          <p className="text-xs text-red-300 mt-1">만료됨</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-700">최근 등록</h2>
        <Link href="/products" className="text-sm text-rose-400">
          전체 보기 →
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-10 text-gray-300 text-sm">불러오는 중...</div>
        ) : recent.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">💄</p>
            <p className="text-sm">아직 등록된 화장품이 없어요</p>
          </div>
        ) : (
          recent.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  )
}
