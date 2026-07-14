'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search } from 'lucide-react'

interface Props {
  defaultValue?: string
  autoFocus?: boolean
}

export function SearchBar({ defaultValue = '', autoFocus = false }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)
  const [, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="relative flex items-center">
        <Search
          size={18}
          className="absolute left-3 text-gray-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by ticker, name, sector, strategy…"
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none ring-[--color-brand] transition focus:border-[--color-brand] focus:bg-white focus:ring-1"
        />
      </div>
    </form>
  )
}
