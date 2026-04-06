/**
 * Landing Page - Public marketing page
 */

import { Link, useLocation } from 'wouter'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Brain, BarChart3 } from 'lucide-react'

export default function Landing() {
  const { isAuthenticated } = useAuth()
  const [, navigate] = useLocation()

  if (isAuthenticated) {
    navigate('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-bg-surface/80 backdrop-blur border-b border-bg-border z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">SRS Support</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <a className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors">
                Sign In
              </a>
            </Link>
            <Link href="/register">
              <a>
                <Button>Get Started</Button>
              </a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-green via-accent-blue to-accent-purple bg-clip-text text-transparent">
            Support, on autopilot.
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            AI-powered support system that classifies tickets, searches for similar cases, and generates responses in milliseconds.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <a>
                <Button size="lg">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </Link>
            <button className="px-6 py-3 border border-bg-border rounded-lg hover:bg-bg-surface transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-bg-surface">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Submit',
                description: 'Users submit their support tickets with detailed descriptions',
                icon: '📝',
              },
              {
                step: '2',
                title: 'Classify',
                description: 'AI analyzes and classifies the ticket intent with confidence scoring',
                icon: '🧠',
              },
              {
                step: '3',
                title: 'Resolve',
                description: 'System generates responses or escalates to human agents',
                icon: '✅',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-16 px-6 border-y border-bg-border">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="font-mono text-3xl text-accent-green font-bold">&lt; 200ms</p>
            <p className="text-text-secondary text-sm mt-2">Response Time</p>
          </div>
          <div>
            <p className="font-mono text-3xl text-accent-blue font-bold">0.75</p>
            <p className="text-text-secondary text-sm mt-2">Confidence Threshold</p>
          </div>
          <div>
            <p className="font-mono text-3xl text-accent-amber font-bold">6</p>
            <p className="text-text-secondary text-sm mt-2">Intent Categories</p>
          </div>
          <div>
            <p className="font-mono text-3xl text-accent-purple font-bold">4</p>
            <p className="text-text-secondary text-sm mt-2">Response Sources</p>
          </div>
        </div>
      </section>

      {/* Intent Categories */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16">Intent Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Login Issue', color: 'bg-blue-500/20 text-blue-300', subs: ['Two-Factor Auth', 'Password Reset'] },
              { name: 'Payment Issue', color: 'bg-amber-500/20 text-amber-300', subs: ['Billing', 'Refund'] },
              { name: 'Account Issue', color: 'bg-purple-500/20 text-purple-300', subs: ['Profile', 'Settings'] },
              { name: 'Technical Issue', color: 'bg-red-500/20 text-red-300', subs: ['Error', 'Performance'] },
              { name: 'Feature Request', color: 'bg-emerald-500/20 text-emerald-300', subs: ['Enhancement'] },
              { name: 'General Query', color: 'bg-slate-500/20 text-slate-300', subs: ['FAQ', 'Info'] },
            ].map((intent) => (
              <div key={intent.name} className={`p-6 rounded-lg border border-bg-border ${intent.color} hover:border-accent-blue transition-all`}>
                <h4 className="font-semibold mb-2">{intent.name}</h4>
                <div className="text-xs opacity-75">
                  {intent.subs.map((sub) => (
                    <div key={sub}>{sub}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to transform your support?</h3>
          <p className="text-text-secondary mb-8">
            Join teams using SRS to automate their support operations and improve response times.
          </p>
          <Link href="/register">
            <a>
              <Button size="lg">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-bg-border text-center text-text-secondary text-sm">
        <p>© 2026 SRS Support Portal. Built with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  )
}
