/**
 * Resolve API - the free, public, no-login endpoint.
 *
 * Unlike the rest of client/src/api/*, this never needs a token and
 * never touches ticket history - it's a single stateless call.
 */

import client from './client'
import type { IntentCategory, ResponseSource } from '@/types'

export interface ResolveResult {
  intent: IntentCategory | null
  sub_intent: string | null
  confidence: number | null
  sentiment: string | null
  sentiment_confidence: number | null
  decision: 'AUTO_RESOLVE' | 'ESCALATE'
  response: string | null
  response_source: ResponseSource | null
}

export const resolveMessage = (message: string) =>
  client.post<ResolveResult>('/resolve', { message })
