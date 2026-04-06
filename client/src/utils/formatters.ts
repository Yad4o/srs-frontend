/**
 * Formatters - Date, confidence, score formatting utilities
 */

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

  return date.toLocaleDateString()
}

/**
 * Format a date to ISO string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format confidence score as percentage
 */
export const formatConfidence = (value: number | null): string => {
  if (value === null) return '—'
  return `${Math.round(value * 100)}%`
}

/**
 * Get confidence level category
 */
export const getConfidenceLevel = (value: number | null): 'high' | 'mid' | 'low' | 'unknown' => {
  if (value === null) return 'unknown'
  if (value >= 0.75) return 'high'
  if (value >= 0.5) return 'mid'
  return 'low'
}

/**
 * Format quality score
 */
export const formatQualityScore = (value: number | null): string => {
  if (value === null) return '—'
  return (value * 100).toFixed(0) + '%'
}

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`
}

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, length: number = 80): string => {
  if (text.length <= length) return text
  return text.substring(0, length) + '…'
}
