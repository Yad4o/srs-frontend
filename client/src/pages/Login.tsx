/**
 * Login Page — SRS
 * Split-panel, landing-aesthetic: full-bleed image left, form right.
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
import { ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react'

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
          className="text-xs font-mono text-emerald-400"
        >
          {TICKER[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

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
    <div className="min-h-screen flex bg-background text-foreground">

      {/* LEFT PANEL — image + brand */}
      <div className="hidden lg:flex relative flex-col justify-between w-[46%] flex-shrink-0 overflow-hidden border-r border-border">
        <img
          src="/images/shield.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute top-32 left-1/4 w-72 h-72 rounded-full pointer-events-none bg-fuchsia-500 blur-[120px] opacity-10" />

        <div className="relative z-10 p-10">
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to site
            </span>
          </Link>
        </div>

        <div className="relative z-10 p-10">
          <R>
            <p className="text-xs uppercase tracking-widest mb-5 text-white/50 font-mono">Support Resolution System</p>
            <h2 className="text-4xl font-display leading-[1.05] mb-5 text-white">
              The tickets your team
              <br />
              <span className="italic text-white/60">shouldn't have to touch.</span>
            </h2>
            <p className="text-sm leading-relaxed mb-8 max-w-sm text-white/60">
              SRS handles intake, classification, and first-response automatically — so your agents only see what actually needs them.
            </p>
          </R>
          <R d={0.1} className="flex items-center gap-8 mb-8">
            {[
              { val: '73%', label: 'auto-resolve' },
              { val: '<200ms', label: 'pipeline' },
              { val: '0.75', label: 'confidence floor' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-lg font-bold font-mono text-white">{s.val}</p>
                <p className="text-xs mt-0.5 text-white/40">{s.label}</p>
              </div>
            ))}
          </R>
          <LeftTicker />
        </div>
      </div>

      {/* RIGHT PANEL — FORM */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full pointer-events-none bg-blue-500 blur-[140px] opacity-[0.06]" />

        <div className="w-full max-w-sm relative z-10">

          <R>
            <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-sm mb-6 text-muted-foreground">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <p className="text-xs uppercase tracking-widest mb-3 text-muted-foreground font-mono">Welcome back</p>
            <h1 className="text-3xl font-display mb-8">Sign in to SRS</h1>
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
                  {...register('password')}
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
            </R>

            <R d={0.14} className="flex justify-end">
              <Link href="/forgot-password" className="text-xs hover:underline text-muted-foreground">
                Forgot password?
              </Link>
            </R>

            <R d={0.18}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity bg-foreground text-background disabled:opacity-60"
              >
                {isLoading ? 'Signing in…' : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>}
              </motion.button>
            </R>
          </form>

          <R d={0.22}>
            <p className="mt-7 text-xs text-center text-muted-foreground">
              No account?{' '}
              <Link href="/register" className="hover:underline text-foreground/80">
                Create one
              </Link>
            </p>
          </R>
        </div>
      </div>
    </div>
  )
}
