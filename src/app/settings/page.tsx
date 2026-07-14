'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'
import { useTheme } from '@/components/layout/ThemeProvider'

function useLocalToggle(key: string, defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const saved = localStorage.getItem(key)
    if (saved !== null) setValue(saved === 'true')
  }, [key])

  function toggle(next: boolean) {
    setValue(next)
    localStorage.setItem(key, String(next))
  }

  return [value, toggle] as const
}

export default function SettingsPage() {
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [currency, setCurrency] = useState<'CAD' | 'USD'>('CAD')
  const [usMarket, setUsMarket] = useLocalToggle('pref_us_market', true)
  const [caMarket, setCaMarket] = useLocalToggle('pref_ca_market', true)

  useEffect(() => {
    const saved = localStorage.getItem('pref_currency')
    if (saved === 'CAD' || saved === 'USD') setCurrency(saved)
  }, [])

  function handleCurrency(c: 'CAD' | 'USD') {
    setCurrency(c)
    localStorage.setItem('pref_currency', c)
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 pt-12 pb-6 px-5 transition-colors duration-200">
      <header className="relative flex items-center justify-center mb-8">
        <button
          onClick={() => router.back()}
          className="absolute left-0 p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
      </header>

      <div className="flex flex-col gap-8 pb-20">
        {/* Appearance */}
        <section>
          <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 ml-2">
            Appearance
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <span className="text-[15px] font-medium text-slate-700 dark:text-slate-200">Dark Mode</span>
              <Switch.Root
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer transition-colors shadow-inner"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px] shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
              </Switch.Root>
            </div>
          </div>
        </section>

        {/* Investing Preferences */}
        <section>
          <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 ml-2">
            Investing Preferences
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[15px] font-medium text-slate-700 dark:text-slate-200">Default Currency</span>
              <div className="flex bg-slate-100/80 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                {(['CAD', 'USD'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => handleCurrency(c)}
                    className={`px-3.5 py-1.5 text-[13px] font-bold rounded-md transition-all ${
                      currency === c
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-600'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[15px] font-medium text-slate-700 dark:text-slate-200">US Market</span>
              <Switch.Root
                checked={usMarket}
                onCheckedChange={setUsMarket}
                className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer transition-colors shadow-inner"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px] shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
              </Switch.Root>
            </div>
            <div className="flex items-center justify-between p-5">
              <span className="text-[15px] font-medium text-slate-700 dark:text-slate-200">Canadian Market</span>
              <Switch.Root
                checked={caMarket}
                onCheckedChange={setCaMarket}
                className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer transition-colors shadow-inner"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px] shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
              </Switch.Root>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
