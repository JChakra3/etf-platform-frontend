'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import type { ETFHolding } from '@/types/etf'

interface Props {
  holdings: ETFHolding[]
}

export function ETFHoldings({ holdings }: Props) {
  if (!holdings.length) return null

  return (
    <Accordion.Root
      type="single"
      collapsible
      defaultValue="holdings"
      className="bg-white dark:bg-slate-900 rounded-3xl border border-zinc-200 dark:border-slate-800 overflow-hidden shadow-sm"
    >
      <Accordion.Item value="holdings">
        <Accordion.Header>
          <Accordion.Trigger className="flex w-full items-center justify-between px-5 py-4 bg-white dark:bg-slate-900 hover:bg-zinc-50 dark:hover:bg-slate-800 group transition-colors">
            <span className="text-[15px] font-bold text-black dark:text-white tracking-tight">Top Holdings</span>
            <ChevronDown className="w-5 h-5 text-zinc-400 dark:text-slate-500 group-data-[state=open]:rotate-180 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)]" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden text-[15px] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="px-5 pb-5 pt-1 flex flex-col gap-3">
            {holdings.map((h, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-slate-800 last:border-0 last:pb-0"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-black dark:text-white text-sm">{h.holding_ticker}</span>
                  <span className="text-xs font-medium text-zinc-400 dark:text-slate-400">{h.holding_name}</span>
                </div>
                <span className="font-bold text-black dark:text-white text-sm bg-zinc-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  {(h.weight_pct * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
