import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: '나만의 화장대',
  description: '내 화장품을 한눈에 관리해요',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '나만의 화장대',
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#fb7185',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="bg-gray-50 min-h-full">
        <div className="max-w-lg mx-auto pb-24">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  )
}
