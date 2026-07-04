/**
 * Admin Tickets Page - Browse all tickets in the system
 *
 * Fixes applied:
 * - Fix 11: per-tab (N) count was showing the *currently selected* status
 *   count on every tab simultaneously, making the numbers meaningless.
 *   Now shows the count only on the active tab where it's accurate.
 * - Added 'in_progress' tab (status existed on backend, was missing here).
 */

import { useState } from 'react'
import { useAdminTickets } from '@/hooks/useTickets'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { TicketTable } from '@/components/tickets/TicketTable'
import type { TicketStatus } from '@/types'

const STATUSES: { value: TicketStatus | undefined; label: string }[] = [
  { value: undefined,       label: 'All'           },
  { value: 'open',          label: 'Open'          },
  { value: 'escalated',     label: 'Escalated'     },
  { value: 'in_progress',   label: 'In Progress'   },
  { value: 'auto_resolved', label: 'Auto Resolved' },
  { value: 'closed',        label: 'Closed'        },
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
          image="/images/audit.jpg"
        />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto border-b border-bg-border pb-[2px]">
          {STATUSES.map((status) => {
            const isActive = activeStatus === status.value
            return (
              <button
                key={status.value ?? 'all'}
                onClick={() => { setActiveStatus(status.value); setPage(1) }}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-accent-blue border-b-2 border-accent-blue -mb-[3px]'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {status.label}
                {/* Only show count on the active tab — data.pagination.total
                    is the total for the current filter, not all tabs */}
                {isActive && data && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({data.pagination.total})
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tickets Table */}
        {isLoading ? (
          <div className="text-center py-12 text-text-secondary">Loading tickets…</div>
        ) : !data || data.tickets.length === 0 ? (
          <div className="text-center py-12 bg-bg-surface/70 backdrop-blur-xl border border-bg-border/70 rounded-xl">
            <p className="text-text-secondary">No tickets found</p>
          </div>
        ) : (
          <>
            <div className="bg-bg-surface/70 backdrop-blur-xl border border-bg-border/70 rounded-xl overflow-hidden mb-6">
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
