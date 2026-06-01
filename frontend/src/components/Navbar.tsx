import { useState } from 'react'
import { Menu, Bell, Search } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { NotificationDropdown } from './NotificationDropdown'
import { UserMenu } from './UserMenu'
import { ThemeSwitcher } from './ThemeSwitcher'

interface NavbarProps {
  onMobileMenuToggle: () => void
}

export function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const { unreadCount, setCommandPaletteOpen } = useAppStore()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="h-[60px] bg-white border-b border-border flex items-center px-4 gap-3 flex-shrink-0 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text hover:bg-slate-100 transition-colors"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Search trigger */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-border rounded-lg text-sm text-text-muted hover:bg-slate-100 hover:border-slate-300 transition-colors flex-1 max-w-xs"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search or jump to...</span>
        <kbd className="ml-auto text-xs bg-white border border-border rounded px-1.5 py-0.5 font-mono hidden sm:inline">⌘K</kbd>
      </button>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <ThemeSwitcher />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false) }}
            className="relative p-2 rounded-lg text-text-secondary hover:text-text hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* User menu */}
        <UserMenu
          isOpen={userMenuOpen}
          onToggle={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false) }}
          onClose={() => setUserMenuOpen(false)}
        />
      </div>
    </header>
  )
}