/**
 * Admin API - Admin metrics and management endpoints
 */

import client from './client'
import type { AdminMetrics } from '@/types'

export const getMetrics = () =>
  client.get<AdminMetrics>('/admin/metrics')
