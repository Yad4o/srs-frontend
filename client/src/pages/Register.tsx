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
import { Check, X, User, HeadphonesIcon, Crown } from 'lucide-react'

export default function Register() {
  const [, navigate] = useLocation()
  const { register: registerUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<'user' | 'agent' | 'admin'>('user')

  const roleOptions = [
    {
      value: 'user' as const,
      title: 'Customer',
      description: 'I need help with my support tickets',
      icon: User,
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-500/10',
      iconBg: 'bg-blue-500',
      titleColor: 'text-blue-400',
    },
    {
      value: 'agent' as const,
      title: 'Support Agent',
      description: 'I help customers resolve their issues',
      icon: HeadphonesIcon,
      borderColor: 'border-green-500',
      bgColor: 'bg-green-500/10',
      iconBg: 'bg-green-500',
      titleColor: 'text-green-400',
    },
    {
      value: 'admin' as const,
      title: 'Administrator',
      description: 'I manage the entire support system',
      icon: Crown,
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-500/10',
      iconBg: 'bg-purple-500',
      titleColor: 'text-purple-400',
    },
  ]

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

    const result = await registerUser(data.email, data.password, selectedRole)

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

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">Account Type</label>
            <div className="space-y-2">
              {roleOptions.map((role) => {
                const Icon = role.icon
                const isSelected = selectedRole === role.value
                return (
                  <div
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={`
                      relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${isSelected 
                        ? `${role.borderColor} ${role.bgColor}` 
                        : 'border-bg-border hover:border-bg-border/80'
                      }
                    `}
                  >
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full mr-3
                      ${isSelected ? `${role.iconBg} text-white` : 'bg-bg-raised text-text-muted'}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${isSelected ? role.titleColor : 'text-text-primary'}`}>
                        {role.title}
                      </h4>
                      <p className="text-sm text-text-secondary">{role.description}</p>
                    </div>
                    {isSelected && (
                      <div className={`w-5 h-5 rounded-full ${role.iconBg} flex items-center justify-center`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <input type="hidden" {...register('role')} value={selectedRole} />
            {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
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
          <Link href="/login" className="text-accent-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
