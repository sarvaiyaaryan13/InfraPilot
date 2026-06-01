import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-8xl font-bold text-slate-200 mb-4 leading-none">404</div>
        <h1 className="text-xl font-bold text-text mb-2">Page not found</h1>
        <p className="text-sm text-text-secondary mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  )
}