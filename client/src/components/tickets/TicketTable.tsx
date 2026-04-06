/**
 * TicketTable - Table component for displaying multiple tickets
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
  onRowClick?: (ticket: Ticket) => void
}

export function TicketTable({ tickets, className, onRowClick }: TicketTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-bg-border">
            <th className="px-4 py-3 text-left text-text-secondary font-medium">ID</th>
            <th className="px-4 py-3 text-left text-text-secondary font-medium">Message</th>
            <th className="px-4 py-3 text-left text-text-secondary font-medium">Intent</th>
            <th className="px-4 py-3 text-left text-text-secondary font-medium">Confidence</th>
            <th className="px-4 py-3 text-left text-text-secondary font-medium">Status</th>
            <th className="px-4 py-3 text-left text-text-secondary font-medium">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              onClick={() => onRowClick?.(ticket)}
              className="border-b border-bg-border hover:bg-bg-raised transition-colors cursor-pointer"
            >
              <td className="px-4 py-3 font-mono text-text-muted">#{ticket.id}</td>
              <td className="px-4 py-3 text-text-primary max-w-xs truncate">
                <Link href={`/tickets/${ticket.id}`}>
                  <a className="hover:text-accent-blue transition-colors">{ticket.message}</a>
                </Link>
              </td>
              <td className="px-4 py-3">
                <IntentBadge intent={ticket.intent} />
              </td>
              <td className="px-4 py-3 max-w-xs">
                <ConfidenceBar value={ticket.confidence} showLabel={false} size="sm" />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3 text-text-secondary">{formatRelativeTime(ticket.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
