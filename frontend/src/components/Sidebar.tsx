import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Rocket, Box, BarChart2, FileSearch,
  Settings, ChevronLeft, ChevronRight, X
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Deploy', icon: Rocket, href: '/deploy' },
  { label: 'Deployments', icon: Box, href: '/deployments' },
  { label: 'Monitoring', icon: BarChart2, href: '/monitoring' },
  { label: 'Logs', icon: FileSearch, href: '/logs' },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

function SidebarContent({ collapsed, onMobileClose }: { collapsed: boolean; onMobileClose?: () => void }) {
  const location = useLocation()
  const { toggleSidebar } = useAppStore()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center h-[60px] px-4 border-b border-border flex-shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 10L8 3L13 10H3Z" fill="white" opacity="0.9" />
                <path d="M5 10L8 6L11 10H5Z" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-sm text-text tracking-tight">InfraPilot</span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 10L8 3L13 10H3Z" fill="white" opacity="0.9" />
              <path d="M5 10L8 6L11 10H5Z" fill="white" />
            </svg>
          </div>
        )}
        {onMobileClose && (
          <button onClick={onMobileClose} className="p-1 rounded-lg hover:bg-slate-100 text-text-secondary lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onMobileClose}
              className={`sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:flex border-t border-border p-2">
        <button
          onClick={toggleSidebar}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-text-secondary hover:text-text hover:bg-slate-50 transition-colors text-sm w-full ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </div>
  )
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { sidebarCollapsed } = useAppStore()

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        className="hidden lg:flex flex-col bg-sidebar border-r border-border flex-shrink-0 h-screen sticky top-0"
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-border z-50 lg:hidden flex flex-col"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <SidebarContent collapsed={false} onMobileClose={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}