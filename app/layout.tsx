import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: '나만의 화장대',
  description: '내 화장품을 한눈에 관리해요',
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
