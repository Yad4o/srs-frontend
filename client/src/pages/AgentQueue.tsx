/**
 * Agent Queue Page - Escalated tickets needing human attention
 */

import { useState } from 'react'
import { useTickets } from '@/hooks/useTickets'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { TicketTable } from '@/components/tickets/TicketTable'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function AgentQueue() {
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false)
  const { data: tickets, isLoading } = useTickets('escalated')

  const filteredTickets = showUnassignedOnly
    ? tickets?.filter((t) => !t.assigned_agent_id) || []
    : tickets || []

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="Escalation Queue"
          description="Tickets requiring human attention"
        />

        {/* Alert for unassigned escalations */}
        {tickets && tickets.some((t) => !t.assigned_agent_id) && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 font-medium">
                {tickets.filter((t) => !t.assigned_agent_id).length} unassigned tickets
              </p>
              <p className="text-amber-300/70 text-sm">These tickets are waiting for agent assignment</p>
            </div>
          </div>
        )}

        {/* Filter Toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUnassignedOnly}
              onChange={(e) => setShowUnassignedOnly(e.target.checked)}
              className="w-4 h-4 rounded border-bg-border bg-bg-raised"
            />
            <span className="text-sm text-text-secondary">Show unassigned only</span>
          </label>
        </div>

        {/* Tickets Table */}
        {isLoading ? (
          <div className="text-center py-12 text-text-secondary">Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-bg-surface border border-bg-border rounded-lg">
            <CheckCircle className="w-12 h-12 text-accent-green mx-auto mb-4 opacity-50" />
            <p className="text-text-secondary mb-2">No escalated tickets</p>
            <p className="text-text-muted text-sm">The AI is handling everything!</p>
          </div>
        ) : (
          <div className="bg-bg-surface border border-bg-border rounded-lg overflow-hidden">
            <TicketTable tickets={filteredTickets} />
          </div>
        )}
      </div>
    </AppShell>
  )
}
