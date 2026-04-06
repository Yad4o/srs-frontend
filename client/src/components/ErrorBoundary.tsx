import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-bg-base">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle size={48} className="text-accent-red mb-6 flex-shrink-0" />

            <h2 className="text-xl text-text-primary mb-4">An unexpected error occurred.</h2>

            <div className="p-4 w-full rounded bg-bg-surface border border-bg-border overflow-auto mb-6">
              <pre className="text-sm text-text-muted whitespace-break-spaces font-mono">
                {this.state.error?.stack}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-blue text-bg-base hover:bg-accent-blue/90 cursor-pointer transition-colors"
            >
              <RotateCcw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
