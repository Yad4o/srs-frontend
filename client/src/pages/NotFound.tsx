/**
 * NotFound Page - 404 error page
 */

import { Link } from 'wouter'
import { Button } from '@/components/ui/button'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-16 h-16 text-accent-red" />
        </div>
        <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-secondary mb-2">Page not found</h2>
        <p className="text-text-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <a>
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </a>
        </Link>
      </div>
    </div>
  )
}
