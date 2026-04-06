/**
 * ConfidenceBar - Horizontal gradient bar showing confidence score
 * Color shifts: green (high) → amber (mid) → red (low)
 */

import { getConfidenceLevel, formatConfidence } from '@/utils/formatters'
import { cn } from '@/lib/utils'

interface ConfidenceBarProps {
  value: number | null
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ConfidenceBar({
  value,
  showLabel = true,
  size = 'md',
  className,
}: ConfidenceBarProps) {
  if (value === null) {
    return <div className="text-text-muted text-sm">No confidence data</div>
  }

  const level = getConfidenceLevel(value)
  const percentage = Math.round(value * 100)

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  const getGradientColor = () => {
    if (value >= 0.75) return 'bg-gradient-to-r from-green-500 to-green-400'
    if (value >= 0.5) return 'bg-gradient-to-r from-amber-500 to-amber-400'
    return 'bg-gradient-to-r from-red-500 to-red-400'
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="relative w-full bg-bg-border rounded overflow-hidden">
        <div
          className={cn('transition-all duration-300', sizeClasses[size], getGradientColor())}
          style={{ width: `${percentage}%` }}
        />
        {/* Threshold marker at 0.75 */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/30"
          style={{ left: '75%' }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-text-secondary">{level === 'high' ? 'High' : level === 'mid' ? 'Medium' : 'Low'}</span>
          <span className="font-mono text-text-primary">{formatConfidence(value)}</span>
        </div>
      )}
    </div>
  )
}
