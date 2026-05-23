import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http')) return imagePath
  const { data } = supabase.storage.from('product-images').getPublicUrl(imagePath)
  return data.publicUrl
}
