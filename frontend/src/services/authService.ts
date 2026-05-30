import { LoginCredentials, RegisterCredentials, User } from '@/types'

const mockUser: User = {
  id: 'user-001',
  name: 'Sarah Chen',
  email: 'sarah@infrapilot.app',
  role: 'admin',
  createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
  teamId: 'team-001',
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (credentials.email && credentials.password.length >= 6) {
      return {
        user: { ...mockUser, email: credentials.email },
        token: 'mock-jwt-token-' + Date.now(),
      }
    }
    throw new Error('Invalid email or password')
  },

  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match')
    }
    if (credentials.password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }
    return {
      user: {
        ...mockUser,
        name: credentials.name,
        email: credentials.email,
        id: 'user-' + Date.now(),
      },
      token: 'mock-jwt-token-' + Date.now(),
    }
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))
  },
}