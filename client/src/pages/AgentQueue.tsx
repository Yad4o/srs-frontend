import { useState } from 'react'
import { useMyAssignments } from '@/hooks/useTickets'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { TicketTable } from '@/components/tickets/TicketTable'
import { CheckCircle } from 'lucide-react'

export default function AgentQueue() {
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active')
  
  const statusFilter = activeTab === 'active' ? 'escalated' : 'closed'
  const { data: tickets, isLoading } = useMyAssignments(statusFilter)

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="My Assignments"
          description="Escalated tickets assigned to you"
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-bg-border pb-[2px]">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'active'
                ? 'text-accent-blue border-b-2 border-accent-blue -mb-[3px]'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'resolved'
                ? 'text-accent-blue border-b-2 border-accent-blue -mb-[3px]'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Tickets Table */}
        {isLoading ? (
          <div className="text-center py-12 text-text-secondary">Loading tickets...</div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="text-center py-12 bg-bg-surface border border-bg-border rounded-lg">
            <CheckCircle className="w-12 h-12 text-accent-green mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary mb-2">No tickets assigned to you yet.</p>
            <p className="text-text-muted text-sm">Admin will assign escalated tickets to you.</p>
          </div>
        ) : (
          <div className="bg-bg-surface border border-bg-border rounded-lg overflow-hidden">
            <TicketTable tickets={tickets} />
          </div>
        )}
      </div>
    </AppShell>
  )
}
