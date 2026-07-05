/**
 * Admin Dashboard Page - System metrics and health overview
 */

import { Link } from 'wouter'
import { useAdminMetrics } from '@/hooks/useAdminMetrics'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { formatPercentage } from '@/utils/formatters'
import { AlertCircle, ArrowRight, TrendingUp, TrendingDown, Ticket, CheckCircle2, AlertTriangle, Star } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const { data: metrics, isLoading } = useAdminMetrics()

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-8 flex items-center gap-3 text-text-secondary">
          <div className="w-4 h-4 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          Loading metrics...
        </div>
      </AppShell>
    )
  }

  if (!metrics) {
    return (
      <AppShell>
        <div className="p-8 text-text-secondary">Failed to load metrics</div>
      </AppShell>
    )
  }

  // Prepare chart data
  const statusData = [
    { name: 'Open', value: metrics.tickets.open, fill: '#3b82f6' },
    { name: 'Auto Resolved', value: metrics.tickets.auto_resolved, fill: '#22c55e' },
    { name: 'Escalated', value: metrics.tickets.escalated, fill: '#f59e0b' },
  ]

  const intentData = Object.entries(metrics.quality.by_intent).map(([intent, count]) => ({
    name: intent.replace(/_/g, ' '),
    value: count,
  }))

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="Admin Dashboard"
          description="System performance and health metrics"
          image="/images/shield.png"
        />

        {/* Unassigned Escalations Alert — links directly to the Escalations page */}
        {metrics.tickets.unassigned_escalated > 0 && (
          <Link href="/admin/escalations">
            <div className="mb-6 p-4 bg-amber-500/10 backdrop-blur-xl border border-amber-500/30 rounded-xl flex items-center gap-3 hover:bg-amber-500/15 hover:border-amber-500/50 hover:shadow-[0_0_28px_-12px_rgba(245,158,11,0.6)] transition-all cursor-pointer group">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-amber-300 font-medium">
                  {metrics.tickets.unassigned_escalated} unassigned escalated{' '}
                  {metrics.tickets.unassigned_escalated === 1 ? 'ticket' : 'tickets'} need attention
                </p>
                <p className="text-amber-300/70 text-sm">Click to open Escalations queue and assign agents</p>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Tickets */}
          <div className="group relative bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-accent-blue/40 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <p className="text-text-muted text-sm">Total Tickets</p>
              <div className="w-9 h-9 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                <Ticket className="w-4 h-4 text-accent-blue" />
              </div>
            </div>
            <p className="font-mono text-3xl text-text-primary font-bold">{metrics.tickets.total}</p>
            <div className="mt-3 h-1 bg-bg-border rounded overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-blue to-accent-blue/60" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Auto-Resolve Rate */}
          <div className="group relative bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <p className="text-text-muted text-sm">Auto-Resolve Rate</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${metrics.tickets.auto_resolve_rate >= 0.7 ? 'bg-accent-green/10' : 'bg-accent-amber/10'}`}>
                <CheckCircle2 className={`w-4 h-4 ${metrics.tickets.auto_resolve_rate >= 0.7 ? 'text-accent-green' : 'text-accent-amber'}`} />
              </div>
            </div>
            <p className={`font-mono text-3xl font-bold ${
              metrics.tickets.auto_resolve_rate >= 0.7 ? 'text-accent-green' : 'text-accent-amber'
            }`}>
              {formatPercentage(metrics.tickets.auto_resolve_rate)}
            </p>
            <div className="mt-3 flex items-center gap-1">
              {metrics.tickets.auto_resolve_rate >= 0.7 ? (
                <TrendingUp className="w-4 h-4 text-accent-green" />
              ) : (
                <TrendingDown className="w-4 h-4 text-accent-amber" />
              )}
              <span className="text-xs text-text-muted">
                {metrics.system_health.auto_resolve_rate_status === 'good' ? 'Good' : 'Needs improvement'}
              </span>
            </div>
          </div>

          {/* Escalation Rate */}
          <div className="group relative bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <p className="text-text-muted text-sm">Escalation Rate</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${metrics.tickets.escalation_rate <= 0.3 ? 'bg-accent-green/10' : 'bg-accent-amber/10'}`}>
                <AlertTriangle className={`w-4 h-4 ${metrics.tickets.escalation_rate <= 0.3 ? 'text-accent-green' : 'text-accent-amber'}`} />
              </div>
            </div>
            <p className={`font-mono text-3xl font-bold ${
              metrics.tickets.escalation_rate <= 0.3 ? 'text-accent-green' : 'text-accent-amber'
            }`}>
              {formatPercentage(metrics.tickets.escalation_rate)}
            </p>
            <div className="mt-3 flex items-center gap-1">
              {metrics.tickets.escalation_rate <= 0.3 ? (
                <TrendingDown className="w-4 h-4 text-accent-green" />
              ) : (
                <TrendingUp className="w-4 h-4 text-accent-amber" />
              )}
              <span className="text-xs text-text-muted">
                {metrics.system_health.escalation_rate_status === 'good' ? 'Good' : 'Needs improvement'}
              </span>
            </div>
          </div>

          {/* Avg Rating */}
          <div className="group relative bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-accent-amber/40 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <p className="text-text-muted text-sm">Avg Rating</p>
              <div className="w-9 h-9 rounded-lg bg-accent-amber/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-accent-amber" />
              </div>
            </div>
            <p className="font-mono text-3xl text-text-primary font-bold">
              {metrics.feedback.average_rating.toFixed(1)} / 5
            </p>
            <div className="mt-3 flex gap-0.5 text-accent-amber">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4" fill={i < Math.round(metrics.feedback.average_rating) ? 'currentColor' : 'none'} />
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Breakdown */}
          <div className="bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-4">Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #1f2d45',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              {statusData.map((item) => (
                <div key={item.name} className="flex justify-between">
                  <span className="text-text-secondary">{item.name}</span>
                  <span className="text-text-primary font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Intent Breakdown */}
          <div className="bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-4">Tickets by Intent</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={intentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2d45" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #1f2d45',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Low Quality Alert */}
          <div className="bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-4">Quality Status</h3>
            {metrics.quality.low_quality_count > 0 ? (
              <div className="p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 font-medium">
                    {metrics.quality.low_quality_count} tickets have low quality scores
                  </p>
                  <p className="text-red-300/70 text-sm mt-1">
                    Consider reviewing response templates
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-500/10 backdrop-blur-xl border border-green-500/30 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                <p className="text-green-300 font-medium">All responses performing well</p>
              </div>
            )}
          </div>

          {/* Feedback Health */}
          <div className="bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-4">Feedback Health</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-muted mb-1">Total Feedback</p>
                <p className="font-mono text-2xl text-text-primary">{metrics.feedback.total}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Resolution Rate</p>
                <p className="font-mono text-2xl text-accent-green">
                  {formatPercentage(metrics.feedback.resolution_rate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Feedback Coverage</p>
                <p className="font-mono text-2xl text-accent-blue">
                  {formatPercentage(metrics.system_health.feedback_coverage)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
