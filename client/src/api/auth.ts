/**
 * Auth API - Authentication endpoints
 */

import client from './client'
import type { AuthToken, User } from '@/types'

export const login = (email: string, password: string) =>
  client.post<AuthToken>('/auth/login', { email, password })

export const register = (email: string, password: string) =>
  client.post<User>('/auth/register', { email, password })

export const getMe = () =>
  client.get<User>('/auth/me')
