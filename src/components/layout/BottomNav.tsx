'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Sparkles } from 'lucide-react'

const NAV_ITEMS: { href: string; label: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/ai', label: 'AI Guide', Icon: Sparkles },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="absolute bottom-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 pb-8 pt-4 px-12 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.2)] rounded-t-[32px] transition-colors duration-200">
      <div className="flex justify-between items-center max-w-[200px] mx-auto">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1.5 transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-semibold tracking-wide">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
