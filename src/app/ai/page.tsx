'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowUp, Sparkles, RefreshCw } from 'lucide-react'
import { sendChatMessage, type ChatMessage } from '@/lib/api'

const STARTERS = [
  'What are the best Canadian dividend ETFs?',
  'Compare VFV vs XUU',
  'What ETF is good for TFSA growth?',
  'Explain covered call ETFs',
]

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mr-2.5 mt-0.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </div>
      )}
      <div
        className={`max-w-[82%] px-4 py-3 rounded-[20px] text-[15px] leading-relaxed font-medium ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-[6px]'
            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800 rounded-bl-[6px] shadow-sm'
        }`}
      >
        {msg.content}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mr-2.5 mt-0.5 shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[20px] rounded-bl-[6px] px-4 py-3.5 shadow-sm flex gap-1.5 items-center">
        <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}

export default function AIGuidePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`
  }

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMsg: ChatMessage = { role: 'user', content: trimmed }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    setIsLoading(true)

    try {
      const reply = await sendChatMessage(next)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I couldn't reach the AI. Please try again in a moment.",
      }])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Header */}
      <header className="shrink-0 pt-12 px-5 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">AI Guide</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Ask anything about ETFs.</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={2.5} />
            New chat
          </button>
        )}
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 pb-16">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
              <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="text-[17px] font-bold text-slate-800 dark:text-slate-100 mb-1">ETF Research Assistant</p>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium max-w-[260px] leading-relaxed">
                Ask me anything about ETFs — I'll use live data from the database to answer.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 w-full max-w-[320px]">
              {STARTERS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[13px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-[0.98]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => <MessageBubble key={i} msg={m} />)}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-5 pb-28 pt-3 bg-slate-50 dark:bg-slate-950">
        <div className="relative flex items-end bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-[28px] border border-slate-100 dark:border-slate-800 p-1.5 pl-4 transition-colors duration-200">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask the AI Guide..."
            rows={1}
            className="flex-1 max-h-32 min-h-[48px] bg-transparent text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium py-3.5 px-2 resize-none focus:outline-none"
          />
          <div className="pb-1 pr-1 pl-2">
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-blue-600 text-white rounded-full shadow-[0_4px_12px_rgba(37,99,235,0.25)] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              <ArrowUp className="w-[22px] h-[22px]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
