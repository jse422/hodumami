import { sampleProducts } from '@/lib/sample-data'
import ProductCard from '@/components/ProductCard'

export default function WishlistPage() {
  const wishlist = sampleProducts.filter((p) => p.is_wishlist)

  return (
    <div className="px-4 pt-14 pb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">또살템 ♥</h1>
      <p className="text-sm text-gray-400 mb-6">다시 사고 싶은 제품 목록이에요</p>

      <div className="flex flex-col gap-3">
        {wishlist.length === 0 ? (
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
