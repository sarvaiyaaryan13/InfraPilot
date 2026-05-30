import { ReactNode, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  trend?: number
  trendLabel?: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  animate?: boolean
  onClick?: () => void
}

const colorClasses = {
  blue: 'bg-blue-50 text-primary',
  green: 'bg-green-50 text-success',
  red: 'bg-red-50 text-error',
  yellow: 'bg-amber-50 text-warning',
  purple: 'bg-purple-50 text-purple-600',
}

function CountUp({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let startTime: number
    let animFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.floor(eased * target))
      if (progress < 1) {
        animFrame = requestAnimationFrame(animate)
      }
    }

    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [target, duration])

  return <>{current}</>
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  color = 'blue',
  animate = true,
  onClick,
}: MetricCardProps) {
  const isNumeric = typeof value === 'number'

  return (
    <motion.div
      className={`metric-card ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-text-secondary'
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : trend < 0 ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-text mb-0.5">
          {animate && isNumeric ? (
            <CountUp target={value as number} />
          ) : (
            value
          )}
        </div>
        <div className="text-sm text-text-secondary">{title}</div>
        {subtitle && <div className="text-xs text-text-muted mt-1">{subtitle}</div>}
        {trendLabel && <div className="text-xs text-text-muted mt-1">{trendLabel}</div>}
      </div>
    </motion.div>
  )
}