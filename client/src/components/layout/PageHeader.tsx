/**
 * PageHeader - Page title and description header, rendered as a compact
 * glass banner with an optional bleeding background image so every
 * authenticated page shares the landing page's cinematic feel.
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
  /** Optional accent image (e.g. /images/shield.png) bled in from the right edge */
  image?: string
}

export function PageHeader({ title, description, action, className, image }: PageHeaderProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl border border-bg-border/70 bg-bg-surface/40 backdrop-blur-xl mb-8 p-6',
      className
    )}>
      {image && (
        <img
          src={image}
          alt=""
          className="pointer-events-none absolute right-0 top-0 h-full w-64 object-cover opacity-[0.16]"
          style={{
            maskImage: 'linear-gradient(to left, black 0%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to left, black 0%, transparent 80%)',
          }}
        />
      )}
      <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display text-text-primary mb-1.5 tracking-tight">{title}</h1>
          {description && <p className="text-text-secondary text-sm">{description}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  )
}
