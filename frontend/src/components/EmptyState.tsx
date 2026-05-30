import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  title: string
  message?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, message, icon, action }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-7 h-7 text-text-muted" />}
      </div>
      <h3 className="text-base font-semibold text-text mb-1">{title}</h3>
      {message && <p className="text-sm text-text-secondary max-w-xs">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  )
}