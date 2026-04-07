/**
 * Auth API - Authentication endpoints
 */

import client from './client'
import type { AuthToken, User } from '@/types'

export const login = (email: string, password: string) =>
  client.post<AuthToken>('/auth/login', { email, password })

export const register = (email: string, password: string, role?: string) =>
  client.post<User>('/auth/register', { email, password, role })

export const getMe = () =>
  client.get<User>('/auth/me')

export const forgotPassword = (email: string) =>
  client.post('/auth/forgot-password', { email })

export const verifyOTP = (email: string, otp: string) =>
  client.post('/auth/verify-otp', { email, otp })

export const resetPassword = (email: string, otp: string, newPassword: string) =>
  client.post('/auth/reset-password', { email, otp, new_password: newPassword })
