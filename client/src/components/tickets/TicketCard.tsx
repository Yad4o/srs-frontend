/**
 * TicketCard - Card component for displaying a single ticket
 */

import { Link } from 'wouter'
import { cn } from '@/lib/utils'
import { ConfidenceBar } from '@/components/ui/ConfidenceBar'
import { IntentBadge } from '@/components/ui/IntentBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatRelativeTime, truncateText } from '@/utils/formatters'
import { ChevronRight } from 'lucide-react'
import type { Ticket } from '@/types'

interface TicketCardProps {
  ticket: Ticket
  className?: string
}

export function TicketCard({ ticket, className }: TicketCardProps) {
  return (
    <Link href={`/tickets/${ticket.id}`}>
      <a
        className={cn(
          'block p-4 bg-bg-surface border border-bg-border rounded-lg hover:border-accent-blue hover:bg-bg-raised transition-all group',
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header: ID and Status */}
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs text-text-muted">#{ticket.id}</span>
              <StatusBadge status={ticket.status} />
            </div>

            {/* Message preview */}
            <p className="text-sm text-text-primary mb-3 line-clamp-2">{truncateText(ticket.message, 100)}</p>

            {/* Intent and confidence */}
            <div className="flex items-center gap-3 mb-3">
              <IntentBadge intent={ticket.intent} />
              {ticket.confidence !== null && (
                <div className="flex-1 max-w-xs">
                  <ConfidenceBar value={ticket.confidence} showLabel={false} size="sm" />
                </div>
              )}
            </div>

            {/* Footer: Time */}
            <p className="text-xs text-text-muted">{formatRelativeTime(ticket.created_at)}</p>
          </div>

          {/* Arrow indicator */}
          <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent-blue transition-colors flex-shrink-0 mt-1" />
        </div>
      </a>
    </Link>
  )
}
