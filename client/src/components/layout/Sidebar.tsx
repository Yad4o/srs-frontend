/**
 * Sidebar - Main navigation sidebar
 */

import { Link, useLocation } from 'wouter'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { LogOut, Home, Ticket, Users, BarChart3 } from 'lucide-react'

export function Sidebar() {
  const { user, logout } = useAuth()
  const [location] = useLocation()

  const isActive = (path: string) => location === path

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['user', 'agent', 'admin'] },
    { path: '/tickets', label: 'My Tickets', icon: Ticket, roles: ['user'] },
    { path: '/queue', label: 'Queue', icon: Users, roles: ['agent', 'admin'] },
    { path: '/admin', label: 'Metrics', icon: BarChart3, roles: ['admin'] },
  ]

  const visibleItems = navItems.filter((item) => item.roles.includes(user?.role || 'user'))

  return (
    <aside className="w-64 bg-bg-surface border-r border-bg-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-bg-border">
        <h1 className="text-xl font-bold text-text-primary">SRS</h1>
        <p className="text-xs text-text-secondary mt-1">Support Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                  isActive(item.path)
                    ? 'bg-accent-blue text-bg-base'
                    : 'text-text-secondary hover:bg-bg-raised hover:text-text-primary'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            </Link>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-bg-border space-y-3">
        {user && (
          <div className="px-4 py-2 bg-bg-raised rounded-lg">
            <p className="text-xs text-text-muted">Logged in as</p>
            <p className="text-sm text-text-primary truncate font-medium">{user.email}</p>
            <p className="text-xs text-accent-green mt-1 capitalize">{user.role}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-accent-red transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
