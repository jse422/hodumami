'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/products', label: '목록', icon: '📋' },
  { href: '/products/new', label: '', isMain: true },
  { href: '/wishlist', label: '또살템', icon: '♥' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          if (item.isMain) {
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center -mt-5">
                <div className="w-14 h-14 rounded-full bg-rose-400 flex items-center justify-center shadow-lg shadow-rose-200">
                  <span className="text-3xl text-white leading-none">+</span>
                </div>
              </Link>
            )
          }

          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-3 px-5 gap-0.5 transition-colors ${
                isActive ? 'text-rose-400' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
