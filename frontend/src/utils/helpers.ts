import { DeploymentStatus, LogSeverity } from '@/types'

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return `${seconds}s ago`
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function getStatusColor(status: DeploymentStatus): string {
  const colors: Record<DeploymentStatus, string> = {
    running: 'text-success',
    building: 'text-primary',
    stopped: 'text-text-secondary',
    failed: 'text-error',
    queued: 'text-warning',
    rolling_back: 'text-warning',
  }
  return colors[status] || 'text-text-secondary'
}

export function getStatusBgColor(status: DeploymentStatus): string {
  const colors: Record<DeploymentStatus, string> = {
    running: 'bg-green-50 text-green-700 border-green-200',
    building: 'bg-blue-50 text-blue-700 border-blue-200',
    stopped: 'bg-slate-50 text-slate-600 border-slate-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
    queued: 'bg-amber-50 text-amber-700 border-amber-200',
    rolling_back: 'bg-orange-50 text-orange-700 border-orange-200',
  }
  return colors[status] || 'bg-slate-50 text-slate-600 border-slate-200'
}

export function getSeverityColor(severity: LogSeverity): string {
  const colors: Record<LogSeverity, string> = {
    debug: 'text-slate-500',
    info: 'text-blue-600',
    warn: 'text-amber-600',
    error: 'text-red-600',
    fatal: 'text-red-700',
  }
  return colors[severity] || 'text-slate-500'
}

export function getSeverityBgColor(severity: LogSeverity): string {
  const colors: Record<LogSeverity, string> = {
    debug: 'bg-slate-50 text-slate-600',
    info: 'bg-blue-50 text-blue-700',
    warn: 'bg-amber-50 text-amber-700',
    error: 'bg-red-50 text-red-700',
    fatal: 'bg-red-100 text-red-800',
  }
  return colors[severity] || 'bg-slate-50 text-slate-600'
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function downloadText(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return function (...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}