'use client'

import { ArrowUp } from 'lucide-react'

export default function AIGuidePage() {
  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 pt-12 px-5 transition-colors duration-200">
      <header className="mb-2 shrink-0">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">AI Guide</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Understand ETFs with your AI assistant.</p>
      </header>

      <div className="flex-1 flex items-center justify-center">
        <p className="text-[15px] text-slate-400 dark:text-slate-500 font-medium text-center px-8 leading-relaxed max-w-[280px]">
          Your questions and my insights will appear here.
        </p>
      </div>

      <div className="shrink-0 pb-2 pt-4">
        <div className="relative flex items-end bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-[28px] border border-slate-100 dark:border-slate-800 p-1.5 pl-4 transition-colors duration-200">
          <textarea
            placeholder="Ask the AI Guide..."
            rows={1}
            className="flex-1 max-h-32 min-h-[48px] bg-transparent text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium py-3.5 px-2 resize-none focus:outline-none overflow-hidden"
          />
          <div className="pb-1 pr-1 pl-2">
            <button
              disabled
              className="p-3 bg-blue-600 text-white rounded-full shadow-[0_4px_12px_rgba(37,99,235,0.25)] opacity-50 cursor-not-allowed"
            >
              <ArrowUp className="w-[22px] h-[22px]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <p className="text-center text-[11px] text-slate-400 dark:text-slate-600 mt-2 font-medium">
          AI Guide coming in Phase 2
        </p>
      </div>
    </div>
  )
}
