'use client'

import { useEffect, useState } from 'react'
import { Category, Product } from '@/types/product'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

const categories: (Category | '전체')[] = [
  '전체', '스킨케어', '메이크업', '선케어', '바디케어', '헤어케어', '기타',
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<Category | '전체'>('전체')
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

  const filtered =
    selected === '전체' ? products : products.filter((p) => p.category === selected)

  return (
    <div className="px-4 pt-14 pb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">화장품 목록</h1>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selected === cat
                ? 'bg-[#C8A882] text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-20 text-gray-300">
            <p className="text-5xl mb-3">⏳</p>
            <p className="text-sm">불러오는 중...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-3">🧴</p>
            <p className="text-sm">등록된 화장품이 없어요</p>
          </div>
        ) : (
          filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  )
}
