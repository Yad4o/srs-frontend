/**
 * Ticket View Page - Detailed ticket information
 */

import { useParams, useLocation } from 'wouter'
import { useTicket, useAssignTicket, useCloseTicket, useAcceptTicket } from '@/hooks/useTickets'
import { useFeedback } from '@/hooks/useFeedback'
import { useAuth } from '@/hooks/useAuth'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { ConfidenceBar } from '@/components/ui/ConfidenceBar'
import { IntentBadge } from '@/components/ui/IntentBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ResponseSourceTag } from '@/components/ui/ResponseSourceTag'
import { FeedbackForm } from '@/components/tickets/FeedbackForm'
import { StarRating } from '@/components/ui/StarRating'
import { formatDate, formatRelativeTime, formatQualityScore } from '@/utils/formatters'
import { toast } from 'sonner'
import { ArrowLeft, Clock } from 'lucide-react'

export default function TicketView() {
  const { id } = useParams<{ id: string }>()
  const [, navigate] = useLocation()
  const ticketId = parseInt(id || '0')

  const { data: ticket, isLoading } = useTicket(ticketId)
  const { data: feedback } = useFeedback(ticketId)
  const { user } = useAuth()
  const { mutate: assignTicket } = useAssignTicket()
  const { mutate: closeTicket } = useCloseTicket()
  const { mutate: acceptTicket } = useAcceptTicket()

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-8">Loading...</div>
      </AppShell>
    )
  }

  if (!ticket) {
    return (
      <AppShell>
        <div className="p-8">
          <p className="text-text-secondary">Ticket not found</p>
          <Button onClick={() => navigate('/tickets')} className="mt-4">
            Back to Tickets
          </Button>
        </div>
      </AppShell>
    )
  }

  const handleAssign = () => {
    assignTicket(ticketId, {
      onSuccess: () => {
        toast.success(`Ticket #${ticketId} assigned to you`)
      },
      onError: () => {
        toast.error('Failed to assign ticket')
      },
    })
  }

  const handleClose = () => {
    closeTicket(ticketId, {
      onSuccess: () => {
        toast.success('Ticket closed')
      },
      onError: () => {
        toast.error('Failed to close ticket')
      },
    })
  }

  const handleAccept = () => {
    acceptTicket(ticketId, {
      onSuccess: () => {
        toast.success(`Ticket #${ticketId} accepted successfully`)
      },
      onError: () => {
        toast.error('Failed to accept ticket')
      },
    })
  }

  return (
    <AppShell>
      <div className="p-8">
        <button
          onClick={() => navigate('/tickets')}
          className="flex items-center gap-2 text-accent-blue hover:text-accent-green transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </button>

        <PageHeader
          title={`Ticket #${ticket.id}`}
          description={formatDate(ticket.created_at)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Message */}
            <div className="bg-bg-surface border border-bg-border rounded-lg p-6">
              <h3 className="text-sm font-medium text-text-secondary mb-3">Message</h3>
              <p className="text-text-primary leading-relaxed">{ticket.message}</p>
            </div>

            {/* AI Analysis */}
            <div className="bg-bg-surface border border-bg-border rounded-lg p-6 space-y-4">
              <h3 className="text-sm font-medium text-text-secondary">AI Analysis</h3>

              <div>
                <p className="text-xs text-text-muted mb-2">Intent Classification</p>
                <IntentBadge intent={ticket.intent} subIntent={ticket.sub_intent} />
              </div>

              {ticket.confidence !== null && (
                <div>
                  <p className="text-xs text-text-muted mb-2">Confidence Score</p>
                  <ConfidenceBar value={ticket.confidence} showLabel={true} />
                </div>
              )}

              {ticket.response_source && (
                <div>
                  <p className="text-xs text-text-muted mb-2">Response Source</p>
                  <ResponseSourceTag source={ticket.response_source} />
                </div>
              )}
            </div>

            {/* Response */}
            {ticket.response && (
              <div className="bg-bg-surface border border-accent-green border-opacity-20 rounded-lg p-6">
                <h3 className="text-sm font-medium text-text-secondary mb-3">Response</h3>
                <p className="text-text-primary leading-relaxed">{ticket.response}</p>
              </div>
            )}

            {/* Feedback */}
            {ticket.status === 'auto_resolved' && (
              <div className="bg-bg-surface border border-bg-border rounded-lg p-6">
                <h3 className="text-sm font-medium text-text-secondary mb-4">Feedback</h3>
                {feedback ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-text-muted mb-2">Your Rating</p>
                      <StarRating value={feedback.rating} readOnly />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">
                        {feedback.resolved ? '✓ This resolved your issue' : '✗ This did not resolve your issue'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <FeedbackForm ticketId={ticketId} />
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-bg-surface border border-bg-border rounded-lg p-6">
              <h3 className="text-sm font-medium text-text-secondary mb-3">Status</h3>
              <StatusBadge status={ticket.status} />
            </div>

            {/* Metadata */}
            <div className="bg-bg-surface border border-bg-border rounded-lg p-6 space-y-3">
              <h3 className="text-sm font-medium text-text-secondary mb-3">Details</h3>

              <div>
                <p className="text-xs text-text-muted">Ticket ID</p>
                <p className="font-mono text-sm text-text-primary">#{ticket.id}</p>
              </div>

              <div>
                <p className="text-xs text-text-muted">Created</p>
                <p className="text-sm text-text-primary">{formatRelativeTime(ticket.created_at)}</p>
              </div>

              {ticket.assigned_agent_id && (
                <div>
                  <p className="text-xs text-text-muted">Assigned Agent</p>
                  <p className="text-sm text-text-primary">Agent #{ticket.assigned_agent_id}</p>
                </div>
              )}

              {ticket.quality_score !== null && (
                <div>
                  <p className="text-xs text-text-muted">Quality Score</p>
                  <p className="text-sm text-text-primary">{formatQualityScore(ticket.quality_score)}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            {(user?.role === 'agent' || user?.role === 'admin') && ticket.status === 'escalated' && (
              <div className="bg-bg-surface border border-bg-border rounded-lg p-6 space-y-3">
                <h3 className="text-sm font-medium text-text-secondary mb-3">Actions</h3>
                {!ticket.assigned_agent_id && (
                  <Button onClick={handleAssign} className="w-full">
                    Assign to Me
                  </Button>
                )}
                {ticket.assigned_agent_id === user?.id && (
                  <Button onClick={handleAccept} className="w-full">
                    Accept Ticket
                  </Button>
                )}
                <Button onClick={handleClose} variant="outline" className="w-full">
                  Close Ticket
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
