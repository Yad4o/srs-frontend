/**
 * PipelineAnimation - Shows AI pipeline steps animating in sequence
 */

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { PipelineStep } from '@/types'

interface PipelineAnimationProps {
  steps: PipelineStep[]
  className?: string
}

export function PipelineAnimation({ steps, className }: PipelineAnimationProps) {
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    if (completedCount >= steps.length) return

    const timer = setTimeout(() => {
      setCompletedCount((prev) => prev + 1)
    }, steps[completedCount]?.duration || 600)

    return () => clearTimeout(timer)
  }, [completedCount, steps])

  return (
    <div className={cn('space-y-3', className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-text-muted flex items-center justify-center">
            {index < completedCount ? (
              <span className="text-accent-green text-sm">✓</span>
            ) : index === completedCount ? (
              <div className="w-2 h-2 rounded-full bg-accent-blue animate-spin" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-text-muted" />
            )}
          </div>
          <span className={cn('text-sm', index < completedCount ? 'text-text-secondary' : 'text-text-primary')}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}
