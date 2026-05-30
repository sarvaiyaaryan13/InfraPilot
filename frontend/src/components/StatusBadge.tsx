import { DeploymentStatus } from '@/types'
import { getStatusBgColor } from '@/utils/helpers'
import { Loader2 } from 'lucide-react'

interface StatusBadgeProps {
  status: DeploymentStatus
  size?: 'sm' | 'md'
}

const statusLabels: Record<DeploymentStatus, string> = {
  running: 'Running',
  building: 'Building',
  stopped: 'Stopped',
  failed: 'Failed',
  queued: 'Queued',
  rolling_back: 'Rolling Back',
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colors = getStatusBgColor(status)
  const label = statusLabels[status]
  const isAnimated = status === 'building' || status === 'queued' || status === 'rolling_back'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${colors} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {isAnimated ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <span className={`status-dot ${status}`} />
      )}
      {label}
    </span>
  )
}