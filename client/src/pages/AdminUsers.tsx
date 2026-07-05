/**
 * AdminUsers — User management page for admins
 *
 * Lists all users with role/search filtering.
 * Admins can force-reset any user's password directly,
 * bypassing the OTP email flow (useful when email delivery is broken).
 */

import { useState, useEffect, useCallback } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { listUsers, adminResetPassword, type AdminUserItem } from '@/api/admin'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, RefreshCw, ShieldCheck, User, Headphones,
  KeyRound, Eye, EyeOff, Check, X, Loader2
} from 'lucide-react'

// ---- Password strength helpers ----
const PW_REQUIREMENTS = [
  { label: '8+ chars',   test: (p: string) => p.length >= 8 },
  { label: 'Uppercase',  test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Number',     test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special',    test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

function PasswordInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false)
  const met = PW_REQUIREMENTS.map(r => r.test(value))
  const strength = met.filter(Boolean).length

  return (
    <div>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="New password"
          className="w-full px-3 py-2 pr-10 text-sm bg-bg-base border border-bg-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue"
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {value.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {/* Strength bar */}
          <div className="flex gap-1">
            {[0,1,2,3].map(i => (
              <div
                key={i}
                className="flex-1 h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: i < strength
                    ? strength <= 1 ? '#ef4444' : strength <= 2 ? '#f59e0b' : '#22c55e'
                    : 'var(--bg-border)'
                }}
              />
            ))}
          </div>
          {/* Requirements */}
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {PW_REQUIREMENTS.map((r, i) => (
              <span
                key={r.label}
                className="flex items-center gap-1 text-xs"
                style={{ color: met[i] ? '#22c55e' : 'var(--text-muted)' }}
              >
                {met[i] ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                {r.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ---- Reset password modal ----
function ResetPasswordModal({
  user,
  onClose,
  onSuccess,
}: {
  user: AdminUserItem
  onClose: () => void
  onSuccess: () => void
}) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const allMet = PW_REQUIREMENTS.every(r => r.test(password))

  const handleSubmit = async () => {
    if (!allMet) return
    setLoading(true)
    try {
      await adminResetPassword(user.id, password)
      toast.success(`Password reset for ${user.email}`)
      onSuccess()
      onClose()
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Failed to reset password'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18 }}
        className="relative z-10 w-full max-w-md bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-accent-amber/15 flex items-center justify-center">
            <KeyRound className="w-4 h-4 text-accent-amber" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Reset Password</h3>
            <p className="text-xs text-text-muted truncate max-w-xs">{user.email}</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs text-text-secondary mb-3">
            Set a temporary password for this account. The user should change it on next login.
          </p>
          <PasswordInput value={password} onChange={setPassword} />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-bg-border rounded-lg hover:bg-bg-raised transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!allMet || loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-accent-amber text-bg-base hover:bg-accent-amber/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ---- Role badge ----
const ROLE_STYLE: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  admin: { bg: 'bg-accent-purple/15', text: 'text-accent-purple', icon: ShieldCheck },
  agent: { bg: 'bg-accent-blue/15',   text: 'text-accent-blue',   icon: Headphones },
  user:  { bg: 'bg-bg-raised',         text: 'text-text-secondary', icon: User },
}

function RoleBadge({ role }: { role: string }) {
  const s = ROLE_STYLE[role] ?? ROLE_STYLE.user
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <Icon className="w-3 h-3" />
      {role}
    </span>
  )
}

// ---- Main page ----
const ROLE_FILTERS = [
  { value: '', label: 'All' },
  { value: 'user', label: 'Users' },
  { value: 'agent', label: 'Agents' },
  { value: 'admin', label: 'Admins' },
]

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [resetTarget, setResetTarget] = useState<AdminUserItem | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listUsers({
        role: roleFilter || undefined,
        search: search || undefined,
        limit: 100,
      })
      setUsers(res.data.users)
      setTotal(res.data.total)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [search, roleFilter])

  useEffect(() => {
    const t = setTimeout(fetchUsers, search ? 300 : 0)
    return () => clearTimeout(t)
  }, [fetchUsers, search])

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="User Management"
          description="View all accounts and reset passwords when needed"
          image="/images/encrypted.jpg"
        />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue"
            />
          </div>

          {/* Role filter tabs */}
          <div className="flex gap-1 bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl p-1">
            {ROLE_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setRoleFilter(f.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  roleFilter === f.value
                    ? 'bg-accent-blue text-bg-base'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-lg text-text-secondary hover:text-text-primary hover:border-accent-blue/40 hover:bg-white/[0.05] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Summary */}
        {!loading && (
          <p className="text-xs text-text-muted mb-4">
            {total} {total === 1 ? 'user' : 'users'} found
          </p>
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center py-16 text-text-secondary">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 opacity-50" />
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl">
            <User className="w-10 h-10 mx-auto mb-3 text-text-muted opacity-40" />
            <p className="text-text-secondary font-medium">No users found</p>
            {search && (
              <p className="text-text-muted text-sm mt-1">
                Try a different search term
              </p>
            )}
          </div>
        ) : (
          <div className="bg-bg-surface/60 backdrop-blur-xl border border-bg-border/70 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide">Joined</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-white/[0.03] transition-colors duration-150">
                    <td className="px-5 py-3.5 font-mono text-xs text-text-muted">#{user.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-blue to-fuchsia-500 flex items-center justify-center text-[11px] font-display text-white shrink-0">
                          {user.email?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="text-text-primary font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        user.is_active ? 'text-accent-green' : 'text-text-muted'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.is_active ? 'bg-accent-green' : 'bg-text-muted'
                        }`} />
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-text-secondary text-xs">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setResetTarget(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-bg-border text-text-secondary hover:border-accent-amber hover:text-accent-amber hover:bg-accent-amber/5 transition-all"
                      >
                        <KeyRound className="w-3 h-3" />
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {resetTarget && (
          <ResetPasswordModal
            user={resetTarget}
            onClose={() => setResetTarget(null)}
            onSuccess={fetchUsers}
          />
        )}
      </AnimatePresence>
    </AppShell>
  )
}
