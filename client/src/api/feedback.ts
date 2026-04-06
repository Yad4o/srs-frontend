/**
 * Feedback API - Feedback submission endpoints
 */

import client from './client'
import type { Feedback } from '@/types'

export const submitFeedback = (ticket_id: number, rating: number, resolved: boolean) =>
  client.post<Feedback>(`/tickets/${ticket_id}/feedback`, { rating, resolved })

export const getFeedback = (ticket_id: number) =>
  client.get<Feedback>(`/tickets/${ticket_id}/feedback`)
