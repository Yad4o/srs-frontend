/**
 * ForgotPassword Page — SRS
 * Password reset with OTP verification. Split-panel, landing aesthetic.
 */

import { useState } from 'react'
import { useLocation, Link } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'

// Schema for forgot password form
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

// Schema for OTP verification form
const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
})

type OTPInput = z.infer<typeof otpSchema>

// Schema for password reset form
const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one digit')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

const STEPS = [
  { key: 'email', label: 'Email' },
  { key: 'otp', label: 'Verify' },
  { key: 'reset', label: 'Reset' },
] as const

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

function StepDots({ step }: { step: 'email' | 'otp' | 'reset' }) {
  const idx = STEPS.findIndex(s => s.key === step)
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((s, i) => {
        const done = i < idx
        const active = i === idx
        return (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-colors"
              style={{
                background: done ? '#22c55e' : active ? 'var(--foreground)' : 'var(--secondary)',
                color: done ? '#fff' : active ? 'var(--background)' : 'var(--muted-foreground)',
              }}
            >
              {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-8 h-px" style={{ background: done ? '#22c55e' : 'var(--border)' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ForgotPassword() {
  const [, navigate] = useLocation()
  const { forgotPassword, verifyOTP, resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [verifiedOTP, setVerifiedOTP] = useState('')

  // Forgot password form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  // OTP verification form
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OTPInput>({
    resolver: zodResolver(otpSchema),
  })

  // Password reset form
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onEmailSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    setError('')

    const result = await forgotPassword(data.email)

    if (result.success) {
      setEmail(data.email)
      setStep('otp')
      toast.success('OTP sent to your email address')
    } else {
      setError(result.error || 'Failed to send OTP')
      toast.error(result.error || 'Failed to send OTP')
    }

    setIsLoading(false)
  }

  const onOTPSubmit = async (data: OTPInput) => {
    setIsLoading(true)
    setError('')

    const result = await verifyOTP(email, data.otp)

    if (result.success) {
      setVerifiedOTP(data.otp) // Store the verified OTP
      setStep('reset')
      toast.success('OTP verified successfully')
    } else {
      setError(result.error || 'Invalid OTP')
      toast.error(result.error || 'Invalid OTP')
    }

    setIsLoading(false)
  }

  const onResetSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true)
    setError('')

    const result = await resetPassword(email, verifiedOTP, data.newPassword)

    if (result.success) {
      toast.success('Password reset successfully')
      navigate('/login')
    } else {
      setError(result.error || 'Failed to reset password')
      toast.error(result.error || 'Failed to reset password')
    }

    setIsLoading(false)
  }

  const stepCopy: Record<typeof step, { eyebrow: string; title: string }> = {
    email: { eyebrow: 'Account recovery', title: 'Reset your password' },
    otp: { eyebrow: 'Verification', title: 'Enter the code' },
    reset: { eyebrow: 'Almost done', title: 'Set a new password' },
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">

      {/* LEFT PANEL — image */}
      <div className="hidden lg:flex relative flex-col justify-between w-[42%] flex-shrink-0 overflow-hidden border-r border-border">
        <img
          src="/images/encrypted.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/40" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full pointer-events-none bg-amber-500 blur-[120px] opacity-10" />

        <div className="relative z-10 p-10">
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to site
            </span>
          </Link>
        </div>

        <div className="relative z-10 p-10">
          <R>
            <p className="text-xs uppercase tracking-widest mb-5 text-white/50 font-mono">Account recovery</p>
            <h2 className="text-4xl font-display leading-[1.05] mb-5 text-white">
              Locked out
              <br />
              <span className="italic text-white/60">happens to everyone.</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-sm text-white/60">
              Verify your email, confirm the one-time code, and set a new password — back in within a couple of minutes.
            </p>
          </R>
        </div>
      </div>

      {/* RIGHT PANEL — multi-step form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full pointer-events-none bg-blue-500 blur-[140px] opacity-[0.06]" />

        <div className="w-full max-w-sm relative z-10">

          <R>
            <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-sm mb-6 text-muted-foreground">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <StepDots step={step} />
            <p className="text-xs uppercase tracking-widest mb-3 text-muted-foreground font-mono">{stepCopy[step].eyebrow}</p>
            <h1 className="text-3xl font-display mb-8">{stepCopy[step].title}</h1>
          </R>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-4 py-3 rounded-lg text-xs mb-4 bg-destructive/10 border border-destructive/30 text-destructive"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1: Email */}
          {step === 'email' && (
            <motion.form
              key="email-step"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleEmailSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Email address</label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  {...registerEmail('email')}
                  className="w-full text-sm h-11"
                />
                {emailErrors.email && <p className="text-xs mt-1 text-destructive">{emailErrors.email.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity bg-foreground text-background disabled:opacity-60"
              >
                {isLoading ? 'Sending OTP…' : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
              </motion.button>
            </motion.form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleOtpSubmit(onOTPSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">6-digit code</label>
                <Input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  {...registerOtp('otp')}
                  className="w-full text-center text-2xl tracking-[0.5em] h-14 font-mono"
                />
                {otpErrors.otp && <p className="text-xs mt-1 text-destructive">{otpErrors.otp.message}</p>}
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Sent to <span className="text-foreground/80">{email}</span>
              </p>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity bg-foreground text-background disabled:opacity-60"
              >
                {isLoading ? 'Verifying…' : <><span>Verify code</span><ArrowRight className="w-4 h-4" /></>}
              </motion.button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-center text-xs hover:underline text-muted-foreground"
              >
                Back to email
              </button>
            </motion.form>
          )}

          {/* Step 3: Reset Password */}
          {step === 'reset' && (
            <motion.form
              key="reset-step"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleResetSubmit(onResetSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">New password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...registerReset('newPassword')}
                  className="w-full text-sm h-11"
                />
                {resetErrors.newPassword && <p className="text-xs mt-1 text-destructive">{resetErrors.newPassword.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Confirm password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...registerReset('confirmPassword')}
                  className="w-full text-sm h-11"
                />
                {resetErrors.confirmPassword && <p className="text-xs mt-1 text-destructive">{resetErrors.confirmPassword.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-opacity bg-foreground text-background disabled:opacity-60"
              >
                {isLoading ? 'Resetting…' : <><span>Reset password</span><ArrowRight className="w-4 h-4" /></>}
              </motion.button>
            </motion.form>
          )}

          <p className="mt-7 text-xs text-center text-muted-foreground">
            Remember your password?{' '}
            <Link href="/login" className="hover:underline text-foreground/80">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
