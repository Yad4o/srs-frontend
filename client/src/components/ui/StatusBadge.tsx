/**
 * StatusBadge - Pill with dot indicator showing ticket status
 */

import { cn } from '@/lib/utils'
import type { TicketStatus } from '@/types'

interface StatusBadgeProps {
  status: TicketStatus
  className?: string
}

const statusColors: Record<TicketStatus, { bg: string; dot: string; text: string }> = {
  open: {
    bg: 'bg-blue-500/20',
    dot: 'bg-blue-400',
    text: 'text-blue-300',
  },
  in_progress: {
    bg: 'bg-purple-500/20',
    dot: 'bg-purple-400',
    text: 'text-purple-300',
  },
  auto_resolved: {
    bg: 'bg-green-500/20',
    dot: 'bg-green-400',
    text: 'text-green-300',
  },
  escalated: {
    bg: 'bg-amber-500/20',
    dot: 'bg-amber-400',
    text: 'text-amber-300',
  },
  closed: {
    bg: 'bg-slate-500/20',
    dot: 'bg-slate-400',
    text: 'text-slate-300',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = statusColors[status]
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium',
        colors.bg,
        colors.text,
        className
      )}
    >
      <div className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
      {label}
    </div>
  )
}
