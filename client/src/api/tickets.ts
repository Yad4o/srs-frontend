/**
 * Tickets API - Ticket management endpoints
 */

import client from './client'
import type { Ticket, TicketList, TicketStatus, AdminTicketsResponse } from '@/types'

export const createTicket = (message: string) =>
  client.post<Ticket>('/tickets/', { message })

export const listTickets = (status?: TicketStatus) =>
  client.get<TicketList>('/tickets/', { params: status ? { status } : {} })

export const getMyAssignments = (status?: TicketStatus) =>
  client.get<TicketList>('/tickets/my-assignments', { params: status ? { status } : {} })

export const getTicket = (id: number) =>
  client.get<Ticket>(`/tickets/${id}`)

export const assignTicket = (id: number) =>
  client.post<Ticket>(`/tickets/${id}/assign`)

export const acceptTicket = (id: number) =>
  client.post<Ticket>(`/tickets/${id}/accept`)

export const closeTicket = (id: number) =>
  client.post<Ticket>(`/tickets/${id}/close`)

export const getAdminTickets = (page: number = 1, limit: number = 20, status?: TicketStatus) =>
  client.get<AdminTicketsResponse>('/admin/tickets', {
    params: { page, limit, ...(status ? { status } : {}) },
  })
