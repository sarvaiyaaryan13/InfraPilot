export interface MetricPoint {
  timestamp: string
  value: number
}

export interface MetricSeries {
  name: string
  data: MetricPoint[]
  unit: string
  current: number
  min: number
  max: number
  avg: number
}

export interface SystemMetrics {
  cpu: MetricSeries
  memory: MetricSeries
  network: {
    in: MetricSeries
    out: MetricSeries
  }
  disk: MetricSeries
  responseTime: MetricSeries
  errorRate: MetricSeries
  uptime: number
  requestsPerMinute: number
}

export interface MonitoringFilters {
  timeRange: '1h' | '6h' | '24h' | '7d' | '30d'
  deploymentId?: string
  serviceId?: string
}