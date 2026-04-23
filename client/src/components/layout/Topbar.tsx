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
    <header className="h-16 bg-bg-surface border-b border-bg-border flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          {user?.role === 'admin' ? 'Admin Dashboard' : user?.role === 'agent' ? 'Agent Queue' : 'Support Portal'}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-bg-raised rounded-lg transition-colors text-text-secondary hover:text-text-primary">
          <Bell className="w-5 h-5" />
        </button>
        <button
          id="topbar-settings-btn"
          onClick={() => navigate('/settings')}
          aria-label="Go to Settings"
          className="p-2 hover:bg-bg-raised rounded-lg transition-colors text-text-secondary hover:text-text-primary"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
