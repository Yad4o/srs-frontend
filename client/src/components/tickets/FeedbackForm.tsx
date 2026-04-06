/**
 * FeedbackForm - Form for submitting ticket feedback
 */

import { useState } from 'react'
import { StarRating } from '@/components/ui/StarRating'
import { Button } from '@/components/ui/button'
import { useSubmitFeedback } from '@/hooks/useFeedback'
import { toast } from 'sonner'

interface FeedbackFormProps {
  ticketId: number
  onSuccess?: () => void
}

export function FeedbackForm({ ticketId, onSuccess }: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [resolved, setResolved] = useState(true)
  const { mutate: submitFeedback, isPending } = useSubmitFeedback()

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    submitFeedback(
      { ticketId, rating, resolved },
      {
        onSuccess: () => {
          toast.success('Feedback submitted')
          onSuccess?.()
        },
        onError: () => {
          toast.error('Failed to submit feedback')
        },
      }
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          How would you rate this response?
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={resolved}
            onChange={(e) => setResolved(e.target.checked)}
            className="w-4 h-4 rounded border-bg-border bg-bg-raised"
          />
          <span className="text-sm text-text-secondary">This resolved my issue</span>
        </label>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </div>
  )
}
