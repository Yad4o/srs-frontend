/**
 * useFeedback - Feedback queries hook
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as feedbackApi from '@/api/feedback'

export const useFeedback = (ticketId: number) => {
  return useQuery({
    queryKey: ['feedback', ticketId],
    queryFn: () => feedbackApi.getFeedback(ticketId),
    select: (data) => data.data,
  })
}

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, rating, resolved }: { ticketId: number; rating: number; resolved: boolean }) =>
      feedbackApi.submitFeedback(ticketId, rating, resolved),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['feedback', variables.ticketId] })
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.ticketId] })
    },
  })
}
