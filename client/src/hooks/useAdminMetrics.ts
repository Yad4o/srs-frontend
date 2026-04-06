/**
 * useAdminMetrics - Admin metrics queries hook
 */

import { useQuery } from '@tanstack/react-query'
import * as adminApi from '@/api/admin'

export const useAdminMetrics = () => {
  return useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => adminApi.getMetrics(),
    select: (data) => data.data,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  })
}
