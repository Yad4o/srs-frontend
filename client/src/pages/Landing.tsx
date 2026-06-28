/**
 * Landing Page — SRS
 * Dark, editorial, human-written. Not AI-looking.
 */

import { Link, useLocation } from 'wouter'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { ArrowRight, CheckCircle, AlertTriangle, ChevronRight, Activity, Shield, Users, BarChart3, Zap, Database } from 'lucide-react'

// ── Rotating ticker messages ─────────────────────────────────────────────────
const TICKER = [
  'Ticket received. Intent detected in 40ms.',
  'Confidence: 0.87 — response dispatched.',
  'Escalated to agent. No wrong answer sent.',
  'Similar case found. Solution reused.',
  'Auto-resolve rate: 73% this week.',
  'Agent claimed ticket #2841.',
  'Feedback collected. Quality score updated.',
  'Pipeline complete. 190ms end-to-end.',
]

function Ticker() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TICKER.length), 2800)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="overflow-hidden h-5">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="text-xs font-mono"
          style={{ color: '#22c55e' }}
        >
          {TICKER[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

// ── Fade-up reveal ────────────────────────────────────────────────────────────
function R({ children, d = 0, className = '' }: { children: React.ReactNode; d?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: d, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Animated pipeline status ──────────────────────────────────────────────────
const PIPE_STEPS = [
  { id: 'recv',    label: 'Received',   status: 'done',    note: 'login issue · 0.87' },
  { id: 'search',  label: 'Searching',  status: 'done',    note: '3 similar cases' },
  { id: 'decide',  label: 'Decision',   status: 'active',  note: 'threshold met' },
  { id: 'resolve', label: 'Resolved',   status: 'pending', note: 'response queued' },
]

function PipelineCard() {
  const [step, setStep] = useState(0)
  const steps = [...PIPE_STEPS]

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % (steps.length + 1)), 1100)
    return () => clearInterval(t)
  }, [])

  const resolved = step > steps.length - 1

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#1f2d45', background: '#0d1117' }}>
      <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: '#1f2d45' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
          <span className="text-xs font-mono" style={{ color: '#475569' }}>ticket #2847 · processing</span>
        </div>
        <span className="text-xs font-mono" style={{ color: '#475569' }}>190ms</span>
      </div>
      <div className="p-5 space-y-3">
        {steps.map((s, i) => {
          const isDone = i < step
          const isActive = i === step
          return (
            <motion.div
              key={s.id}
              animate={{ opacity: i <= step ? 1 : 0.25 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: isDone ? '#22c55e18' : isActive ? '#3b82f618' : 'transparent',
                  border: `1px solid ${isDone ? '#22c55e' : isActive ? '#3b82f6' : '#1f2d45'}`
                }}
              >
                {isDone
                  ? <CheckCircle className="w-3 h-3" style={{ color: '#22c55e' }} />
                  : <div className="w-1.5 h-1.5 rounded-full" style={{ background: isActive ? '#3b82f6' : '#1f2d45' }} />
                }
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: isDone ? '#f1f5f9' : isActive ? '#f1f5f9' : '#475569' }}>{s.label}</span>
                <span className="text-xs font-mono" style={{ color: isDone ? '#22c55e' : isActive ? '#3b82f6' : '#1f2d45' }}>{s.note}</span>
              </div>
            </motion.div>
          )
        })}
        <motion.div
          animate={{ opacity: resolved ? 1 : 0, y: resolved ? 0 : 6 }}
          transition={{ duration: 0.35 }}
          className="mt-2 px-3 py-2 rounded-lg text-xs font-mono"
          style={{ background: '#22c55e12', border: '1px solid #22c55e33', color: '#22c55e' }}
        >
          ✓ auto_resolved · response dispatched to customer
        </motion.div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Landing() {
  const { isAuthenticated } = useAuth()
  const [, navigate] = useLocation()

  if (isAuthenticated) {
    navigate('/dashboard')
    return null
  }

  const features = [
    { icon: <Zap className="w-4 h-4" />, color: '#3b82f6', title: 'Automated triage', body: 'Every ticket is classified and routed the moment it lands. No queue sits untouched.' },
    { icon: <Database className="w-4 h-4" />, color: '#a855f7', title: 'Solution memory', body: 'Resolved tickets become institutional knowledge. Proven answers get reused, not rewritten.' },
    { icon: <Shield className="w-4 h-4" />, color: '#22c55e', title: 'Confidence gate', body: 'The system only auto-resolves what it is sure about. Everything else goes to a human — always.' },
    { icon: <Users className="w-4 h-4" />, color: '#f59e0b', title: 'Agent focus', body: 'Your team sees only the tickets that need them. No noise from cases the system already handled.' },
    { icon: <BarChart3 className="w-4 h-4" />, color: '#3b82f6', title: 'Live metrics', body: 'Auto-resolve rates, escalation trends, quality scores by category — visible to admins at any time.' },
    { icon: <Activity className="w-4 h-4" />, color: '#22c55e', title: 'Audit trail', body: 'Every routing decision is logged with intent, confidence, and source. Nothing is a black box.' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a', color: '#f1f5f9', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 border-b" style={{ background: '#0a0e1acc', backdropFilter: 'blur(12px)', borderColor: '#1f2d45' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-tight text-base">SRS</span>
            <span className="hidden sm:block text-xs px-2 py-0.5 rounded" style={{ background: '#1f2d45', color: '#94a3b8' }}>Support Resolution System</span>
          </div>
          <div className="flex items-center gap-1">
            <Ticker />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm transition-colors hover:text-white" style={{ color: '#94a3b8' }}>Sign in</Link>
            <Link href="/register">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer"
                style={{ background: '#f1f5f9', color: '#0a0e1a' }}
              >
                Get access
              </motion.span>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #1f2d45 40%, #3b82f622 60%, transparent)' }} />
        <div className="absolute top-32 right-1/4 w-72 h-72 rounded-full pointer-events-none" style={{ background: '#3b82f6', filter: 'blur(120px)', opacity: 0.06 }} />
        <div className="absolute top-52 left-1/3 w-56 h-56 rounded-full pointer-events-none" style={{ background: '#a855f7', filter: 'blur(100px)', opacity: 0.05 }} />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <R d={0}>
              <div className="inline-flex items-center gap-2 mb-6 text-xs" style={{ color: '#475569' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} />
                Automated support routing
              </div>
            </R>
            <R d={0.06}>
              <h1 className="text-5xl lg:text-6xl font-bold leading-[1.05] mb-6" style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}>
                Support that
                <br />
                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>handles itself.</span>
              </h1>
            </R>
            <R d={0.12}>
              <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: '#94a3b8' }}>
                SRS routes incoming support tickets automatically — classifying intent, pulling from resolved history, and deciding what needs a human before anyone picks up the queue.
              </p>
            </R>
            <R d={0.17}>
              <div className="flex items-center gap-3 flex-wrap">
                <Link href="/register">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                    style={{ background: '#f1f5f9', color: '#0a0e1a' }}
                  >
                    Start for free <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
                <Link href="/login">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer border"
                    style={{ borderColor: '#1f2d45', color: '#94a3b8' }}
                  >
                    Sign in
                  </motion.span>
                </Link>
              </div>
            </R>

            <R d={0.22} className="mt-10 pt-8 border-t flex items-center gap-8" style={{ borderColor: '#1a2235' }}>
              {[
                { val: '< 200ms', label: 'per ticket' },
                { val: '0.75', label: 'confidence floor' },
                { val: '4', label: 'response sources' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xl font-bold font-mono" style={{ color: '#f1f5f9' }}>{s.val}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{s.label}</p>
                </div>
              ))}
            </R>
          </div>

          <R d={0.1} className="hidden lg:block">
            <PipelineCard />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border p-4" style={{ borderColor: '#1f2d45', background: '#111827' }}>
                <p className="text-xs mb-1" style={{ color: '#475569' }}>This week</p>
                <p className="text-2xl font-bold font-mono" style={{ color: '#22c55e' }}>73%</p>
                <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>auto-resolved</p>
              </div>
              <div className="rounded-xl border p-4" style={{ borderColor: '#1f2d45', background: '#111827' }}>
                <p className="text-xs mb-1" style={{ color: '#475569' }}>Escalated</p>
                <p className="text-2xl font-bold font-mono" style={{ color: '#f59e0b' }}>27%</p>
                <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>to human agents</p>
              </div>
            </div>
          </R>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #1f2d45, transparent)' }} />
      </div>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <R className="mb-14">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Process</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              What happens when a ticket arrives
            </h2>
          </R>
          <div className="grid md:grid-cols-4 gap-px" style={{ background: '#1f2d45' }}>
            {[
              { n: '01', title: 'Classify', body: 'The message is read and matched against a set of support categories. Each match returns a confidence score.' },
              { n: '02', title: 'Search', body: 'Past resolved tickets are searched using TF-IDF cosine similarity. If a proven solution exists, it surfaces first.' },
              { n: '03', title: 'Decide', body: 'If confidence clears the threshold, the ticket is auto-resolved. Below it, the ticket goes to an agent without exception.' },
              { n: '04', title: 'Improve', body: 'Customer feedback on each response feeds back into quality scoring. The system gets incrementally more accurate over time.' },
            ].map((s, i) => (
              <R key={s.n} d={i * 0.07}>
                <div className="p-6 h-full" style={{ background: '#0a0e1a' }}>
                  <p className="text-xs font-mono mb-4" style={{ color: '#3b82f6' }}>{s.n}</p>
                  <h3 className="font-semibold mb-2 text-sm">{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{s.body}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6" style={{ background: '#0d1117' }}>
        <div className="max-w-6xl mx-auto">
          <R className="mb-14">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Built-in</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              What you get out of the box
            </h2>
          </R>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <R key={f.title} d={i * 0.05}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  className="p-5 rounded-xl border h-full"
                  style={{ borderColor: '#1f2d45', background: '#111827' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: `${f.color}15`, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{f.body}</p>
                </motion.div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <R className="mb-14">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Roles</p>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Designed for three kinds of people
            </h2>
          </R>
          <div className="grid md:grid-cols-3 gap-px" style={{ background: '#1f2d45' }}>
            {[
              {
                label: 'Customer',
                color: '#3b82f6',
                body: 'Submit a ticket. Get a response — automated if the system is confident, or from a real agent if not. No waiting without updates.',
                points: ['Ticket tracking', 'Response history', 'Rate each response'],
              },
              {
                label: 'Support Agent',
                color: '#22c55e',
                body: 'Your queue only holds tickets the system escalated. Everything routine was already handled before it reached you.',
                points: ['Escalated queue only', 'One-click claim', 'Close and log'],
              },
              {
                label: 'Administrator',
                color: '#a855f7',
                body: 'See how the system is performing across the board. Auto-resolve rates, agent load, quality trends — all in one view.',
                points: ['Live metrics', 'All-ticket access', 'Quality by category'],
              },
            ].map((r, i) => (
              <R key={r.label} d={i * 0.08}>
                <div className="p-7 h-full" style={{ background: '#0a0e1a' }}>
                  <div className="text-xs font-mono font-semibold mb-4" style={{ color: r.color }}>{r.label}</div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#94a3b8' }}>{r.body}</p>
                  <ul className="space-y-2">
                    {r.points.map(p => (
                      <li key={p} className="flex items-center gap-2 text-xs" style={{ color: '#f1f5f9' }}>
                        <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: r.color }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t" style={{ borderColor: '#1f2d45' }}>
        <div className="max-w-2xl mx-auto text-center">
          <R>
            <h2 className="text-3xl md:text-4xl font-bold mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Your support queue is waiting.
            </h2>
            <p className="mb-8 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              Set up takes under five minutes. Connect your team, and the system starts routing from the first ticket.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/register">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer"
                  style={{ background: '#f1f5f9', color: '#0a0e1a' }}
                >
                  Get started <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
              <a href="https://github.com/yad4o/SRS" target="_blank" rel="noopener noreferrer">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium cursor-pointer border"
                  style={{ borderColor: '#1f2d45', color: '#94a3b8' }}
                >
                  View on GitHub
                </motion.span>
              </a>
            </div>
          </R>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-7 px-6 border-t" style={{ borderColor: '#1a2235' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: '#475569' }}>
          <span>SRS · Support Resolution System · MIT License</span>
          <span>Built by Om Yadav & Prajwal</span>
        </div>
      </footer>
    </div>
  )
}
