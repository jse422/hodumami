export type Category = '스킨케어' | '메이크업' | '선케어' | '바디케어' | '헤어케어' | '기타'

export type ExpiryStatus = '정상' | '주의' | '위험' | '만료'

export interface Product {
  id: string
  user_id?: string
  name: string
  brand: string
  category: Category
  purchase_date?: string
  opened_date?: string
  expiry_date?: string
  memo?: string
  image_path?: string
  is_wishlist: boolean
  created_at: string
}
