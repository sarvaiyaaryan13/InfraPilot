import { Sun, Moon } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useAppStore()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-text-secondary hover:text-text hover:bg-slate-100 transition-colors"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  )
}