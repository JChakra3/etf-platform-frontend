'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Star } from 'lucide-react'

export default function FeedbackPage() {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 pt-12 pb-24 px-5 transition-colors duration-200">
      <header className="relative flex items-center justify-center mb-8">
        <button
          onClick={() => router.back()}
          className="absolute left-0 p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <h1 className="text-[17px] font-bold text-slate-900 dark:text-white tracking-tight">Provide Feedback</h1>
      </header>

      <div className="flex flex-col flex-1 gap-8">
        <section className="flex flex-col gap-2">
          <label className="text-[15px] font-bold text-slate-900 dark:text-white ml-1">
            Your detailed feedback
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Tell us what you think, report a bug..."
            className="w-full h-40 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-[20px] p-4 text-[15px] font-medium border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] resize-none"
          />
        </section>

        <section className="flex flex-col gap-3">
          <label className="text-[15px] font-bold text-slate-900 dark:text-white ml-1">Overall rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 transition-colors ${
                  star <= rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700 hover:text-amber-200'
                }`}
              >
                <Star className="w-8 h-8" fill={star <= rating ? 'currentColor' : 'none'} strokeWidth={2} />
              </button>
            ))}
          </div>
        </section>

        <div className="mt-auto pt-6">
          <button
            disabled={!text.trim() || rating === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-[15px] py-4 rounded-[20px] shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all active:scale-[0.98]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
