/**
 * Landing Page - Enhanced marketing page with 3D visuals and full SRS content
 */

import { Link, useLocation } from 'wouter'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight, Zap, Brain, Shield, BarChart3, Users, GitBranch,
  CheckCircle, AlertTriangle, Clock, ChevronRight, Terminal,
  Lock, RefreshCw, Layers, Activity, Database, Code2
} from 'lucide-react'

// ─── Design tokens (mirrors index.css) ─────────────────────────────────────
const C = {
  base: '#0a0e1a',
  surface: '#111827',
  raised: '#1a2235',
  border: '#1f2d45',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#a855f7',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#475569',
}

// ─── Fade-up reveal wrapper ─────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Floating 3-D card ──────────────────────────────────────────────────────
function Card3D({ children, className = '', glowColor = C.blue }: { children: React.ReactNode; className?: string; glowColor?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setRot({ x: (e.clientY - cy) / 18, y: -(e.clientX - cx) / 18 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setRot({ x: 0, y: 0 }) }}
      animate={{ rotateX: rot.x, rotateY: rot.y, scale: hovered ? 1.03 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      style={{
        transformStyle: 'preserve-3d',
        boxShadow: hovered ? `0 20px 60px -10px ${glowColor}44, 0 0 0 1px ${glowColor}33` : `0 4px 24px -4px #00000066`,
      }}
      className={`rounded-xl border border-[#1f2d45] bg-[#111827] ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ─── Animated pipeline diagram ──────────────────────────────────────────────
function PipelineDiagram() {
  const steps = [
    { label: 'Ticket In', color: C.blue, icon: '📝', detail: 'User submits message' },
    { label: 'Classify', color: C.purple, icon: '🧠', detail: 'Intent + confidence' },
    { label: 'Search', color: C.amber, icon: '🔍', detail: 'TF-IDF similarity' },
    { label: 'Decide', color: C.green, icon: '⚖️', detail: 'conf ≥ 0.75?' },
  ]

  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % (steps.length + 2))
    }, 900)
    return () => clearInterval(interval)
  }, [])

  const showAutoResolve = activeStep >= steps.length
  const showEscalate = activeStep >= steps.length + 1

  return (
    <div className="relative py-8 px-4" style={{ perspective: '800px' }}>
      {/* Steps row */}
      <div className="flex items-center justify-between gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2 flex-1">
            <motion.div
              animate={{
                scale: activeStep === i ? 1.15 : 1,
                boxShadow: activeStep === i ? `0 0 24px ${s.color}66` : 'none',
                borderColor: i <= activeStep ? s.color : C.border,
              }}
              transition={{ duration: 0.3 }}
              className="flex-1 rounded-lg border bg-[#1a2235] p-3 text-center cursor-default"
              style={{ borderColor: i <= activeStep ? s.color : C.border }}
            >
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-xs font-semibold" style={{ color: i <= activeStep ? s.color : C.textMuted }}>{s.label}</div>
              <div className="text-xs mt-0.5" style={{ color: C.textMuted }}>{s.detail}</div>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                animate={{ opacity: i < activeStep ? 1 : 0.15, scaleX: i < activeStep ? 1 : 0.4 }}
                className="w-5 h-0.5 flex-shrink-0"
                style={{ backgroundColor: steps[i + 1].color, originX: 0 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Branch output */}
      <div className="flex gap-4 justify-center">
        <motion.div
          animate={{ opacity: showAutoResolve ? 1 : 0.15, y: showAutoResolve ? 0 : 8, scale: showAutoResolve ? 1 : 0.96 }}
          transition={{ duration: 0.35 }}
          className="flex-1 rounded-lg border p-3 text-center"
          style={{ borderColor: C.green, background: `${C.green}11` }}
        >
          <CheckCircle className="w-5 h-5 mx-auto mb-1" style={{ color: C.green }} />
          <div className="text-xs font-bold" style={{ color: C.green }}>AUTO_RESOLVED</div>
          <div className="text-xs mt-0.5" style={{ color: C.textMuted }}>Response generated</div>
        </motion.div>
        <motion.div
          animate={{ opacity: showEscalate ? 1 : 0.15, y: showEscalate ? 0 : 8, scale: showEscalate ? 1 : 0.96 }}
          transition={{ duration: 0.35 }}
          className="flex-1 rounded-lg border p-3 text-center"
          style={{ borderColor: C.amber, background: `${C.amber}11` }}
        >
          <AlertTriangle className="w-5 h-5 mx-auto mb-1" style={{ color: C.amber }} />
          <div className="text-xs font-bold" style={{ color: C.amber }}>ESCALATED</div>
          <div className="text-xs mt-0.5" style={{ color: C.textMuted }}>Human agent assigned</div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Ticket demo terminal ────────────────────────────────────────────────────
function TerminalDemo() {
  const lines = [
    { t: 0,   text: '$ POST /tickets/',                          color: C.textMuted },
    { t: 600, text: '  {"message": "I forgot my password"}',     color: C.textSecondary },
    { t: 1300, text: '',                                          color: '' },
    { t: 1400, text: '  intent: "login_issue"',                  color: C.blue },
    { t: 1800, text: '  sub_intent: "password_reset"',           color: C.blue },
    { t: 2200, text: '  confidence: 0.85',                       color: C.green },
    { t: 2600, text: '  status: "auto_resolved"',                color: C.green },
    { t: 3000, text: '  source: "similarity"',                   color: C.amber },
    { t: 3500, text: '  response: "Click Forgot Password..."',   color: C.textPrimary },
  ]

  const [visible, setVisible] = useState<number[]>([])
  const [running, setRunning] = useState(false)

  const run = () => {
    if (running) return
    setRunning(true)
    setVisible([])
    lines.forEach((l, i) => {
      setTimeout(() => {
        setVisible(prev => [...prev, i])
        if (i === lines.length - 1) setTimeout(() => setRunning(false), 1000)
      }, l.t)
    })
  }

  return (
    <div
      className="rounded-xl border overflow-hidden font-mono text-xs"
      style={{ borderColor: C.border, background: C.base }}
    >
      {/* title bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: C.border, background: C.surface }}>
        <div className="w-3 h-3 rounded-full" style={{ background: C.red }} />
        <div className="w-3 h-3 rounded-full" style={{ background: C.amber }} />
        <div className="w-3 h-3 rounded-full" style={{ background: C.green }} />
        <span className="ml-2 text-xs" style={{ color: C.textMuted }}>srs api demo</span>
        <button
          onClick={run}
          className="ml-auto flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors hover:bg-[#1a2235]"
          style={{ color: running ? C.textMuted : C.green }}
        >
          <Terminal className="w-3 h-3" />
          {running ? 'running…' : 'run'}
        </button>
      </div>
      {/* output */}
      <div className="p-4 space-y-0.5 min-h-48">
        {visible.length === 0 && (
          <p style={{ color: C.textMuted }}>Click run to see the AI pipeline →</p>
        )}
        {lines.map((l, i) =>
          visible.includes(i) ? (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              style={{ color: l.color || 'transparent' }}
            >
              {l.text || '\u00a0'}
            </motion.p>
          ) : null
        )}
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function Landing() {
  const { isAuthenticated } = useAuth()
  const [, navigate] = useLocation()

  if (isAuthenticated) {
    navigate('/dashboard')
    return null
  }

  const intents = [
    { name: 'Login Issue', conf: '0.85', color: C.blue, subs: ['Password Reset', 'Account Locked', 'Two-Factor Auth'] },
    { name: 'Payment Issue', conf: '0.90', color: C.amber, subs: ['Duplicate Charge', 'Payment Declined', 'Billing Query'] },
    { name: 'Account Issue', conf: '0.80', color: C.purple, subs: ['Delete Account', 'Update Profile', 'Personal Data'] },
    { name: 'Technical Issue', conf: '0.75', color: C.red, subs: ['Crash / Error', 'Performance', 'Server Down'] },
    { name: 'Feature Request', conf: '0.80', color: C.green, subs: ['New Feature', 'Enhancement', 'Improvement'] },
    { name: 'General Query', conf: '0.70', color: C.textSecondary, subs: ['How-to', 'Pricing', 'Information'] },
    { name: 'Shipping Issue', conf: '0.85', color: '#f97316', subs: ['Order Missing', 'Tracking', 'Delivery'] },
  ]

  const features = [
    { icon: <Brain className="w-5 h-5" />, color: C.purple, title: 'Intent Classification', desc: '7 categories, sub-intent detection, boundary-aware keyword matching across 80+ signal terms per intent.' },
    { icon: <Layers className="w-5 h-5" />, color: C.blue, title: 'Similarity Search', desc: 'TF-IDF cosine similarity against every resolved ticket. Redis-cached for sub-100ms lookup.' },
    { icon: <Zap className="w-5 h-5" />, color: C.amber, title: 'Auto-Resolution', desc: '4 response sources: proven past solutions → GPT-4o-mini → template → fallback. Never blank.' },
    { icon: <Shield className="w-5 h-5" />, color: C.green, title: 'Safety-First Decisions', desc: 'Confidence gate at 0.75. Anything ambiguous auto-escalates. AI failures silently escalate too.' },
    { icon: <Users className="w-5 h-5" />, color: C.blue, title: 'Role-Based Access', desc: 'Three-tier RBAC: customers, support agents, admins. Atomic ticket assignment with no race conditions.' },
    { icon: <BarChart3 className="w-5 h-5" />, color: C.amber, title: 'Admin Metrics', desc: 'Live dashboard: auto-resolve rate, escalation breakdown, quality scores per intent, agent load.' },
    { icon: <Lock className="w-5 h-5" />, color: C.red, title: 'Secure Auth', desc: 'JWT (HS256) + bcrypt passwords + OTP via email. Rate-limited. Attempt lockout on reset.' },
    { icon: <RefreshCw className="w-5 h-5" />, color: C.green, title: 'Background Workers', desc: 'Auto-archiving, TF-IDF index rebuilding, feedback analysis, system metrics snapshots.' },
  ]

  const roles = [
    { icon: '👤', title: 'Customer', color: C.blue, items: ['Submit tickets', 'View own history', 'Submit feedback', 'Get instant responses'] },
    { icon: '🎧', title: 'Support Agent', color: C.green, items: ['Claim escalated tickets', 'Close tickets', 'No noise from auto-resolved', 'Focus only where needed'] },
    { icon: '👑', title: 'Admin', color: C.purple, items: ['Full system metrics', 'View all tickets', 'Quality by intent', 'Unassigned ticket alerts'] },
  ]

  const stack = [
    { name: 'FastAPI', icon: '⚡', color: C.green },
    { name: 'PostgreSQL', icon: '🐘', color: C.blue },
    { name: 'Redis', icon: '⚡', color: C.red },
    { name: 'OpenAI', icon: '🤖', color: C.purple },
    { name: 'SQLAlchemy', icon: '🗄️', color: C.amber },
    { name: 'Docker', icon: '🐳', color: C.blue },
    { name: 'Alembic', icon: '🔄', color: C.green },
    { name: 'Resend', icon: '📧', color: C.purple },
  ]

  return (
    <div className="min-h-screen text-[#f1f5f9]" style={{ background: C.base, fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b" style={{ background: `${C.base}cc`, borderColor: C.border }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `${C.blue}22`, border: `1px solid ${C.blue}44`, color: C.blue }}>S</div>
            <span className="font-bold tracking-tight">SRS</span>
            <span className="text-xs px-2 py-0.5 rounded-full ml-1" style={{ background: `${C.green}22`, color: C.green, border: `1px solid ${C.green}33` }}>AI Support</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm transition-colors" style={{ color: C.textSecondary }}>Sign In</Link>
            <Link href="/register">
              <button className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 hover:scale-105" style={{ background: C.blue, color: '#fff' }}>
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: C.blue }} />
          <div className="absolute top-40 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8" style={{ background: C.purple }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6 border" style={{ background: `${C.blue}11`, borderColor: `${C.blue}33`, color: C.textSecondary }}>
              <Activity className="w-3 h-3" style={{ color: C.green }} />
              <span>Confidence-gated AI • No wrong auto-responses</span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.02em' }}>
              Stop answering the
              <br />
              <span style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                same tickets
              </span>
              {' '}manually.
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: C.textSecondary }}>
              SRS classifies your support tickets, searches past solutions, and auto-resolves the ones it's confident about — escalating everything else to a human.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: C.blue, color: '#fff' }}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-colors"
                  style={{ borderColor: C.border, color: C.textSecondary }}
                >
                  View Demo
                </motion.button>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Hero pipeline visual */}
        <Reveal delay={0.26} className="max-w-3xl mx-auto mt-16">
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: C.border, background: C.surface }}>
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: C.border, background: C.raised }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: C.green }} />
              <span className="text-xs font-mono" style={{ color: C.textMuted }}>AI Pipeline — Live Preview</span>
            </div>
            <PipelineDiagram />
          </div>
        </Reveal>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 px-6 border-y" style={{ borderColor: C.border }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '< 200ms', label: 'Pipeline latency', color: C.green },
            { value: '0.75', label: 'Confidence threshold', color: C.blue },
            { value: '7', label: 'Intent categories', color: C.amber },
            { value: '4', label: 'Response sources', color: C.purple },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07} className="text-center">
              <p className="text-3xl font-bold font-mono mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm" style={{ color: C.textMuted }}>{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.blue }}>The Pipeline</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              A full AI pipeline on every ticket
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {[
                { step: '01', title: 'Classify Intent', color: C.blue, desc: 'The message is analyzed across 7 intent categories and dozens of sub-intents. Each match returns a confidence score between 0 and 1.' },
                { step: '02', title: 'Search Past Solutions', color: C.purple, desc: 'TF-IDF cosine similarity finds the closest resolved ticket. If a proven solution exists with quality score ≥ 0.6, it gets reused directly.' },
                { step: '03', title: 'Decide', color: C.amber, desc: 'Confidence ≥ 0.75 → auto-resolve with a generated response. Below that threshold, it escalates. AI failure also always escalates — never crashes.' },
                { step: '04', title: 'Learn from Feedback', color: C.green, desc: 'Users rate responses. Quality scores per intent update over time, improving the similarity engine and routing decisions.' },
              ].map((item, i) => (
                <Reveal key={item.step} delay={i * 0.08}>
                  <Card3D glowColor={item.color} className="p-5">
                    <div className="flex gap-4">
                      <span className="text-sm font-mono font-bold flex-shrink-0 mt-0.5" style={{ color: item.color }}>{item.step}</span>
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{item.desc}</p>
                      </div>
                    </div>
                  </Card3D>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1} className="sticky top-24">
              <TerminalDemo />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-24 px-6" style={{ background: C.surface }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.purple }}>Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Everything a support backend needs
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <Card3D glowColor={f.color} className="p-5 h-full">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${f.color}18`, color: f.color }}>
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: C.textSecondary }}>{f.desc}</p>
                </Card3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTENT CATEGORIES ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.amber }}>Classification</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              7 intent categories, out of the box
            </h2>
            <p className="mt-4 text-sm" style={{ color: C.textMuted }}>Each category resolves to sub-intents for precise response routing</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {intents.map((intent, i) => (
              <Reveal key={intent.name} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="rounded-xl border p-4 cursor-default"
                  style={{ borderColor: `${intent.color}33`, background: `${intent.color}08` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">{intent.name}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: `${intent.color}22`, color: intent.color }}>
                      {intent.conf}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {intent.subs.map(sub => (
                      <div key={sub} className="flex items-center gap-1.5 text-xs" style={{ color: C.textMuted }}>
                        <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: intent.color }} />
                        {sub}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section className="py-24 px-6" style={{ background: C.surface }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.green }}>Access Control</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              One system, three roles
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role, i) => (
              <Reveal key={role.title} delay={i * 0.1}>
                <Card3D glowColor={role.color} className="p-6 h-full">
                  <div className="text-3xl mb-3">{role.icon}</div>
                  <h3 className="font-bold text-lg mb-4" style={{ color: role.color }}>{role.title}</h3>
                  <ul className="space-y-2">
                    {role.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm" style={{ color: C.textSecondary }}>
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: role.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.blue }}>Stack</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Built on a solid production stack
            </h2>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-3">
            {stack.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.04}>
                <motion.div
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium cursor-default"
                  style={{ borderColor: `${s.color}33`, background: `${s.color}0d`, color: C.textSecondary }}
                >
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Architecture diagram */}
          <Reveal delay={0.2} className="mt-14">
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
              <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: C.border, background: C.surface }}>
                <Code2 className="w-3.5 h-3.5" style={{ color: C.textMuted }} />
                <span className="text-xs font-mono" style={{ color: C.textMuted }}>Architecture</span>
              </div>
              <div className="p-6 font-mono text-xs space-y-1 overflow-x-auto" style={{ background: C.base }}>
                {[
                  { text: 'Client (React / TypeScript / Vercel)', indent: 0, color: C.textSecondary },
                  { text: '│', indent: 0, color: C.border },
                  { text: '▼', indent: 0, color: C.textMuted },
                  { text: 'FastAPI  ─  Auth (JWT + bcrypt)  ─  RBAC', indent: 0, color: C.blue },
                  { text: '│                                    │', indent: 0, color: C.border },
                  { text: '▼                                    ▼', indent: 0, color: C.textMuted },
                  { text: 'Service Layer                     SlowAPI', indent: 0, color: C.purple },
                  { text: '  ├─ Classifier (NLP)             Rate Limit', indent: 0, color: C.purple },
                  { text: '  ├─ Similarity Search  ←──────── Redis', indent: 0, color: C.amber },
                  { text: '  ├─ Decision Engine (0.75 gate)', indent: 0, color: C.green },
                  { text: '  └─ Response Generator ←──────── OpenAI', indent: 0, color: C.green },
                  { text: '│', indent: 0, color: C.border },
                  { text: '▼', indent: 0, color: C.textMuted },
                  { text: 'SQLAlchemy ORM  →  PostgreSQL (Neon)  +  Alembic', indent: 0, color: C.blue },
                ].map((line, i) => (
                  <div key={i} style={{ color: line.color, paddingLeft: `${line.indent * 12}px` }}>{line.text}</div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── QUICK START ── */}
      <section className="py-24 px-6" style={{ background: C.surface }}>
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.green }}>Get Running</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Set up in under 5 minutes
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: C.border }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: C.border, background: C.raised }}>
                <span className="text-xs font-mono" style={{ color: C.textMuted }}>bash</span>
              </div>
              <pre className="p-6 text-xs font-mono leading-relaxed overflow-x-auto" style={{ background: C.base, color: C.textSecondary }}>
                <span style={{ color: C.textMuted }}># 1. Clone and install</span>{'\n'}
                <span style={{ color: C.green }}>git clone</span> https://github.com/yad4o/SRS.git{'\n'}
                <span style={{ color: C.green }}>cd</span> SRS && pip install -r requirements.txt{'\n\n'}
                <span style={{ color: C.textMuted }}># 2. Configure</span>{'\n'}
                cp .env.example .env  <span style={{ color: C.textMuted }}># set SECRET_KEY + DATABASE_URL</span>{'\n\n'}
                <span style={{ color: C.textMuted }}># 3. Run</span>{'\n'}
                uvicorn app.main:app --reload{'\n\n'}
                <span style={{ color: C.textMuted }}># Or with Docker</span>{'\n'}
                docker compose up --build
              </pre>
            </div>
          </Reveal>

          <Reveal delay={0.14} className="flex gap-3 justify-center mt-8 flex-wrap">
            <a href="https://github.com/yad4o/SRS" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.04 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-colors"
                style={{ borderColor: C.border, color: C.textSecondary }}
              >
                <Database className="w-4 h-4" /> GitHub Repo
              </motion.button>
            </a>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.04 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: C.green, color: C.base }}
              >
                <Zap className="w-4 h-4" /> Live Demo
              </motion.button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(ellipse at center, ${C.blue}, transparent 70%)` }} />
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Ready to automate your support?
            </h2>
            <p className="mb-8" style={{ color: C.textSecondary }}>
              Get started in minutes. No configuration required for basic use.
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base"
                style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`, color: '#fff' }}
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6 border-t" style={{ borderColor: C.border }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: C.textMuted }}>
          <span>© 2026 SRS — Automated Customer Support Resolution System</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/yad4o/SRS" target="_blank" rel="noopener noreferrer" className="hover:text-[#f1f5f9] transition-colors">GitHub</a>
            <span>·</span>
            <span>Built by Om Yadav & Prajwal</span>
            <span>·</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
