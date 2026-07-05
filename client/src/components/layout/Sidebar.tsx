/**
 * Sidebar - Main navigation sidebar
 */

import { Link, useLocation } from 'wouter'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { LogOut, Home, Ticket, Users, BarChart3, Settings, UserPlus, ShieldCheck } from 'lucide-react'

export function Sidebar() {
  const { user, logout } = useAuth()
  const [location] = useLocation()

  const isActive = (path: string) => location === path

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['user', 'agent', 'admin'] },
    { path: '/tickets', label: 'My Tickets', icon: Ticket, roles: ['user'] },
    { path: '/queue', label: 'Queue', icon: Users, roles: ['agent', 'admin'] },
    { path: '/admin', label: 'Metrics', icon: BarChart3, roles: ['admin'] },
    { path: '/admin/escalations', label: 'Escalations', icon: UserPlus, roles: ['admin'] },
    { path: '/admin/users', label: 'Users', icon: ShieldCheck, roles: ['admin'] },
    { path: '/settings', label: 'Settings', icon: Settings, roles: ['user', 'agent', 'admin'] },
  ]

  const visibleItems = navItems.filter((item) => item.roles.includes(user?.role || 'user'))
  const initial = (user?.email || 'U').charAt(0).toUpperCase()

  return (
    <aside className="relative z-10 w-64 bg-bg-surface/50 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.06] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-blue to-fuchsia-500 flex items-center justify-center shadow-[0_0_20px_-4px_var(--accent-blue)] shrink-0">
          <span className="font-display text-sm text-white">S</span>
        </div>
        <div>
          <h1 className="text-lg font-display text-text-primary tracking-tight leading-none">SRS</h1>
          <p className="text-[11px] text-text-secondary mt-1 font-mono uppercase tracking-wider">Support Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200',
                active
                  ? 'text-white'
                  : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent-blue to-accent-blue/70 shadow-[0_0_24px_-6px_var(--accent-blue)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="relative z-10 w-[18px] h-[18px]" />
              <span className="relative z-10 text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-white/[0.06] space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center text-xs font-display text-bg-base shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-text-primary truncate font-medium leading-tight">{user.email || 'User'}</p>
              <p className="text-[11px] text-accent-green capitalize leading-tight mt-0.5">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-accent-red hover:bg-accent-red/[0.06] rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
