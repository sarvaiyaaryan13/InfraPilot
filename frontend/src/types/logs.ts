export type LogSeverity = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogEntry {
  id: string
  timestamp: string
  severity: LogSeverity
  service: string
  deploymentId: string
  message: string
  metadata?: Record<string, unknown>
  traceId?: string
}

export interface LogFilters {
  search: string
  severity: LogSeverity | 'all'
  service: string | 'all'
  deploymentId: string | 'all'
  startTime?: string
  endTime?: string
}