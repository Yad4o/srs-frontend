/**
 * useTickets - Ticket queries hook
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as ticketsApi from '@/api/tickets'
import type { TicketStatus } from '@/types'

export const useTickets = (status?: TicketStatus) => {
  return useQuery({
    queryKey: ['tickets', status],
    queryFn: () => ticketsApi.listTickets(status),
    select: (data) => data.data.tickets,
  })
}

export const useTicket = (id: number) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketsApi.getTicket(id),
    select: (data) => data.data,
  })
}

export const useCreateTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (message: string) => ticketsApi.createTicket(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}

export const useAssignTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ticketsApi.assignTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}

export const useCloseTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ticketsApi.closeTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}

export const useAdminTickets = (page: number = 1, limit: number = 20, status?: TicketStatus) => {
  return useQuery({
    queryKey: ['admin-tickets', page, limit, status],
    queryFn: () => ticketsApi.getAdminTickets(page, limit, status),
    select: (data) => data.data,
  })
}
