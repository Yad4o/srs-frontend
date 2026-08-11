/**
 * Try It Page — the free, public entry point.
 *
 * No login, no signup, no ticket history. Type a message, get an
 * instant AI classification and (when confident) a ready answer.
 * This is what /resolve looks like as a page.
 */

import { useState } from 'react'
import { Link } from 'wouter'
import { Sparkles, Loader2, CheckCircle2, Clock, ArrowLeft, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ConfidenceBar } from '@/components/ui/ConfidenceBar'
import { IntentBadge } from '@/components/ui/IntentBadge'
import { ResponseSourceTag } from '@/components/ui/ResponseSourceTag'
import { resolveMessage, type ResolveResult } from '@/api/resolve'
import { toast } from 'sonner'

const EXAMPLES = [
  'How do I reset my password?',
  'I was charged twice for my last order',
  "My app keeps crashing when I try to log in",
]

export default function TryIt() {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ResolveResult | null>(null)

  const canSubmit = message.trim().length > 0 && !isLoading

  const handleSubmit = async () => {
    if (!canSubmit) return
    setIsLoading(true)
    setResult(null)
    try {
      const response = await resolveMessage(message.trim())
      setResult(response.data)
    } catch (error: any) {
      const detail = error.response?.data?.error?.message || error.response?.data?.detail || 'Something went wrong — try again.'
      toast.error(detail)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Minimal header — no sidebar, no login wall */}
      <header className="border-b border-foreground/10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <span className="font-display text-lg tracking-tight">SRS</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-foreground/10 bg-foreground/5 text-xs text-muted-foreground mb-4">
            <Sparkles className="w-3 h-3" />
            Free · No login · Nothing saved
          </div>
          <h1 className="text-3xl md:text-4xl font-display tracking-tight mb-3">
            Try it right now
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Type a support message below and get an instant answer.
            No account needed — this calls the exact same public API
            you can integrate into your own app.
          </p>
        </div>

        <div className="bg-foreground/[0.03] border border-foreground/10 rounded-2xl p-6 space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe an issue, e.g. 'I can't log into my account'..."
            className="min-h-[120px] text-base"
            maxLength={4000}
          />

          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setMessage(example)}
                className="text-xs px-3 py-1.5 rounded-full border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>

          <Button onClick={handleSubmit} disabled={!canSubmit} size="lg" className="w-full rounded-full">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Get instant answer
              </>
            )}
          </Button>
        </div>

        {result && (
          <div className="mt-6 bg-foreground/[0.03] border border-foreground/10 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">Result</h2>
              {result.decision === 'AUTO_RESOLVE' ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Auto-resolved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  Needs a human
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <IntentBadge intent={result.intent} subIntent={result.sub_intent} />
              {result.confidence !== null && (
                <div className="flex-1 min-w-[160px]">
                  <ConfidenceBar value={result.confidence} showLabel size="sm" />
                </div>
              )}
              {result.response_source && <ResponseSourceTag source={result.response_source} />}
            </div>

            {result.response ? (
              <div className="p-4 bg-background/60 rounded-lg border border-foreground/10 text-sm leading-relaxed">
                {result.response}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                This one needs a human touch — in a live deployment it would route to an agent.
              </p>
            )}
          </div>
        )}

        <div className="mt-10 flex items-center gap-2 justify-center text-xs text-muted-foreground">
          <Code2 className="w-3.5 h-3.5" />
          <span>
            Want this in your own app? It's one POST to{' '}
            <code className="px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/80">/resolve</code> — see the{' '}
            <a
              href="https://github.com/Yad4o/SRS#-quickstart--no-login-required"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              quickstart
            </a>
            .
          </span>
        </div>
      </div>
    </main>
  )
}
