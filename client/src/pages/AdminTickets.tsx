/**
 * Admin Tickets Page - Browse all tickets in the system
 */

import { useState } from 'react'
import { useAdminTickets } from '@/hooks/useTickets'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { TicketTable } from '@/components/tickets/TicketTable'
import type { TicketStatus } from '@/types'

const STATUSES: { value: TicketStatus | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'auto_resolved', label: 'Auto Resolved' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'closed', label: 'Closed' },
]

export default function AdminTickets() {
  const [activeStatus, setActiveStatus] = useState<TicketStatus | undefined>(undefined)
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminTickets(page, 20, activeStatus)

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="All Tickets"
          description="Browse and manage all tickets in the system"
        />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {STATUSES.map((status) => (
            <button
              key={status.value || 'all'}
              onClick={() => {
                setActiveStatus(status.value)
                setPage(1)
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeStatus === status.value
                  ? 'bg-accent-blue text-bg-base'
                  : 'bg-bg-surface text-text-secondary hover:bg-bg-raised'
              }`}
            >
              {status.label}
              {data && (
                <span className="ml-2 text-xs opacity-70">
                  ({data.pagination.total})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tickets Table */}
        {isLoading ? (
          <div className="text-center py-12 text-text-secondary">Loading tickets...</div>
        ) : !data || data.tickets.length === 0 ? (
          <div className="text-center py-12 bg-bg-surface border border-bg-border rounded-lg">
            <p className="text-text-secondary">No tickets found</p>
          </div>
        ) : (
          <>
            <div className="bg-bg-surface border border-bg-border rounded-lg overflow-hidden mb-6">
              <TicketTable tickets={data.tickets} />
            </div>

            {/* Pagination */}
            {data.pagination.total_pages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  Page {page} of {data.pagination.total_pages} ({data.pagination.total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={!data.pagination.has_prev}
                    className="px-4 py-2 bg-bg-surface border border-bg-border rounded hover:bg-bg-raised disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!data.pagination.has_next}
                    className="px-4 py-2 bg-bg-surface border border-bg-border rounded hover:bg-bg-raised disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  )
}
