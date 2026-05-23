import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  if (!query) return NextResponse.json({ images: [] })

  let res: Response
  try {
    res = await fetch(
      `https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(query)}&size=12&sort=accuracy`,
      { headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` } }
    )
  } catch {
    return NextResponse.json({ images: [] }, { status: 502 })
  }

  if (!res.ok) return NextResponse.json({ images: [] }, { status: res.status })

  const data = await res.json()
  const images = data.documents.map((doc: { thumbnail_url: string; image_url: string; display_sitename: string }) => ({
    thumbnail: doc.thumbnail_url,
    url: doc.image_url,
    site: doc.display_sitename,
  }))

  return NextResponse.json({ images })
}
