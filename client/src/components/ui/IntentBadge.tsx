/**
 * IntentBadge - Colored pill showing intent category
 */

import { cn } from '@/lib/utils'
import type { IntentCategory } from '@/types'

interface IntentBadgeProps {
  intent: IntentCategory | null
  subIntent?: string | null
  className?: string
}

const intentColors: Record<IntentCategory, string> = {
  login_issue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  payment_issue: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  account_issue: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  technical_issue: 'bg-red-500/20 text-red-300 border-red-500/30',
  feature_request: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  general_query: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  unknown: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
}

export function IntentBadge({ intent, subIntent, className }: IntentBadgeProps) {
  if (!intent) {
    return <span className="text-text-muted text-xs">Unclassified</span>
  }

  const colorClass = intentColors[intent]
  const label = intent.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className={cn('space-y-1', className)}>
      <div className={cn('inline-block px-2.5 py-1 rounded-full border text-xs font-medium', colorClass)}>
        {label}
      </div>
      {subIntent && (
        <div className="text-xs text-text-secondary ml-2">
          {subIntent.replace(/_/g, ' ')}
        </div>
      )}
    </div>
  )
}
