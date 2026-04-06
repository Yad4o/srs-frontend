/**
 * ResponseSourceTag - Shows how the response was generated
 */

import { cn } from '@/lib/utils'
import type { ResponseSource } from '@/types'

interface ResponseSourceTagProps {
  source: ResponseSource | null
  className?: string
}

const sourceConfig: Record<ResponseSource, { label: string; color: string; icon: string }> = {
  similarity: {
    label: 'Similar Case',
    color: 'text-green-400',
    icon: '⟳',
  },
  openai: {
    label: 'AI Generated',
    color: 'text-purple-400',
    icon: '✦',
  },
  template: {
    label: 'Template',
    color: 'text-blue-400',
    icon: '▦',
  },
  fallback: {
    label: 'Fallback',
    color: 'text-zinc-400',
    icon: '○',
  },
}

export function ResponseSourceTag({ source, className }: ResponseSourceTagProps) {
  if (!source) {
    return <span className="text-text-muted text-xs">Unknown source</span>
  }

  const config = sourceConfig[source]

  return (
    <div className={cn('inline-flex items-center gap-1.5 text-xs', className)}>
      <span className={config.color}>{config.icon}</span>
      <span className="text-text-secondary">{config.label}</span>
    </div>
  )
}
