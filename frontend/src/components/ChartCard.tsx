import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export function ChartCard({ title, subtitle, children, actions, className = '' }: ChartCardProps) {
  return (
    <motion.div
      className={`card p-5 ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text">{title}</h3>
          {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </motion.div>
  )
}