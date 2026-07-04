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
  AlertTriangle, ShieldCheck, type LucideIcon,
} from 'lucide-react'

interface FeatureCard {
  href: string
  icon: LucideIcon
  title: string
  description: string
  accent: 'blue' | 'green' | 'amber' | 'purple'
}

const accentMap: Record<FeatureCard['accent'], { text: string; bg: string; border: string; glow: string }> = {
  blue: { text: 'text-accent-blue', bg: 'bg-accent-blue/10', border: 'group-hover:border-accent-blue/50', glow: 'group-hover:shadow-[0_0_32px_-10px_var(--accent-blue)]' },
  green: { text: 'text-accent-green', bg: 'bg-accent-green/10', border: 'group-hover:border-accent-green/50', glow: 'group-hover:shadow-[0_0_32px_-10px_var(--accent-green)]' },
  amber: { text: 'text-accent-amber', bg: 'bg-accent-amber/10', border: 'group-hover:border-accent-amber/50', glow: 'group-hover:shadow-[0_0_32px_-10px_var(--accent-amber)]' },
  purple: { text: 'text-accent-purple', bg: 'bg-accent-purple/10', border: 'group-hover:border-accent-purple/50', glow: 'group-hover:shadow-[0_0_32px_-10px_var(--accent-purple)]' },
}

function Card({ card, index }: { card: FeatureCard; index: number }) {
  const a = accentMap[card.accent]
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={card.href}
        className={`group relative block p-6 rounded-xl bg-bg-surface/70 backdrop-blur-xl border border-bg-border/70 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${a.border} ${a.glow}`}
      >
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${a.bg}`}>
          <card.icon className={`w-5 h-5 ${a.text}`} />
        </div>
        <h3 className="font-display text-lg text-text-primary mb-1.5">{card.title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{card.description}</p>
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

  return (
    <AppShell>
      <div className="p-8 max-w-[1400px]">
        {/* Hero banner — same cinematic language as the landing hero, scaled down */}
        <div className="relative rounded-2xl overflow-hidden border border-bg-border/70 mb-8 min-h-[220px] flex items-end">
          <img
            src="/images/bridge.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/70 to-bg-base/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-base/60 via-transparent to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 p-8 w-full flex items-end justify-between flex-wrap gap-4"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-secondary mb-3">
                <span className="w-6 h-px bg-text-secondary/50" />
                {user.role} access
              </span>
              <h1 className="text-3xl md:text-4xl font-display text-text-primary tracking-tight">
                Welcome, {firstName}
              </h1>
            </div>
            {user.role === 'user' && (
              <Link href="/tickets/new">
                <Button className="shadow-[0_0_24px_-8px_var(--accent-blue)]">
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              </Link>
            )}
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
