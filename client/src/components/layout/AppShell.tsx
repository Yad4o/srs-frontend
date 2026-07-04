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
    <div className="relative flex h-screen bg-bg-base text-text-primary overflow-hidden">
      {/* Ambient background — same cinematic language as the landing/auth pages */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <img
          src="/images/bridge.png"
          alt=""
          className="absolute right-0 top-0 h-full w-[40%] object-cover opacity-[0.08]"
          style={{ maskImage: 'linear-gradient(to left, black 0%, transparent 75%)', WebkitMaskImage: 'linear-gradient(to left, black 0%, transparent 75%)' }}
        />
        <div className="absolute -top-24 -left-24 w-[32rem] h-[32rem] rounded-full bg-accent-blue blur-[160px] opacity-[0.09]" />
        <div className="absolute top-1/3 right-0 w-[28rem] h-[28rem] rounded-full bg-fuchsia-500 blur-[160px] opacity-[0.07]" />
        <div className="absolute bottom-0 left-1/3 w-[26rem] h-[26rem] rounded-full bg-accent-green blur-[150px] opacity-[0.05]" />
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
