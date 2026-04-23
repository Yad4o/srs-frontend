import { useState, useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAdminTickets } from '@/hooks/useTickets'
import { AssignAgentModal } from '@/components/AssignAgentModal'
import { IntentBadge } from '@/components/ui/IntentBadge'
import { Button } from '@/components/ui/button'
import { assignTicketToAgent } from '@/api/admin'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export default function AdminEscalations() {
  const { data, isLoading } = useAdminTickets(1, 100, 'escalated')
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
  
  const queryClient = useQueryClient()

  const unassignedTickets = useMemo(() => {
    return data?.tickets.filter((t) => t.assigned_agent_id === null) || []
  }, [data])

  const handleAssign = async (agentId: number) => {
    if (!selectedTicketId) return
    try {
      await assignTicketToAgent(selectedTicketId, agentId)
      toast.success('Agent assigned successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] })
    } catch (error) {
      console.error(error)
      throw error // Let the modal catch it
    }
  }

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="Escalations Queue"
          description="Assign new escalated tickets to available agents."
        />

        {isLoading ? (
          <div className="text-center py-12 text-text-secondary">Loading tickets...</div>
        ) : unassignedTickets.length === 0 ? (
          <div className="text-center py-12 bg-bg-surface border border-bg-border rounded-lg">
            <p className="text-text-secondary">No unassigned escalated tickets found</p>
          </div>
        ) : (
          <div className="bg-bg-surface border border-bg-border rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-bg-border bg-bg-raised text-sm text-text-secondary">
                  <th className="p-4 font-medium w-24">ID</th>
                  <th className="p-4 font-medium max-w-md">Message Preview</th>
                  <th className="p-4 font-medium">Intent</th>
                  <th className="p-4 font-medium">Created</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-border">
                {unassignedTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-bg-raised/50 transition-colors group">
                    <td className="p-4 text-sm font-medium">#{ticket.id}</td>
                    <td className="p-4 text-sm text-text-primary truncate max-w-md">
                      {ticket.message.length > 80 ? ticket.message.substring(0, 80) + '...' : ticket.message}
                    </td>
                    <td className="p-4">
                      {ticket.intent ? <IntentBadge intent={ticket.intent} /> : <span className="text-sm text-text-muted">Unclassified</span>}
                    </td>
                    <td className="p-4 text-sm text-text-secondary">
                      {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        Assign Agent
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTicketId !== null && (
          <AssignAgentModal
            isOpen={selectedTicketId !== null}
            onClose={() => setSelectedTicketId(null)}
            onConfirm={handleAssign}
          />
        )}
      </div>
    </AppShell>
  )
}
