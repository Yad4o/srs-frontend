/**
 * Topbar - Top navigation bar
 */

import { useLocation } from 'wouter'
import { useAuth } from '@/hooks/useAuth'
import { Bell, Settings } from 'lucide-react'

export function Topbar() {
  const { user } = useAuth()
  const [, navigate] = useLocation()

  return (
    <header className="relative z-10 h-16 bg-bg-surface/40 backdrop-blur-2xl border-b border-white/[0.06] flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-display text-text-primary tracking-tight">
          {user?.role === 'admin' ? 'Admin Dashboard' : user?.role === 'agent' ? 'Agent Queue' : 'Support Portal'}
        </h2>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-green/10 border border-accent-green/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          <span className="text-[11px] font-mono text-accent-green uppercase tracking-wide">Live</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors text-text-secondary hover:text-text-primary">
          <Bell className="w-[18px] h-[18px]" />
        </button>
        <button
          id="topbar-settings-btn"
          onClick={() => navigate('/settings')}
          aria-label="Go to Settings"
          className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors text-text-secondary hover:text-text-primary"
        >
          <Settings className="w-[18px] h-[18px]" />
        </button>
      </div>
    </header>
  )
}
