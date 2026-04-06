/**
 * Submit Ticket Page - Main user-facing feature for creating tickets
 */

import { useState } from 'react'
import { useLocation } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ticketSchema, type TicketInput } from '@/utils/validators'
import { useCreateTicket } from '@/hooks/useTickets'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PipelineAnimation } from '@/components/ui/PipelineAnimation'
import { ConfidenceBar } from '@/components/ui/ConfidenceBar'
import { IntentBadge } from '@/components/ui/IntentBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ResponseSourceTag } from '@/components/ui/ResponseSourceTag'
import { FeedbackForm } from '@/components/tickets/FeedbackForm'
import { toast } from 'sonner'
import type { PipelineStep, Ticket } from '@/types'

export default function SubmitTicket() {
  const [, navigate] = useLocation()
  const { mutate: createTicket, isPending } = useCreateTicket()
  const [stage, setStage] = useState<'form' | 'processing' | 'result'>('form')
  const [result, setResult] = useState<Ticket | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TicketInput>({
    resolver: zodResolver(ticketSchema),
  })

  const message = watch('message', '')
  const charCount = message.length

  const pipelineSteps: PipelineStep[] = [
    { label: 'Classifying intent', duration: 600 },
    { label: 'Searching similar cases', duration: 800 },
    { label: 'Generating response', duration: 500 },
  ]

  const onSubmit = async (data: TicketInput) => {
    setStage('processing')

    createTicket(data.message, {
      onSuccess: (response) => {
        setResult(response.data)
        setStage('result')
        toast.success('Ticket submitted successfully')
      },
      onError: (error: any) => {
        setStage('form')
        const message = error.response?.data?.error?.message || error.response?.data?.detail || 'Failed to submit ticket'
        toast.error(message)
      },
    })
  }

  if (stage === 'processing') {
    return (
      <AppShell>
        <div className="p-8 max-w-2xl mx-auto">
          <PageHeader
            title="Processing Your Request"
            description="Our AI is analyzing your ticket..."
          />

          <div className="bg-bg-surface border border-bg-border rounded-lg p-8">
            <PipelineAnimation steps={pipelineSteps} />
          </div>
        </div>
      </AppShell>
    )
  }

  if (stage === 'result' && result) {
    return (
      <AppShell>
        <div className="p-8 max-w-2xl mx-auto">
          <PageHeader
            title="Ticket Submitted"
            description={`Ticket #${result.id} has been created`}
          />

          <div className="space-y-6">
            {/* Result Card */}
            <div className="bg-bg-surface border border-bg-border rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Your Message</h3>
                  <p className="text-text-secondary">{result.message}</p>
                </div>
                <StatusBadge status={result.status} />
              </div>

              <div className="border-t border-bg-border pt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2">AI Analysis</h4>
                  <div className="space-y-3">
                    <IntentBadge intent={result.intent} subIntent={result.sub_intent} />
                    {result.confidence !== null && (
                      <ConfidenceBar value={result.confidence} showLabel={true} />
                    )}
                    {result.response_source && (
                      <ResponseSourceTag source={result.response_source} />
                    )}
                  </div>
                </div>

                {result.response && (
                  <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2">Response</h4>
                    <div className="p-3 bg-bg-raised rounded border border-bg-border text-text-primary text-sm">
                      {result.response}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Feedback Form - only for auto-resolved */}
            {result.status === 'auto_resolved' && (
              <div className="bg-bg-surface border border-accent-green border-opacity-30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Help Us Improve</h3>
                <FeedbackForm
                  ticketId={result.id}
                  onSuccess={() => {
                    setTimeout(() => navigate('/tickets'), 1500)
                  }}
                />
              </div>
            )}

            {/* Escalation Message */}
            {result.status === 'escalated' && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-amber-300 text-sm">
                  This ticket has been escalated to our support team. You'll be notified when an agent responds.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={() => navigate('/tickets')} variant="outline">
                View My Tickets
              </Button>
              <Button onClick={() => setStage('form')}>
                Submit Another Ticket
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="p-8 max-w-2xl mx-auto">
        <PageHeader
          title="Submit a Support Ticket"
          description="Describe your issue and our AI will help resolve it"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-bg-surface border border-bg-border rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Describe Your Issue
              </label>
              <textarea
                {...register('message')}
                placeholder="Tell us what's happening... (minimum 10 characters)"
                rows={8}
                className="w-full px-4 py-3 bg-bg-raised border border-bg-border rounded text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
              />
              <div className="flex justify-between items-center mt-2">
                <div>
                  {errors.message && (
                    <p className="text-red-400 text-xs">{errors.message.message}</p>
                  )}
                </div>
                <span className="text-xs text-text-muted font-mono">
                  {charCount} / 5000
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending || charCount < 10}
              className="w-full"
            >
              {isPending ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
