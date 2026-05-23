import Link from 'next/link'
import { Product } from '@/types/product'
import { getExpiryStatus, categoryEmoji } from '@/lib/utils'
import ExpiryBadge from './ExpiryBadge'

export default function ProductCard({ product }: { product: Product }) {
  const status = getExpiryStatus(product.expiry_date)

  return (
    <Link href={`/products/${product.id}`} className="bg-white rounded-2xl p-4 flex gap-3 shadow-sm active:opacity-70 transition-opacity">
      <div className="w-16 h-16 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-2xl">
        {product.image_path
          ? <img src={product.image_path} alt={product.name} className="w-full h-full object-cover rounded-xl" />
          : categoryEmoji(product.category)}
      </div>

      <div className="flex-1 min-w-0">
        {product.brand && <p className="text-xs text-gray-400">{product.brand}</p>}
        <p className="font-semibold text-gray-800 truncate">{product.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
        <div className="flex items-center gap-2 mt-1.5">
          {status && <ExpiryBadge status={status} />}
          {product.is_wishlist && (
            <span className="text-xs text-rose-400 font-medium">♥ 또살템</span>
          )}
        </div>
      </div>

      {product.expiry_date && (
        <div className="text-right flex-shrink-0 self-center">
          <p className="text-xs text-gray-400">유통기한</p>
          <p className="text-xs font-medium text-gray-600 mt-0.5">{product.expiry_date}</p>
        </div>
      )}
    </Link>
  )
}
