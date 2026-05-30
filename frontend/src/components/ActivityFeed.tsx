import { motion } from 'framer-motion'
import { Rocket, AlertTriangle, RotateCcw, Settings, CheckCircle } from 'lucide-react'
import { mockActivityFeed } from '@/utils/mockData'
import { formatRelativeTime } from '@/utils/helpers'

const typeConfig = {
  deployment: { icon: <Rocket className="w-3.5 h-3.5" />, color: 'text-primary bg-blue-50' },
  alert: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-warning bg-amber-50' },
  rollback: { icon: <RotateCcw className="w-3.5 h-3.5" />, color: 'text-error bg-red-50' },
  config: { icon: <Settings className="w-3.5 h-3.5" />, color: 'text-text-secondary bg-slate-100' },
  success: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'text-success bg-green-50' },
}

export function ActivityFeed() {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-text mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {mockActivityFeed.map((item, i) => {
          const config = typeConfig[item.type as keyof typeof typeConfig] || typeConfig.config
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex gap-3"
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${config.color}`}>
                {config.icon}
              </div>
              <div>
                <p className="text-xs text-text leading-relaxed">{item.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-muted">{item.user}</span>
                  <span className="text-text-muted">·</span>
                  <span className="text-xs text-text-muted">{formatRelativeTime(item.timestamp)}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}