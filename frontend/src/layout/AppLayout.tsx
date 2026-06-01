import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'
import { CommandPalette } from '@/components/CommandPalette'

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <motion.div
            className="p-6 max-w-[1400px] mx-auto"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            key={location.pathname}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}