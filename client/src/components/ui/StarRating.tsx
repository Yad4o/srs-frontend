/**
 * StarRating - Five clickable stars for feedback submission
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value?: number
  onChange?: (rating: number) => void
  readOnly?: boolean
  className?: string
}

export function StarRating({ value = 0, onChange, readOnly = false, className }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0)

  const displayValue = hoverValue || value

  return (
    <div className={cn('flex gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(0)}
          className={cn(
            'text-2xl transition-all',
            star <= displayValue ? 'text-amber-400' : 'text-text-muted',
            !readOnly && 'cursor-pointer hover:scale-110'
          )}
        >
          ★
        </button>
      ))}
    </div>
  )
}
