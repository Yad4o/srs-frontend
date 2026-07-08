/**
 * Submit Ticket Page - Main user-facing feature for creating tickets
 */

import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Search,
  Brain,
  Send,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import { ticketSchema, type TicketInput } from '@/utils/validators'
import { useCreateTicket } from '@/hooks/useTickets'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { ConfidenceBar } from '@/components/ui/ConfidenceBar'
import { IntentBadge } from '@/components/ui/IntentBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ResponseSourceTag } from '@/components/ui/ResponseSourceTag'
import { FeedbackForm } from '@/components/tickets/FeedbackForm'
import { toast } from 'sonner'
import type { Ticket } from '@/types'

const PIPELINE_PREVIEW = [
  { icon: Brain, label: 'Classify intent', description: 'We read your message and identify what kind of issue this is.' },
  { icon: Search, label: 'Search similar cases', description: 'We check whether a past ticket already solved this exact problem.' },
  { icon: Sparkles, label: 'Resolve or route', description: 'You get an instant answer, or it goes to an agent if it needs a human.' },
]

const TIPS = [
  'Mention what you were trying to do, and what happened instead.',
  'Include exact error text if you saw any — it speeds up matching.',
  'One issue per ticket gets a faster, more accurate answer.',
]

export default function SubmitTicket() {
  const [, navigate] = useLocation()
  const { mutate: createTicket, isPending } = useCreateTicket()
  const [stage, setStage] = useState<'form' | 'processing' | 'result'>('form')
  const [result, setResult] = useState<Ticket | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TicketInput>({
    resolver: zodResolver(ticketSchema),
  })

  const { ref: messageRef, ...messageField } = register('message')
  const message = watch('message', '')
  const charCount = message.length
  const minChars = 10
  const maxChars = 5000
  const progress = Math.min(100, Math.round((charCount / minChars) * 100))
  const isReady = charCount >= minChars

  // Auto-grow the textarea as the user types
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 420)}px`
  }, [message])

  // Step through the pipeline preview while "processing"
  useEffect(() => {
    if (stage !== 'processing') {
      setActiveStep(0)
      return
    }
    const timers = PIPELINE_PREVIEW.map((_, i) =>
      setTimeout(() => setActiveStep(i + 1), 550 * (i + 1))
    )
    return () => timers.forEach(clearTimeout)
  }, [stage])

  const onSubmit = async (data: TicketInput) => {
    setStage('processing')

    createTicket(data.message, {
      onSuccess: (response) => {
        setResult(response.data)
        setTimeout(() => setStage('result'), 550 * PIPELINE_PREVIEW.length + 250)
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
            title="Processing your request"
            description="Our AI is reading your ticket and looking for the fastest resolution"
            image="/images/encrypted.jpg"
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-8"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  'radial-gradient(600px circle at 20% 0%, color-mix(in srgb, var(--accent-blue) 12%, transparent), transparent 60%)',
              }}
            />
            <div className="relative space-y-6">
              {PIPELINE_PREVIEW.map((step, index) => {
                const Icon = step.icon
                const isDone = index < activeStep
                const isActive = index === activeStep
                return (
                  <div key={step.label} className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-300 ${
                        isDone
                          ? 'bg-accent-green/15 border-accent-green/40 text-accent-green'
                          : isActive
                          ? 'bg-accent-blue/15 border-accent-blue/40 text-accent-blue'
                          : 'bg-bg-raised border-bg-border text-text-muted'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="pt-1.5">
                      <p
                        className={`text-sm font-medium transition-colors duration-300 ${
                          isDone || isActive ? 'text-text-primary' : 'text-text-muted'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  if (stage === 'result' && result) {
    return (
      <AppShell>
        <div className="p-8 max-w-2xl mx-auto">
          <PageHeader
            title="Ticket submitted"
            description={`Ticket #${result.id} has been created`}
            image="/images/audit.jpg"
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {/* Result Card */}
            <div className="bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent-green/15 border border-accent-green/30 flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-accent-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display text-text-primary mb-1">Your message</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{result.message}</p>
                  </div>
                </div>
                <StatusBadge status={result.status} />
              </div>

              <div className="border-t border-bg-border pt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-blue" />
                    AI analysis
                  </h4>
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
                    <div className="p-3 bg-bg-raised rounded border border-bg-border text-text-primary text-sm leading-relaxed">
                      {result.response}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Feedback Form - only for auto-resolved */}
            {result.status === 'auto_resolved' && (
              <div className="bg-bg-surface/70 backdrop-blur-xl border border-accent-green/30 rounded-xl p-6 shadow-[0_0_30px_-12px_var(--accent-green)]">
                <h3 className="text-lg font-display text-text-primary mb-4">Help us improve</h3>
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
              <div className="flex items-start gap-3 bg-amber-500/10 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4">
                <Clock className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <p className="text-amber-300 text-sm leading-relaxed">
                  This ticket has been escalated to our support team. An agent will review it and reach out to resolve your issue.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={() => navigate('/tickets')} variant="outline">
                View my tickets
              </Button>
              <Button onClick={() => setStage('form')}>
                Submit another ticket
              </Button>
            </div>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="p-8 max-w-5xl mx-auto">
        <PageHeader
          title="Submit a support ticket"
          description="Describe your issue in your own words — our AI reads it, checks past cases, and answers instantly when it can"
          image="/images/isolated.jpg"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Main form card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-6 space-y-5"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  'radial-gradient(500px circle at 100% 0%, color-mix(in srgb, var(--accent-blue) 10%, transparent), transparent 60%)',
              }}
            />

            <div className="relative">
              <label htmlFor="ticket-message" className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                <Sparkles className="w-4 h-4 text-accent-blue" />
                Describe your issue
              </label>

              <div
                className={`relative rounded-xl border transition-colors duration-200 ${
                  errors.message
                    ? 'border-accent-red/60'
                    : 'border-bg-border/70 focus-within:border-accent-blue'
                }`}
                style={{
                  boxShadow: 'none',
                }}
              >
                <textarea
                  id="ticket-message"
                  {...messageField}
                  ref={(el) => {
                    messageRef(el)
                    textareaRef.current = el
                  }}
                  placeholder="Tell us what's happening — what were you trying to do, and what went wrong? (minimum 10 characters)"
                  rows={7}
                  maxLength={maxChars}
                  className="w-full px-4 py-3.5 bg-black/20 rounded-xl text-text-primary placeholder-text-muted focus:outline-none resize-none transition-all"
                />
              </div>

              <div className="flex justify-between items-center mt-2.5">
                <div className="min-h-[1rem]">
                  <AnimatePresence mode="wait">
                    {errors.message ? (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-accent-red text-xs"
                      >
                        {errors.message.message}
                      </motion.p>
                    ) : (
                      <span className="text-xs text-text-muted">
                        {isReady ? 'Looks good.' : `${minChars - charCount} more character${minChars - charCount === 1 ? '' : 's'} needed`}
                      </span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 rounded-full bg-bg-border overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: isReady ? 'var(--accent-green)' : 'var(--accent-blue)' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <span className="text-xs text-text-muted font-mono tabular-nums">
                    {charCount} / {maxChars}
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending || !isReady}
              size="lg"
              className="relative w-full group"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit ticket
                  <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>

            <p className="relative flex items-center gap-1.5 text-xs text-text-muted">
              <ShieldCheck className="w-3.5 h-3.5" />
              Your ticket is only visible to you and the support team.
            </p>
          </motion.div>

          {/* Side panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="space-y-4 lg:sticky lg:top-6"
          >
            {/* What happens next */}
            <div className="bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-accent-blue" />
                What happens next
              </h3>
              <div className="space-y-4">
                {PIPELINE_PREVIEW.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.label} className="flex items-start gap-3">
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-7 h-7 rounded-lg bg-bg-raised border border-bg-border flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-text-secondary" />
                        </div>
                        {index < PIPELINE_PREVIEW.length - 1 && (
                          <div className="w-px h-6 bg-bg-border mt-1" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-text-primary">{step.label}</p>
                        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent-amber" />
                Tips for a faster answer
              </h3>
              <ul className="space-y-2.5">
                {TIPS.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed">
                    <span className="text-accent-amber mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </form>
      </div>
    </AppShell>
  )
}
