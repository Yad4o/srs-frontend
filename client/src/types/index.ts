/**
 * SRS Frontend - Type Definitions
 * All shared TypeScript types that mirror backend schemas
 */

export type UserRole = 'user' | 'agent' | 'admin'

export interface User {
  id: number
  email: string
  role: UserRole
  created_at?: string
}

export interface AuthToken {
  access_token: string
  token_type: string
}

export type TicketStatus = 'open' | 'auto_resolved' | 'escalated' | 'in_progress' | 'closed'
export type ResponseSource = 'similarity' | 'openai' | 'template' | 'fallback'
export type IntentCategory =
  | 'login_issue'
  | 'payment_issue'
  | 'account_issue'
  | 'technical_issue'
  | 'feature_request'
  | 'general_query'
  | 'unknown'

export interface Ticket {
  id: number
  message: string
  intent: IntentCategory | null
  sub_intent: string | null
  confidence: number | null
  status: TicketStatus
  response: string | null
  response_source: ResponseSource | null
  quality_score: number | null
  user_id: number | null
  assigned_agent_id: number | null
  created_at: string
  updated_at?: string
}

export interface TicketList {
  tickets: Ticket[]
}

export interface Feedback {
  id: number
  ticket_id: number
  rating: number
  resolved: boolean
  created_at: string
}

export interface AdminMetrics {
  tickets: {
    total: number
    by_status: Record<TicketStatus, number>
    auto_resolve_rate: number
    escalation_rate: number
    open: number
    auto_resolved: number
    escalated: number
    unassigned_escalated: number
  }
  feedback: {
    total: number
    average_rating: number
    resolution_rate: number
    resolved_count: number
  }
  quality: {
    low_quality_count: number
    by_intent: Record<string, number>
  }
  system_health: {
    auto_resolve_rate_status: 'good' | 'needs_improvement'
    escalation_rate_status: 'good' | 'needs_improvement'
    feedback_coverage: number
  }
}

export interface AdminTicketsResponse {
  tickets: Ticket[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
  filters: {
    status: TicketStatus | null
  }
}

export interface PipelineStep {
  label: string
  duration: number
  completed?: boolean
}

export interface TicketSubmissionResult {
  ticket: Ticket
  feedback?: Feedback
}
