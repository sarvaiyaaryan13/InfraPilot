import { motion } from 'framer-motion'
import { Check, X, Loader2, Clock } from 'lucide-react'
import { PipelineStage } from '@/types'
import { formatDuration } from '@/utils/helpers'

interface DeployStepperProps {
  stages: PipelineStage[]
}

const statusConfig = {
  pending: { icon: <Clock className="w-4 h-4" />, color: 'text-text-muted', bg: 'bg-slate-100', label: 'Pending' },
  running: { icon: <Loader2 className="w-4 h-4 animate-spin" />, color: 'text-primary', bg: 'bg-blue-100', label: 'Running' },
  success: { icon: <Check className="w-4 h-4" />, color: 'text-success', bg: 'bg-green-100', label: 'Complete' },
  failed: { icon: <X className="w-4 h-4" />, color: 'text-error', bg: 'bg-red-100', label: 'Failed' },
  skipped: { icon: <Clock className="w-4 h-4" />, color: 'text-text-muted', bg: 'bg-slate-50', label: 'Skipped' },
}

export function DeployStepper({ stages }: DeployStepperProps) {
  return (
    <div className="space-y-2">
      {stages.map((stage, index) => {
        const config = statusConfig[stage.status]
        const isLast = index === stages.length - 1

        return (
          <div key={stage.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg} ${config.color}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {config.icon}
              </motion.div>
              {!isLast && (
                <div className={`w-0.5 flex-1 mt-1 rounded ${stage.status === 'success' ? 'bg-green-200' : 'bg-slate-200'}`} style={{ minHeight: 16 }} />
              )}
            </div>
            <motion.div
              className="flex-1 pb-4"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${stage.status === 'pending' || stage.status === 'skipped' ? 'text-text-secondary' : 'text-text'}`}>
                  {stage.name}
                </span>
                <div className="flex items-center gap-2">
                  {stage.duration !== undefined && stage.duration > 0 && (
                    <span className="text-xs text-text-muted">{formatDuration(stage.duration)}</span>
                  )}
                  <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                </div>
              </div>
              {stage.status === 'running' && (
                <div className="mt-2 h-1 bg-blue-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: ['20%', '80%', '20%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}