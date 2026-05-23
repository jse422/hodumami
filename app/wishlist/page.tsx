'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types/product'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_wishlist', true)
        .order('created_at', { ascending: false })
      if (!error) setWishlist(data ?? [])
      setLoading(false)
    }
    fetchWishlist()
  }, [])

  return (
    <div className="px-4 pt-14 pb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">또살템 ♥</h1>
      <p className="text-sm text-gray-400 mb-6">다시 사고 싶은 제품 목록이에요</p>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-20 text-gray-300">
            <p className="text-5xl mb-3">⏳</p>
            <p className="text-sm">불러오는 중...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-3">🛍️</p>
            <p className="text-sm">아직 또살템이 없어요</p>
          </div>
        ) : (
          wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  )
}
