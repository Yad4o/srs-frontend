/**
 * TicketTable - Table component for displaying multiple tickets
 *
 * Fixes applied:
 * 1. Removed nested <a> inside <Link> (wouter v3 invalid HTML anti-pattern)
 * 2. Made entire row clickable via Link wrapping instead of dead onRowClick prop
 *    that was never passed by any consumer
 */

import { Link } from 'wouter'
import { cn } from '@/lib/utils'
import { ConfidenceBar } from '@/components/ui/ConfidenceBar'
import { IntentBadge } from '@/components/ui/IntentBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatRelativeTime } from '@/utils/formatters'
import type { Ticket } from '@/types'

interface TicketTableProps {
  tickets: Ticket[]
  className?: string
}

export function TicketTable({ tickets, className }: TicketTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.02]">
            <th className="px-4 py-3.5 text-left text-text-secondary font-medium text-xs uppercase tracking-wide">ID</th>
            <th className="px-4 py-3.5 text-left text-text-secondary font-medium text-xs uppercase tracking-wide">Message</th>
            <th className="px-4 py-3.5 text-left text-text-secondary font-medium text-xs uppercase tracking-wide">Intent</th>
            <th className="px-4 py-3.5 text-left text-text-secondary font-medium text-xs uppercase tracking-wide">Confidence</th>
            <th className="px-4 py-3.5 text-left text-text-secondary font-medium text-xs uppercase tracking-wide">Status</th>
            <th className="px-4 py-3.5 text-left text-text-secondary font-medium text-xs uppercase tracking-wide">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors duration-150">
              <td className="px-4 py-3.5 font-mono text-text-muted">#{ticket.id}</td>
              <td className="px-4 py-3.5 text-text-primary max-w-xs truncate">
                {/* Entire cell is the navigation target — no nested <a> */}
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="hover:text-accent-blue transition-colors block truncate"
                >
                  {ticket.message}
                </Link>
              </td>
              <td className="px-4 py-3.5">
                <IntentBadge intent={ticket.intent} />
              </td>
              <td className="px-4 py-3.5 max-w-xs">
                <ConfidenceBar value={ticket.confidence} showLabel={false} size="sm" />
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3.5 text-text-secondary">{formatRelativeTime(ticket.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
