/**
 * Dashboard Page - Role-aware home page
 */

import { useAuth } from '@/hooks/useAuth'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Link } from 'wouter'
import { Plus, Users, BarChart3 } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title={`Welcome, ${user.email?.split('@')[0] || 'User'}`}
          description={`You're logged in as a ${user.role}`}
          action={
            user.role === 'user' && (
              <Link href="/tickets/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              </Link>
            )
          }
        />

        {/* Role-specific content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user.role === 'user' && (
            <>
              <Link href="/tickets" className="p-6 bg-bg-surface border border-bg-border rounded-lg hover:border-accent-blue transition-colors">
                <div className="text-accent-green text-2xl mb-2">📋</div>
                <h3 className="font-semibold text-text-primary mb-1">My Tickets</h3>
                <p className="text-sm text-text-secondary">View and manage your support tickets</p>
              </Link>
              <Link href="/tickets/new" className="p-6 bg-bg-surface border border-bg-border rounded-lg hover:border-accent-blue transition-colors">
                <div className="text-accent-blue text-2xl mb-2">✏️</div>
                <h3 className="font-semibold text-text-primary mb-1">Submit New Ticket</h3>
                <p className="text-sm text-text-secondary">Create a new support request</p>
              </Link>
            </>
          )}

          {user.role === 'agent' && (
            <>
              <Link href="/queue" className="p-6 bg-bg-surface border border-bg-border rounded-lg hover:border-accent-blue transition-colors">
                <Users className="w-8 h-8 text-accent-amber mb-2" />
                <h3 className="font-semibold text-text-primary mb-1">Escalation Queue</h3>
                <p className="text-sm text-text-secondary">View tickets needing human attention</p>
              </Link>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <Link href="/admin" className="p-6 bg-bg-surface border border-bg-border rounded-lg hover:border-accent-blue transition-colors">
                <BarChart3 className="w-8 h-8 text-accent-blue mb-2" />
                <h3 className="font-semibold text-text-primary mb-1">Metrics Dashboard</h3>
                <p className="text-sm text-text-secondary">View system performance and health</p>
              </Link>
              <Link href="/queue" className="p-6 bg-bg-surface border border-bg-border rounded-lg hover:border-accent-blue transition-colors">
                <Users className="w-8 h-8 text-accent-amber mb-2" />
                <h3 className="font-semibold text-text-primary mb-1">Agent Queue</h3>
                <p className="text-sm text-text-secondary">Monitor escalated tickets</p>
              </Link>
              <Link href="/admin/tickets" className="p-6 bg-bg-surface border border-bg-border rounded-lg hover:border-accent-blue transition-colors">
                <div className="text-accent-green text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-text-primary mb-1">All Tickets</h3>
                <p className="text-sm text-text-secondary">Browse entire ticket database</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </AppShell>
  )
}
