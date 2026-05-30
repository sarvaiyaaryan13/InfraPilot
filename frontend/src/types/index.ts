export * from './auth'
export * from './deployment'
export * from './monitoring'
export * from './logs'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  read: boolean
  timestamp: string
  deploymentId?: string
}

export interface Service {
  id: string
  name: string
  status: 'running' | 'stopped' | 'degraded' | 'starting'
  uptime: number
  instances: number
  region: string
  cpu: number
  memory: number
}

export interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string | null
  permissions: ('read' | 'write' | 'deploy' | 'admin')[]
}

export interface BillingInfo {
  plan: 'free' | 'pro' | 'team' | 'enterprise'
  usage: {
    deployments: number
    bandwidth: number
    buildMinutes: number
  }
  limits: {
    deployments: number
    bandwidth: number
    buildMinutes: number
  }
  nextBillingDate: string
  amount: number
}

export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d'