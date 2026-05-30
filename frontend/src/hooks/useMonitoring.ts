import { useState, useEffect } from 'react'
import { SystemMetrics, TimeRange } from '@/types'
import { mockMetrics } from '@/utils/mockData'

export function useMonitoring(timeRange: TimeRange = '24h') {
  const [metrics, setMetrics] = useState<SystemMetrics>(mockMetrics)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      // Simulate fresh data for different time ranges
      setMetrics({
        ...mockMetrics,
        cpu: {
          ...mockMetrics.cpu,
          current: 40 + Math.random() * 20,
        },
        memory: {
          ...mockMetrics.memory,
          current: 60 + Math.random() * 15,
        },
      })
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [timeRange])

  // Live update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          current: Math.max(5, Math.min(95, prev.cpu.current + (Math.random() - 0.5) * 8)),
        },
        memory: {
          ...prev.memory,
          current: Math.max(20, Math.min(95, prev.memory.current + (Math.random() - 0.5) * 4)),
        },
        requestsPerMinute: Math.floor(2000 + Math.random() * 2000),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return { metrics, isLoading, error }
}