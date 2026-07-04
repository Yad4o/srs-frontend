/**
 * AgentQueue — My Assignments page for agents
 *
 * Fixes applied:
 * - Fix 7: "Active" tab now fetches `in_progress` tickets (not `escalated`).
 *   escalated = assigned but not yet accepted; in_progress = accepted & active.
 *   Added a third "Pending" tab for escalated-but-unaccepted tickets.
 * - Fix 13: differentiate true empty from API error with separate messages.
 */

import { useState } from 'react'
import { useMyAssignments } from '@/hooks/useTickets'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { TicketTable } from '@/components/tickets/TicketTable'
import { CheckCircle, AlertCircle, Inbox } from 'lucide-react'
import type { TicketStatus } from '@/types'

type Tab = 'pending' | 'active' | 'resolved'

const TAB_STATUS: Record<Tab, TicketStatus> = {
  pending:  'escalated',    // assigned to me, not yet accepted
  active:   'in_progress',  // I accepted and am working it
  resolved: 'closed',       // done
}

const TAB_LABELS: Record<Tab, string> = {
  pending:  'Pending',
  active:   'Active',
  resolved: 'Resolved',
}

const TABS: Tab[] = ['pending', 'active', 'resolved']

export default function AgentQueue() {
  const [activeTab, setActiveTab] = useState<Tab>('pending')

  const { data: tickets, isLoading, isError } = useMyAssignments(TAB_STATUS[activeTab])

  const emptyMessages: Record<Tab, { title: string; subtitle: string }> = {
    pending: {
      title: 'No pending assignments',
      subtitle: 'Tickets assigned to you will appear here — click Accept to start working them.',
    },
    active: {
      title: 'Nothing in progress',
      subtitle: 'Accept a ticket from the Pending tab to move it here.',
    },
    resolved: {
      title: 'No resolved tickets yet',
      subtitle: 'Tickets you close will appear here for reference.',
    },
  }

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="My Assignments"
          description="Tickets assigned to you by an admin"
          image="/images/isolated.jpg"
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-bg-border pb-[2px]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'text-accent-blue border-b-2 border-accent-blue -mb-[3px]'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12 text-text-secondary">Loading tickets…</div>
        ) : isError ? (
          /* Fix 13: clear error state instead of misleading empty-state copy */
          <div className="text-center py-12 bg-bg-surface/70 backdrop-blur-xl border border-bg-border/70 rounded-xl">
            <AlertCircle className="w-12 h-12 text-accent-red mx-auto mb-4 opacity-60" />
            <p className="text-text-secondary mb-2 font-medium">Failed to load assignments</p>
            <p className="text-text-muted text-sm">Check your connection and try refreshing the page.</p>
          </div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="text-center py-12 bg-bg-surface/70 backdrop-blur-xl border border-bg-border/70 rounded-xl">
            {activeTab === 'resolved' ? (
              <CheckCircle className="w-12 h-12 text-accent-green mx-auto mb-4 opacity-50" />
            ) : (
              <Inbox className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
            )}
            <p className="text-text-secondary mb-2 font-medium">{emptyMessages[activeTab].title}</p>
            <p className="text-text-muted text-sm">{emptyMessages[activeTab].subtitle}</p>
          </div>
        ) : (
          <div className="bg-bg-surface/70 backdrop-blur-xl border border-bg-border/70 rounded-xl overflow-hidden">
            <TicketTable tickets={tickets} />
          </div>
        )}
      </div>
    </AppShell>
  )
}
