import { AlertTriangle, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content.',
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-error" />
      </div>
      <h3 className="text-base font-semibold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-xs mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </motion.div>
  )
}