/**
 * Register Page — SRS
 * Split-panel matching login aesthetic.
 */

import { useState, useMemo } from 'react'
import { useLocation, Link } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/utils/validators'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Eye, EyeOff, ArrowRight, User, HeadphonesIcon, Crown } from 'lucide-react'

const ROLE_OPTIONS = [
  {
    value: 'user' as const,
    label: 'Customer',
    desc: 'Submit and track support tickets',
    icon: User,
    color: '#3b82f6',
  },
  {
    value: 'agent' as const,
    label: 'Support Agent',
    desc: 'Handle escalated tickets from the queue',
    icon: HeadphonesIcon,
    color: '#22c55e',
  },
  {
    value: 'admin' as const,
    label: 'Administrator',
    desc: 'Manage the system and view all metrics',
    icon: Crown,
    color: '#a855f7',
  },
]

export default function Register() {
  const [, navigate] = useLocation()
  const { register: registerUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'user' | 'agent' | 'admin'>('user')

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const requirements = useMemo(() => [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special char', met: /[!@#$%^&*]/.test(password) },
  ], [password])

  const strength = requirements.filter(r => r.met).length

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError('')
    const result = await registerUser(data.email, data.password, selectedRole)
    if (result.success) {
      toast.success('Account created')
      navigate('/login')
    } else {
      setError(result.error || 'Registration failed')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0e1a', color: '#f1f5f9', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-[380px] flex-shrink-0 border-r p-10" style={{ borderColor: '#1f2d45', background: '#0d1117' }}>
        <Link href="/">
          <span className="text-sm font-bold cursor-pointer hover:opacity-70 transition-opacity">← SRS</span>
        </Link>

        <div>
          <p className="text-xs uppercase tracking-widest mb-5" style={{ color: '#475569' }}>Three roles. One system.</p>
          <div className="space-y-4">
            {ROLE_OPTIONS.map(r => {
              const Icon = r.icon
              const active = selectedRole === r.value
              return (
                <motion.div
                  key={r.value}
                  animate={{ borderColor: active ? `${r.color}55` : '#1f2d45', background: active ? `${r.color}0c` : 'transparent' }}
                  className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer"
                  onClick={() => setSelectedRole(r.value)}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: active ? `${r.color}22` : '#1a2235', color: active ? r.color : '#475569' }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: active ? r.color : '#94a3b8' }}>{r.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{r.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <p className="text-xs" style={{ color: '#1f2d45' }}>SRS · Support Resolution System</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <div className="mb-7">
            <Link href="/" className="lg:hidden block text-sm mb-6" style={{ color: '#475569' }}>← Back</Link>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#475569' }}>New account</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Create your account</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-3 rounded-lg text-xs"
                  style={{ background: '#ef444418', border: '1px solid #ef444433', color: '#fca5a5' }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Email</label>
              <Input
                type="email"
                placeholder="you@company.com"
                {...register('email')}
                className="w-full text-sm"
                style={{ background: '#111827', borderColor: '#1f2d45', color: '#f1f5f9' }}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Password</label>
              <div className="relative">
                <Input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { onChange: e => setPassword(e.target.value) })}
                  className="w-full text-sm pr-10"
                  style={{ background: '#111827', borderColor: '#1f2d45', color: '#f1f5f9' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#475569' }}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.password.message}</p>}

              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="flex-1 h-0.5 rounded-full transition-all duration-300"
                        style={{ background: i < strength ? (strength <= 1 ? '#ef4444' : strength <= 2 ? '#f59e0b' : '#22c55e') : '#1f2d45' }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {requirements.map(r => (
                      <span key={r.label} className="flex items-center gap-1 text-xs"
                        style={{ color: r.met ? '#22c55e' : '#475569' }}
                      >
                        {r.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {r.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile role picker */}
            <div className="lg:hidden">
              <label className="block text-xs font-medium mb-2" style={{ color: '#94a3b8' }}>Account type</label>
              <div className="space-y-2">
                {ROLE_OPTIONS.map(r => {
                  const Icon = r.icon
                  const active = selectedRole === r.value
                  return (
                    <div
                      key={r.value}
                      onClick={() => setSelectedRole(r.value)}
                      className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
                      style={{
                        borderColor: active ? `${r.color}55` : '#1f2d45',
                        background: active ? `${r.color}0c` : 'transparent'
                      }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? r.color : '#475569' }} />
                      <span className="text-xs font-medium" style={{ color: active ? r.color : '#94a3b8' }}>{r.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <input type="hidden" {...register('role')} value={selectedRole} />
            {errors.role && <p className="text-xs" style={{ color: '#ef4444' }}>{errors.role.message}</p>}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity"
              style={{ background: '#f1f5f9', color: '#0a0e1a', opacity: isLoading ? 0.6 : 1 }}
            >
              {isLoading ? 'Creating account…' : <><span>Create account</span><ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <p className="mt-7 text-xs text-center" style={{ color: '#475569' }}>
            Already have an account?{' '}
            <Link href="/login" className="hover:underline" style={{ color: '#94a3b8' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
