import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Rocket, BarChart2, FileSearch, Settings, LayoutDashboard, Box, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'

const commands = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, href: '/dashboard', group: 'Navigation' },
  { id: 'deploy', label: 'New Deployment', icon: <Rocket className="w-4 h-4" />, href: '/deploy', group: 'Actions' },
  { id: 'deployments', label: 'View Deployments', icon: <Box className="w-4 h-4" />, href: '/deployments', group: 'Navigation' },
  { id: 'monitoring', label: 'Open Monitoring', icon: <BarChart2 className="w-4 h-4" />, href: '/monitoring', group: 'Navigation' },
  { id: 'logs', label: 'View Logs', icon: <FileSearch className="w-4 h-4" />, href: '/logs', group: 'Navigation' },
  { id: 'settings', label: 'Open Settings', icon: <Settings className="w-4 h-4" />, href: '/settings', group: 'Navigation' },
]

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
      if (e.key === 'Escape') setCommandPaletteOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleSelect = (href: string) => {
    navigate(href)
    setCommandPaletteOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex].href)
    }
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search commands, pages, deployments..."
                className="flex-1 text-sm text-text placeholder:text-text-muted bg-transparent outline-none"
              />
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">ESC</kbd>
              </div>
            </div>
            <div className="py-2 max-h-72 overflow-y-auto scrollbar-thin">
              {filtered.length === 0 ? (
                <div className="text-center py-8 text-sm text-text-secondary">No results found</div>
              ) : (
                filtered.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd.href)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${i === selectedIndex ? 'bg-blue-50 text-primary' : 'text-text hover:bg-slate-50'}`}
                  >
                    <span className={i === selectedIndex ? 'text-primary' : 'text-text-secondary'}>{cmd.icon}</span>
                    {cmd.label}
                    <span className="ml-auto text-xs text-text-muted">{cmd.group}</span>
                  </button>
                ))
              )}
            </div>
            <div className="px-4 py-2.5 border-t border-border bg-slate-50 flex items-center gap-3 text-xs text-text-muted">
              <span><kbd className="px-1.5 py-0.5 bg-white rounded border border-border">↑↓</kbd> navigate</span>
              <span><kbd className="px-1.5 py-0.5 bg-white rounded border border-border">↵</kbd> select</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}