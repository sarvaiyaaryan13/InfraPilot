import { SystemMetrics, TimeRange } from '@/types'
import { mockMetrics } from '@/utils/mockData'

export const monitoringService = {
  async getMetrics(_timeRange: TimeRange): Promise<SystemMetrics> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return mockMetrics
  },
}