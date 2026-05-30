import { useNavigate } from 'react-router-dom'
import { Rocket, FileSearch, BarChart2, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const actions = [
  { label: 'New Deploy', icon: <Rocket className="w-4 h-4" />, href: '/deploy', color: 'text-primary bg-blue-50 hover:bg-blue-100' },
  { label: 'View Logs', icon: <FileSearch className="w-4 h-4" />, href: '/logs', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
  { label: 'Monitoring', icon: <BarChart2 className="w-4 h-4" />, href: '/monitoring', color: 'text-success bg-green-50 hover:bg-green-100' },
  { label: 'Settings', icon: <Settings className="w-4 h-4" />, href: '/settings', color: 'text-text-secondary bg-slate-100 hover:bg-slate-200' },
]

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-text mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, i) => (
          <motion.button
            key={action.label}
            onClick={() => navigate(action.href)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${action.color}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {action.icon}
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}