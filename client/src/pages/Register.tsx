/**
 * Register Page - User registration with password complexity feedback
 */

import { useState, useMemo } from 'react'
import { useLocation, Link } from 'wouter'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/utils/validators'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Check, X } from 'lucide-react'

export default function Register() {
  const [, navigate] = useLocation()
  const { register: registerUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const requirements = useMemo(
    () => [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Lowercase letter', met: /[a-z]/.test(password) },
      { label: 'Number', met: /[0-9]/.test(password) },
      { label: 'Special character (!@#$%^&*)', met: /[!@#$%^&*]/.test(password) },
    ],
    [password]
  )

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError('')

    const result = await registerUser(data.email, data.password)

    if (result.success) {
      toast.success('Account created successfully')
      navigate('/login')
    } else {
      setError(result.error || 'Registration failed')
      toast.error(result.error || 'Registration failed')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Create Account</h1>
          <p className="text-text-secondary">Join SRS Support Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-bg-surface p-6 rounded-lg border border-bg-border">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className="w-full"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password', {
                onChange: (e) => setPassword(e.target.value),
              })}
              className="w-full"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Password Requirements */}
          <div className="space-y-2 p-3 bg-bg-raised rounded border border-bg-border">
            <p className="text-xs font-medium text-text-secondary mb-2">Password Requirements:</p>
            {requirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                {req.met ? (
                  <Check className="w-4 h-4 text-accent-green flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-text-muted flex-shrink-0" />
                )}
                <span className={req.met ? 'text-accent-green' : 'text-text-muted'}>{req.label}</span>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-text-secondary text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login">
            <a className="text-accent-blue hover:underline">Sign in</a>
          </Link>
        </p>
      </div>
    </div>
  )
}
