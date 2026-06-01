import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { useEffect } from 'react'
import { useAppStore } from '@/store/appStore'

export default function App() {
  const { theme } = useAppStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return <RouterProvider router={router} />
} 