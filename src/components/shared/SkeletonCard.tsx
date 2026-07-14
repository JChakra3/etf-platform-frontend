export function SkeletonCard() {
  return (
    <div className="animate-pulse flex items-center justify-between p-4 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex-1 pr-4">
        <div className="h-5 w-16 rounded-lg bg-slate-200 dark:bg-slate-700 mb-2" />
        <div className="h-3.5 w-44 rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-5 w-14 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="h-5 w-20 rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  )
}
