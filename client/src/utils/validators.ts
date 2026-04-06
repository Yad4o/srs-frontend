/**
 * Validators - Zod schemas for form validation
 */

import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[!@#$%^&*]/, 'Password must contain a special character (!@#$%^&*)'),
  role: z.enum(['user', 'agent', 'admin']).default('user'),
})

export const ticketSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message cannot exceed 5000 characters'),
})

export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  resolved: z.boolean(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type TicketInput = z.infer<typeof ticketSchema>
export type FeedbackInput = z.infer<typeof feedbackSchema>
