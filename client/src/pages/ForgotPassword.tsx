/**
 * ForgotPassword Page - Password reset with OTP verification
 */

import { useState } from 'react'
import { useLocation, Link } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

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

export default function ForgotPassword() {
  const [, navigate] = useLocation()
  const { forgotPassword, verifyOTP, resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)

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
      setOtpVerified(true)
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

    const result = await resetPassword(email, '', data.newPassword)

    if (result.success) {
      toast.success('Password reset successfully')
      navigate('/login')
    } else {
      setError(result.error || 'Failed to reset password')
      toast.error(result.error || 'Failed to reset password')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">SRS Support</h1>
          <p className="text-text-secondary">
            {step === 'email' && 'Reset your password'}
            {step === 'otp' && 'Enter verification code'}
            {step === 'reset' && 'Set new password'}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'email' ? 'bg-accent-blue text-white' : 
              step === 'otp' || step === 'reset' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'otp' ? 'bg-accent-blue text-white' : 
              step === 'reset' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'reset' ? 'bg-accent-blue text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4 bg-bg-surface p-6 rounded-lg border border-bg-border">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...registerEmail('email')}
                className="w-full"
              />
              {emailErrors.email && <p className="text-red-400 text-xs mt-1">{emailErrors.email.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit(onOTPSubmit)} className="space-y-4 bg-bg-surface p-6 rounded-lg border border-bg-border">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Enter 6-digit OTP</label>
              <Input
                type="text"
                placeholder="123456"
                maxLength={6}
                {...registerOtp('otp')}
                className="w-full text-center text-2xl tracking-widest"
              />
              {otpErrors.otp && <p className="text-red-400 text-xs mt-1">{otpErrors.otp.message}</p>}
            </div>

            <div className="text-sm text-text-secondary text-center">
              OTP sent to {email}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-accent-blue hover:underline text-sm"
              >
                Back to email
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 'reset' && (
          <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-4 bg-bg-surface p-6 rounded-lg border border-bg-border">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">New Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                {...registerReset('newPassword')}
                className="w-full"
              />
              {resetErrors.newPassword && <p className="text-red-400 text-xs mt-1">{resetErrors.newPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm new password"
                {...registerReset('confirmPassword')}
                className="w-full"
              />
              {resetErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{resetErrors.confirmPassword.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-text-secondary text-sm mt-6">
          Remember your password?{' '}
          <Link href="/login" className="text-accent-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
