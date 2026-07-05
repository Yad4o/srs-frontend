/**
 * AppShell - Main layout wrapper with sidebar and topbar
 */

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: ReactNode
  className?: string
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="relative flex h-screen bg-black text-text-primary overflow-hidden">
      {/* Real cinematic video background — same source as the landing hero, heavily dimmed/blurred so dense data stays fully legible */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-[0.14] blur-[1px] scale-105"
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-bg-base/85" />
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/[0.05] via-transparent to-fuchsia-500/[0.05]" />
        {/* Faint grid, echoes the hero section */}
        <div className="absolute inset-0 opacity-[0.03]">
          {[...Array(6)].map((_, i) => (
            <div key={`h-${i}`} className="absolute h-px bg-white" style={{ top: `${16.6 * (i + 1)}%`, left: 0, right: 0 }} />
          ))}
          {[...Array(8)].map((_, i) => (
            <div key={`v-${i}`} className="absolute w-px bg-white" style={{ left: `${12.5 * (i + 1)}%`, top: 0, bottom: 0 }} />
          ))}
        </div>
      </div>

      <Sidebar />
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className={cn('flex-1 overflow-auto', className)}>
          {children}
        </main>
      </div>
    </div>
  )
}
