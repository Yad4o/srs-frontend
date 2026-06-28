/**
 * Login Page — SRS
 * Split-panel: brand left, form right. Matches landing aesthetic.
 */

import { useState } from 'react'
import { useLocation, Link } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/utils/validators'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'

const TICKER = [
  'Ticket received. Intent detected in 40ms.',
  'Confidence: 0.87 — response dispatched.',
  'Escalated to agent. No wrong answer sent.',
  'Similar case found. Solution reused.',
  'Auto-resolve rate: 73% this week.',
  'Pipeline complete. 190ms end-to-end.',
]

function LeftTicker() {
  const [idx, setIdx] = useState(0)
  useState(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TICKER.length), 2600)
    return () => clearInterval(t)
  })
  return (
    <div className="overflow-hidden h-5">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="text-xs font-mono"
          style={{ color: '#22c55e' }}
        >
          {TICKER[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

export default function Login() {
  const [, navigate] = useLocation()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError('')
    const result = await login(data.email, data.password)
    if (result.success) {
      toast.success('Signed in')
      navigate('/dashboard')
    } else {
      setError(result.error || 'Sign in failed')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0e1a', color: '#f1f5f9', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 border-r p-10" style={{ borderColor: '#1f2d45', background: '#0d1117' }}>
        <div>
          <Link href="/">
            <span className="text-sm font-bold cursor-pointer hover:opacity-70 transition-opacity">← SRS</span>
          </Link>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest mb-6" style={{ color: '#475569' }}>Support Resolution System</p>
          <h2 className="text-3xl font-bold mb-4 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
            The tickets your team
            <br />
            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>shouldn't have to touch.</span>
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#475569' }}>
            SRS handles intake, classification, and first-response automatically — so your agents only see what actually needs them.
          </p>
          <div className="space-y-3">
            {[
              { val: '73%', label: 'avg auto-resolve rate' },
              { val: '< 200ms', label: 'end-to-end pipeline' },
              { val: '0.75', label: 'confidence threshold' },
            ].map(s => (
              <div key={s.label} className="flex items-baseline gap-3">
                <span className="text-base font-bold font-mono" style={{ color: '#f1f5f9' }}>{s.val}</span>
                <span className="text-xs" style={{ color: '#475569' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <LeftTicker />
      </div>

      {/* RIGHT PANEL — FORM */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <Link href="/" className="lg:hidden block text-sm mb-6" style={{ color: '#475569' }}>← Back</Link>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Welcome back</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>Sign in to SRS</h1>
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
                  {...register('password')}
                  className="w-full text-sm pr-10"
                  style={{ background: '#111827', borderColor: '#1f2d45', color: '#f1f5f9' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#475569' }}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs hover:underline" style={{ color: '#475569' }}>
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity"
              style={{ background: '#f1f5f9', color: '#0a0e1a', opacity: isLoading ? 0.6 : 1 }}
            >
              {isLoading ? 'Signing in…' : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <p className="mt-7 text-xs text-center" style={{ color: '#475569' }}>
            No account?{' '}
            <Link href="/register" className="hover:underline" style={{ color: '#94a3b8' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
