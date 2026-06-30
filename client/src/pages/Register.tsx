/**
 * Register Page — SRS
 * Split-panel matching landing aesthetic.
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
import { Check, X, Eye, EyeOff, ArrowRight, ArrowLeft, User, HeadphonesIcon, Crown } from 'lucide-react'

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

function R({ children, d = 0, className = '' }: { children: React.ReactNode; d?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: d, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

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
    <div className="min-h-screen flex bg-background text-foreground">

      {/* LEFT PANEL — image + role picker */}
      <div className="hidden lg:flex relative flex-col justify-between w-[44%] flex-shrink-0 overflow-hidden border-r border-border">
        <img
          src="/images/bridge.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/40" />
        <div className="absolute top-40 right-1/4 w-72 h-72 rounded-full pointer-events-none bg-purple-500 blur-[120px] opacity-10" />

        <div className="relative z-10 p-10">
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to site
            </span>
          </Link>
        </div>

        <div className="relative z-10 p-10">
          <R>
            <p className="text-xs uppercase tracking-widest mb-5 text-white/50 font-mono">Three roles. One system.</p>
          </R>
          <div className="space-y-3">
            {ROLE_OPTIONS.map((r, i) => {
              const Icon = r.icon
              const active = selectedRole === r.value
              return (
                <R key={r.value} d={0.05 * i}>
                  <motion.div
                    animate={{ borderColor: active ? `${r.color}77` : 'rgba(255,255,255,0.12)', background: active ? `${r.color}1a` : 'rgba(255,255,255,0.03)' }}
                    className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer backdrop-blur-sm"
                    onClick={() => setSelectedRole(r.value)}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: active ? `${r.color}33` : 'rgba(255,255,255,0.08)', color: active ? r.color : 'rgba(255,255,255,0.5)' }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: active ? r.color : 'rgba(255,255,255,0.8)' }}>{r.label}</p>
                      <p className="text-xs mt-0.5 text-white/45">{r.desc}</p>
                    </div>
                  </motion.div>
                </R>
              )
            })}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full pointer-events-none bg-emerald-500 blur-[140px] opacity-[0.05]" />

        <div className="w-full max-w-sm relative z-10">

          <R>
            <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-sm mb-6 text-muted-foreground">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <p className="text-xs uppercase tracking-widest mb-3 text-muted-foreground font-mono">New account</p>
            <h1 className="text-3xl font-display mb-7">Create your account</h1>
          </R>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-3 rounded-lg text-xs bg-destructive/10 border border-destructive/30 text-destructive"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <R d={0.05}>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Email</label>
              <Input
                type="email"
                placeholder="you@company.com"
                {...register('email')}
                className="w-full text-sm h-11"
              />
              {errors.email && <p className="text-xs mt-1 text-destructive">{errors.email.message}</p>}
            </R>

            <R d={0.1}>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { onChange: e => setPassword(e.target.value) })}
                  className="w-full text-sm h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1 text-destructive">{errors.password.message}</p>}

              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="flex-1 h-0.5 rounded-full transition-all duration-300"
                        style={{ background: i < strength ? (strength <= 1 ? '#ef4444' : strength <= 2 ? '#f59e0b' : '#22c55e') : 'var(--border)' }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {requirements.map(r => (
                      <span
                        key={r.label}
                        className="flex items-center gap-1 text-xs"
                        style={{ color: r.met ? '#22c55e' : 'var(--muted-foreground)' }}
                      >
                        {r.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {r.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </R>

            {/* Mobile role picker */}
            <R d={0.13} className="lg:hidden">
              <label className="block text-xs font-medium mb-2 text-muted-foreground">Account type</label>
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
                        borderColor: active ? `${r.color}55` : 'var(--border)',
                        background: active ? `${r.color}0c` : 'transparent',
                      }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? r.color : 'var(--muted-foreground)' }} />
                      <span className="text-xs font-medium" style={{ color: active ? r.color : 'var(--foreground)' }}>{r.label}</span>
                    </div>
                  )
                })}
              </div>
            </R>

            <input type="hidden" {...register('role')} value={selectedRole} />
            {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}

            <R d={0.18}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity bg-foreground text-background disabled:opacity-60"
              >
                {isLoading ? 'Creating account…' : <><span>Create account</span><ArrowRight className="w-4 h-4" /></>}
              </motion.button>
            </R>
          </form>

          <R d={0.22}>
            <p className="mt-7 text-xs text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="hover:underline text-foreground/80">Sign in</Link>
            </p>
          </R>
        </div>
      </div>
    </div>
  )
}
