/**
 * Dashboard Page - Role-aware home page
 */

import { useAuth } from '@/hooks/useAuth'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Link } from 'wouter'
import { motion } from 'framer-motion'
import {
  Plus, Users, BarChart3, Ticket, PenSquare, LayoutGrid,
  AlertTriangle, ShieldCheck, ArrowUpRight, type LucideIcon,
} from 'lucide-react'

interface FeatureCard {
  href: string
  icon: LucideIcon
  title: string
  description: string
  accent: 'blue' | 'green' | 'amber' | 'purple'
}

const accentMap: Record<FeatureCard['accent'], { text: string; bg: string; border: string; glow: string; grad: string }> = {
  blue: { text: 'text-accent-blue', bg: 'bg-accent-blue/10', border: 'group-hover:border-accent-blue/50', glow: 'group-hover:shadow-[0_0_40px_-12px_var(--accent-blue)]', grad: 'from-accent-blue/20' },
  green: { text: 'text-accent-green', bg: 'bg-accent-green/10', border: 'group-hover:border-accent-green/50', glow: 'group-hover:shadow-[0_0_40px_-12px_var(--accent-green)]', grad: 'from-accent-green/20' },
  amber: { text: 'text-accent-amber', bg: 'bg-accent-amber/10', border: 'group-hover:border-accent-amber/50', glow: 'group-hover:shadow-[0_0_40px_-12px_var(--accent-amber)]', grad: 'from-accent-amber/20' },
  purple: { text: 'text-accent-purple', bg: 'bg-accent-purple/10', border: 'group-hover:border-accent-purple/50', glow: 'group-hover:shadow-[0_0_40px_-12px_var(--accent-purple)]', grad: 'from-accent-purple/20' },
}

function Card({ card, index }: { card: FeatureCard; index: number }) {
  const a = accentMap[card.accent]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={card.href}
        className={`group relative block p-6 rounded-2xl bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${a.border} ${a.glow}`}
      >
        {/* Corner glow wash on hover */}
        <div className={`pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${a.grad} to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className="relative z-10 flex items-start justify-between mb-5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${a.bg}`}>
            <card.icon className={`w-5 h-5 ${a.text}`} />
          </div>
          <ArrowUpRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
        </div>
        <h3 className="relative z-10 font-display text-lg text-text-primary mb-1.5">{card.title}</h3>
        <p className="relative z-10 text-sm text-text-secondary leading-relaxed">{card.description}</p>
      </Link>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  const firstName = user.email?.split('@')[0] || 'User'

  const cardsByRole: Record<string, FeatureCard[]> = {
    user: [
      { href: '/tickets', icon: Ticket, title: 'My Tickets', description: 'View and manage your support tickets', accent: 'green' },
      { href: '/tickets/new', icon: PenSquare, title: 'Submit New Ticket', description: 'Create a new support request', accent: 'blue' },
    ],
    agent: [
      { href: '/queue', icon: Users, title: 'Escalation Queue', description: 'View tickets needing human attention', accent: 'amber' },
    ],
    admin: [
      { href: '/admin', icon: BarChart3, title: 'Metrics Dashboard', description: 'View system performance and health', accent: 'blue' },
      { href: '/queue', icon: Users, title: 'Agent Queue', description: 'Monitor escalated tickets', accent: 'amber' },
      { href: '/admin/tickets', icon: LayoutGrid, title: 'All Tickets', description: 'Browse entire ticket database', accent: 'green' },
      { href: '/admin/escalations', icon: AlertTriangle, title: 'Escalations', description: 'Assign escalated tickets to agents', accent: 'amber' },
      { href: '/admin/users', icon: ShieldCheck, title: 'Users', description: 'Manage accounts and reset passwords', accent: 'purple' },
    ],
  }

  const cards = cardsByRole[user.role] || []

  const stripByRole: Record<string, { value: string; label: string }[]> = {
    user: [
      { value: '24/7', label: 'AI triage availability' },
      { value: '<2min', label: 'avg first response' },
      { value: '100%', label: 'escalation safety net' },
    ],
    agent: [
      { value: '0.75', label: 'auto-resolve confidence gate' },
      { value: '7', label: 'intent categories classified' },
      { value: '100%', label: 'safe-fallback to humans' },
    ],
    admin: [
      { value: '7', label: 'intent categories classified' },
      { value: '0.75', label: 'auto-resolve confidence gate' },
      { value: '100%', label: 'safe-fallback to humans' },
    ],
  }
  const strip = stripByRole[user.role] || stripByRole.user

  return (
    <AppShell>
      <div className="p-8 max-w-[1400px]">
        {/* Hero banner — same cinematic language as the landing hero, scaled down */}
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] mb-8 min-h-[280px] flex flex-col justify-end">
          <img
            src="/images/bridge.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/75 to-bg-base/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-base/70 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-20">
            {[...Array(6)].map((_, i) => (
              <div key={`v-${i}`} className="absolute w-px bg-white/20 top-0 bottom-0" style={{ left: `${16.6 * (i + 1)}%` }} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 p-8 w-full"
          >
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/60 mb-3">
                  <span className="w-6 h-px bg-white/40" />
                  {user.role} access
                </span>
                <h1 className="text-4xl md:text-5xl font-display text-white tracking-tight leading-[0.95]">
                  Welcome, {firstName}
                </h1>
              </div>
              {user.role === 'user' && (
                <Link href="/tickets/new">
                  <Button className="shadow-[0_0_28px_-8px_var(--accent-blue)]">
                    <Plus className="w-4 h-4 mr-2" />
                    New Ticket
                  </Button>
                </Link>
              )}
            </div>

            {/* Stat strip — same treatment as the landing hero's stats row */}
            <div className="flex items-start gap-8 sm:gap-12 flex-wrap">
              {strip.map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-display text-white">{s.value}</span>
                  <span className="text-xs text-white/50 leading-tight max-w-[10rem]">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Role-specific content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <Card key={card.href + card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
