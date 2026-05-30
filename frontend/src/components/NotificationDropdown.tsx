import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, CheckCheck, X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { Notification } from '@/types'
import { formatRelativeTime } from '@/utils/helpers'

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
}

const typeIcons = {
  success: <CheckCircle className="w-4 h-4 text-success" />,
  error: <XCircle className="w-4 h-4 text-error" />,
  warning: <AlertTriangle className="w-4 h-4 text-warning" />,
  info: <Info className="w-4 h-4 text-info" />,
}

function NotificationItem({ notification }: { notification: Notification }) {
  const { markNotificationRead } = useAppStore()

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
      onClick={() => markNotificationRead(notification.id)}
    >
      <div className="mt-0.5 flex-shrink-0">{typeIcons[notification.type]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-xs font-medium text-text leading-snug ${!notification.read ? 'font-semibold' : ''}`}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{notification.message}</p>
        <p className="text-xs text-text-muted mt-1">{formatRelativeTime(notification.timestamp)}</p>
      </div>
    </motion.div>
  )
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { notifications, markAllNotificationsRead, unreadCount } = useAppStore()
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

  return (
    <div ref={ref} className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-border z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold text-text">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-text-secondary">{unreadCount} unread</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-primary hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
                <button onClick={onClose} className="text-text-muted hover:text-text">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin p-2 space-y-1">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-sm text-text-secondary">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-text-muted" />
                  No notifications
                </div>
              ) : (
                notifications.map((n) => <NotificationItem key={n.id} notification={n} />)
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}