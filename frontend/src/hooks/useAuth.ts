import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { LoginCredentials, RegisterCredentials } from '@/types'
import { authService } from '@/services/authService'

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, setLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true)
      try {
        const { user, token } = await authService.login(credentials)
        login(user, token)
        navigate('/dashboard')
        return { success: true }
      } catch (error) {
        setLoading(false)
        return { success: false, error: error instanceof Error ? error.message : 'Login failed' }
      }
    },
    [login, navigate, setLoading]
  )

  const handleRegister = useCallback(
    async (credentials: RegisterCredentials) => {
      setLoading(true)
      try {
        const { user, token } = await authService.register(credentials)
        login(user, token)
        navigate('/dashboard')
        return { success: true }
      } catch (error) {
        setLoading(false)
        return { success: false, error: error instanceof Error ? error.message : 'Registration failed' }
      }
    },
    [login, navigate, setLoading]
  )

  const handleLogout = useCallback(() => {
    logout()
    navigate('/login')
  }, [logout, navigate])

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }
}