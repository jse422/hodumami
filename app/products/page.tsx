'use client'

import { useState } from 'react'
import { sampleProducts } from '@/lib/sample-data'
import { Category } from '@/types/product'
import ProductCard from '@/components/ProductCard'

const categories: (Category | '전체')[] = [
  '전체', '스킨케어', '메이크업', '선케어', '바디케어', '헤어케어', '기타',
]

export default function ProductsPage() {
  const [selected, setSelected] = useState<Category | '전체'>('전체')

  const filtered =
    selected === '전체'
      ? sampleProducts
      : sampleProducts.filter((p) => p.category === selected)

  return (
    <div className="px-4 pt-14 pb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">화장품 목록</h1>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selected === cat
                ? 'bg-rose-400 text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
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
