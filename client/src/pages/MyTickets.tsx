/**
 * My Tickets Page - Customer ticket list with filtering
 */

import { useState } from 'react'
import { Link } from 'wouter'
import { useTickets } from '@/hooks/useTickets'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { TicketCard } from '@/components/tickets/TicketCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { TicketStatus } from '@/types'

const STATUSES: { value: TicketStatus | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'auto_resolved', label: 'Auto Resolved' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'closed', label: 'Closed' },
]

export default function MyTickets() {
  const [activeStatus, setActiveStatus] = useState<TicketStatus | undefined>(undefined)
  const { data: tickets, isLoading } = useTickets(activeStatus)

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="My Tickets"
          description="View and manage your support requests"
          image="/images/bridge.png"
          action={
            <Link href="/tickets/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            </Link>
          }
        />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {STATUSES.map((status) => (
            <button
              key={status.value || 'all'}
              onClick={() => setActiveStatus(status.value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 text-sm font-medium border ${
                activeStatus === status.value
                  ? 'bg-gradient-to-r from-accent-blue to-accent-blue/80 border-accent-blue/50 text-white shadow-[0_0_20px_-8px_var(--accent-blue)]'
                  : 'bg-bg-surface/50 backdrop-blur-xl border-bg-border/70 text-text-secondary hover:bg-white/[0.05] hover:text-text-primary'
              }`}
            >
              {status.label}
              {tickets && (
                <span className="ml-2 text-xs opacity-70">
                  ({tickets.filter((t) => status.value === undefined || t.status === status.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12 text-text-secondary">Loading tickets...</div>
          ) : !tickets || tickets.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-bg-border/70 bg-bg-surface/30 backdrop-blur-xl">
              <div className="w-14 h-14 rounded-full bg-accent-blue/10 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-accent-blue" />
              </div>
              <p className="text-text-secondary mb-4">No tickets yet</p>
              <Link href="/tickets/new">
                <Button>Submit Your First Ticket</Button>
              </Link>
            </div>
          ) : (
            tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
          )}
        </div>
      </div>
    </AppShell>
  )
}
