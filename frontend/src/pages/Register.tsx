import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function Register() {
  const { register, isLoading } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await register(form)
    if (!result.success && result.error) {
      setError(result.error)
    }
  }

  const requirements = [
    { label: '8+ characters', met: form.password.length >= 8 },
    { label: 'Passwords match', met: form.password === form.confirmPassword && form.confirmPassword !== '' },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
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
            <h1 className="text-xl font-bold text-text">Create account</h1>
            <p className="text-sm text-text-secondary mt-1">Start deploying in minutes</p>
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
              <label className="label">Full name</label>
              <input type="text" value={form.name} onChange={handleChange('name')} className="input" placeholder="Jane Smith" required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={handleChange('email')} className="input" placeholder="you@company.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  className="input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  {requirements.map((r) => (
                    <div key={r.label} className="flex items-center gap-1.5">
                      <CheckCircle className={`w-3.5 h-3.5 ${r.met ? 'text-success' : 'text-text-muted'}`} />
                      <span className={`text-xs ${r.met ? 'text-success' : 'text-text-muted'}`}>{r.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="label">Confirm password</label>
              <input type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange('confirmPassword')} className="input" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 h-10 mt-2">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}