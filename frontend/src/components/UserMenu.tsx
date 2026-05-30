import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface UserMenuProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

export function UserMenu({ isOpen, onToggle, onClose }: UserMenuProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-xs font-medium text-text leading-none">{user?.name}</div>
          <div className="text-xs text-text-muted mt-0.5">{user?.role}</div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-border z-50 py-1"
          >
            <div className="px-3 py-2.5 border-b border-border">
              <div className="text-sm font-medium text-text">{user?.name}</div>
              <div className="text-xs text-text-secondary">{user?.email}</div>
            </div>
            <div className="py-1">
              <button
                onClick={() => { navigate('/settings'); onClose() }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:text-text hover:bg-slate-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={() => { navigate('/settings'); onClose() }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:text-text hover:bg-slate-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
            </div>
            <div className="border-t border-border pt-1 pb-1">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-error hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}