import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { BottomNav } from '@/components/layout/BottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ETF Intelligence',
  description: 'Effortlessly research and analyze ETFs with a user-friendly mobile platform designed for retail investors.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="mx-auto w-full max-w-[393px] h-[100dvh] bg-slate-50 dark:bg-slate-950 flex flex-col relative text-zinc-900 dark:text-zinc-50 font-sans sm:shadow-2xl sm:border-x sm:border-zinc-200 dark:sm:border-zinc-800 overflow-hidden transition-colors duration-200">
            <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
              {children}
            </main>
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
