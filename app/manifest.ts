import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '나만의 화장대',
    short_name: '화장대',
    description: '내 화장품을 한눈에 관리해요',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#fb7185',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
