import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Rocket, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function Login() {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('sarah@infrapilot.app')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await login({ email, password })
    if (!result.success && result.error) {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M3 10L8 3L13 10H3Z" fill="white" opacity="0.9" />
              <path d="M5 10L8 6L11 10H5Z" fill="white" />
            </svg>
          </div>
          <span className="font-bold text-lg text-text">InfraPilot</span>
        </div>

        <div className="card p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-text">Welcome back</h1>
            <p className="text-sm text-text-secondary mt-1">Sign in to your account</p>
          </div>

          {error && (
            <motion.div
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-4 h-4 text-error flex-shrink-0" />
              <p className="text-sm text-error">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 h-10 mt-2"
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-text-muted mt-4">
          Demo: any email + 6+ char password
        </p>
      </motion.div>
    </div>
  )
}