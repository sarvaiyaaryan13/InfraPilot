import { mockServices } from '@/utils/mockData'
import { motion } from 'framer-motion'

export function HealthStatus() {
  const services = mockServices
  const running = services.filter((s) => s.status === 'running').length
  const total = services.length
  const allHealthy = running === total

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text">System Health</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            allHealthy ? 'bg-green-50 text-success' : 'bg-amber-50 text-warning'
          }`}
        >
          {allHealthy ? 'All Systems Operational' : 'Degraded'}
        </span>
      </div>
      <div className="space-y-3">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className={`status-dot ${service.status}`} />
              <span className="text-sm text-text">{service.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span>{service.uptime.toFixed(2)}%</span>
              <span>{service.instances} inst</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}