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
