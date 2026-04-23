/**
 * Settings Page - User account settings and preferences
 */

import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { useAuth } from '@/hooks/useAuth'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  User,
  Shield,
  Bell,
  Lock,
  Settings as SettingsIcon,
  ChevronRight,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-accent-red/10 text-accent-red border border-accent-red/30',
  agent: 'bg-accent-amber/10 text-accent-amber border border-accent-amber/30',
  user: 'bg-accent-green/10 text-accent-green border border-accent-green/30',
}

const NOTIFICATIONS_KEY = 'srs_notifications_enabled'

export default function Settings() {
  const { user } = useAuth()
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY)
    return stored === null ? true : stored === 'true'
  })

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, String(notificationsEnabled))
  }, [notificationsEnabled])

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const roleColor = ROLE_COLORS[user.role] ?? ROLE_COLORS.user

  return (
    <AppShell>
      <div className="p-8 max-w-3xl mx-auto">
        <PageHeader
          title="Settings"
          description="Manage your account, preferences, and system configuration."
        />

        <div className="space-y-6">
          {/* ── Profile Section ── */}
          <section
            className="bg-bg-surface border border-bg-border rounded-xl overflow-hidden"
            aria-labelledby="profile-heading"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-bg-border bg-bg-raised">
              <User className="w-5 h-5 text-accent-blue" />
              <h2 id="profile-heading" className="font-semibold text-text-primary">
                Profile
              </h2>
            </div>

            <div className="divide-y divide-bg-border">
              {/* Email */}
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-xs text-text-muted mb-0.5">Email address</p>
                  <p className="text-sm font-medium text-text-primary">{user.email}</p>
                </div>
                <span className="text-xs text-text-muted bg-bg-raised px-2 py-1 rounded">
                  Read-only
                </span>
              </div>

              {/* Role */}
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-xs text-text-muted mb-0.5">Account role</p>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize',
                      roleColor
                    )}
                  >
                    <Shield className="w-3 h-3" />
                    {user.role}
                  </span>
                </div>
                <span className="text-xs text-text-muted bg-bg-raised px-2 py-1 rounded">
                  Read-only
                </span>
              </div>

              {/* Change Password */}
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-text-primary">Password</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Reset your password via email OTP
                  </p>
                </div>
                <Link href="/forgot-password">
                  <Button
                    id="settings-change-password-btn"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* ── Preferences Section ── */}
          <section
            className="bg-bg-surface border border-bg-border rounded-xl overflow-hidden"
            aria-labelledby="preferences-heading"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-bg-border bg-bg-raised">
              <Bell className="w-5 h-5 text-accent-amber" />
              <h2 id="preferences-heading" className="font-semibold text-text-primary">
                Preferences
              </h2>
            </div>

            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Notifications</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Receive in-app alerts for ticket updates
                  </p>
                </div>

                {/* Toggle */}
                <button
                  id="settings-notifications-toggle"
                  role="switch"
                  aria-checked={notificationsEnabled}
                  onClick={() => setNotificationsEnabled((prev) => !prev)}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
                    'transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2',
                    notificationsEnabled ? 'bg-accent-blue' : 'bg-bg-border'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md',
                      'transform transition duration-200',
                      notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
              <p className="mt-3 text-xs text-text-muted">
                Preference saved locally in your browser.
              </p>
            </div>
          </section>

          {/* ── Admin Section (admin only) ── */}
          {user.role === 'admin' && (
            <section
              className="bg-bg-surface border border-bg-border rounded-xl overflow-hidden"
              aria-labelledby="admin-heading"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-bg-border bg-bg-raised">
                <Wrench className="w-5 h-5 text-accent-red" />
                <h2 id="admin-heading" className="font-semibold text-text-primary">
                  System Configuration
                </h2>
                <span className="ml-auto text-xs bg-accent-red/10 text-accent-red border border-accent-red/30 px-2 py-0.5 rounded-full font-semibold">
                  Admin
                </span>
              </div>

              <div className="px-6 py-8 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-bg-raised flex items-center justify-center mb-1">
                  <SettingsIcon className="w-7 h-7 text-text-muted" />
                </div>
                <p className="text-sm font-semibold text-text-primary">Coming Soon</p>
                <p className="text-xs text-text-secondary max-w-xs">
                  Advanced system configuration options — including SLA rules, routing policies, and
                  integrations — will appear here in a future release.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </AppShell>
  )
}
