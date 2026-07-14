'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import type { ETFDetail } from '@/types/etf'

interface Props {
  etf: ETFDetail
}

export function ETFTaxNotes({ etf }: Props) {
  const hasContent = etf.withholding_tax_note || etf.roc_note || etf.tfsa_eligible != null
  if (!hasContent) return null

  return (
    <Accordion.Root
      type="single"
      collapsible
      className="bg-white dark:bg-slate-900 rounded-3xl border border-zinc-200 dark:border-slate-800 overflow-hidden shadow-sm"
    >
      <Accordion.Item value="tax">
        <Accordion.Header>
          <Accordion.Trigger className="flex w-full items-center justify-between px-5 py-4 hover:bg-zinc-50 dark:hover:bg-slate-800 group transition-colors">
            <span className="text-[15px] font-bold text-black dark:text-white tracking-tight">Tax Considerations</span>
            <ChevronDown className="w-5 h-5 text-zinc-400 dark:text-slate-500 group-data-[state=open]:rotate-180 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)]" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="px-5 pb-5 pt-1 flex flex-col gap-3">
            {/* TFSA / RRSP */}
            <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-slate-800">
              <div>
                <span className="font-bold text-black dark:text-white text-sm">TFSA</span>
                <p className="text-xs text-zinc-400 dark:text-slate-400 mt-0.5">Tax-Free Savings Account</p>
              </div>
              <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg ${etf.tfsa_eligible ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950 text-red-600'}`}>
                {etf.tfsa_eligible ? 'Eligible' : 'Not eligible'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-slate-800">
              <div>
                <span className="font-bold text-black dark:text-white text-sm">RRSP</span>
                <p className="text-xs text-zinc-400 dark:text-slate-400 mt-0.5">Registered Retirement Savings</p>
              </div>
              <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg ${etf.rrsp_eligible ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-950 text-red-600'}`}>
                {etf.rrsp_eligible ? 'Eligible' : 'Not eligible'}
              </span>
            </div>
            {etf.withholding_tax_note && (
              <div className="py-2 border-b border-zinc-100 dark:border-slate-800">
                <span className="font-bold text-black dark:text-white text-sm">Withholding Tax</span>
                <p className="text-xs text-zinc-400 dark:text-slate-400 mt-1">{etf.withholding_tax_note}</p>
              </div>
            )}
            {etf.roc_note && (
              <div className="py-2">
                <span className="font-bold text-black dark:text-white text-sm">Return of Capital (ROC)</span>
                <p className="text-xs text-zinc-400 dark:text-slate-400 mt-1">{etf.roc_note}</p>
              </div>
            )}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
