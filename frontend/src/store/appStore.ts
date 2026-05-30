import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Deployment, Notification, LogEntry, MonitoringFilters, TimeRange } from '@/types'
import { mockDeployments, mockNotifications, mockLogs } from '@/utils/mockData'

interface AppStore {
  // Theme
  theme: 'light' | 'dark'
  toggleTheme: () => void

  // Sidebar
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void

  // Deployments
  deployments: Deployment[]
  setDeployments: (deployments: Deployment[]) => void
  addDeployment: (deployment: Deployment) => void
  updateDeployment: (id: string, updates: Partial<Deployment>) => void
  removeDeployment: (id: string) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void
  unreadCount: number

  // Logs
  logs: LogEntry[]
  addLog: (log: LogEntry) => void
  clearLogs: () => void

  // Monitoring
  monitoringFilters: MonitoringFilters
  setMonitoringFilters: (filters: Partial<MonitoringFilters>) => void
  setTimeRange: (range: TimeRange) => void

  // Command Palette
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  // Global loading
  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      sidebarCollapsed: false,
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      deployments: mockDeployments,
      setDeployments: (deployments) => set({ deployments }),
      addDeployment: (deployment) =>
        set((state) => ({ deployments: [deployment, ...state.deployments] })),
      updateDeployment: (id, updates) =>
        set((state) => ({
          deployments: state.deployments.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),
      removeDeployment: (id) =>
        set((state) => ({ deployments: state.deployments.filter((d) => d.id !== id) })),

      notifications: mockNotifications,
      addNotification: (notification) =>
        set((state) => ({ notifications: [notification, ...state.notifications] })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearNotifications: () => set({ notifications: [] }),
      get unreadCount() {
        return get().notifications.filter((n) => !n.read).length
      },

      logs: mockLogs,
      addLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 500) })),
      clearLogs: () => set({ logs: [] }),

      monitoringFilters: {
        timeRange: '24h',
      },
      setMonitoringFilters: (filters) =>
        set((state) => ({ monitoringFilters: { ...state.monitoringFilters, ...filters } })),
      setTimeRange: (timeRange) =>
        set((state) => ({ monitoringFilters: { ...state.monitoringFilters, timeRange } })),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),

      globalLoading: false,
      setGlobalLoading: (globalLoading) => set({ globalLoading }),
    }),
    {
      name: 'infrapilot-app',
      partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
)