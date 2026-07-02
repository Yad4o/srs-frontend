/**
 * Admin API - Admin metrics and management endpoints
 */

import client from './client'
import type { AdminMetrics, Ticket } from '@/types'

export interface AgentListItem {
  id: number
  email: string
  role: string
}

export const getMetrics = () =>
  client.get<AdminMetrics>('/admin/metrics')

export const getAgents = () =>
  client.get<AgentListItem[]>('/admin/agents')

export const assignTicketToAgent = (ticketId: number, agentId: number) =>
  client.post<Ticket>(`/admin/tickets/${ticketId}/assign`, { agent_id: agentId })

// ---------- User management ----------

export interface AdminUserItem {
  id: number
  email: string
  role: string
  is_active: boolean
  created_at: string | null
}

export interface AdminUserListResponse {
  users: AdminUserItem[]
  total: number
}

export const listUsers = (params?: { role?: string; search?: string; limit?: number; offset?: number }) =>
  client.get<AdminUserListResponse>('/admin/users', { params })

export const adminResetPassword = (userId: number, newPassword: string) =>
  client.post<{ message: string }>(`/admin/users/${userId}/reset-password`, { new_password: newPassword })
