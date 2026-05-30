export type DeploymentStatus = 'running' | 'building' | 'stopped' | 'failed' | 'queued' | 'rolling_back'

export type DeploymentSource = 'github' | 'zip' | 'docker' | 'cli'

export interface EnvVariable {
  key: string
  value: string
  isSecret: boolean
}

export interface BuildSettings {
  buildCommand: string
  startCommand: string
  rootDirectory: string
  nodeVersion: string
  envVariables: EnvVariable[]
}

export interface PipelineStage {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped'
  duration?: number
  startedAt?: string
  completedAt?: string
  logs?: string[]
}

export interface Deployment {
  id: string
  name: string
  status: DeploymentStatus
  source: DeploymentSource
  branch: string
  commit: string
  commitMessage: string
  author: string
  region: string
  url: string
  createdAt: string
  updatedAt: string
  duration: number
  buildSettings: BuildSettings
  pipeline: PipelineStage[]
  version: string
  previousVersion?: string
  tags: string[]
  replicas: number
  cpu: number
  memory: number
}

export interface DeploymentFormData {
  name: string
  source: DeploymentSource
  repoUrl?: string
  zipFile?: File
  branch: string
  region: string
  buildSettings: BuildSettings
  tags: string[]
  replicas: number
}

export interface DeploymentStats {
  total: number
  running: number
  failed: number
  successRate: number
  avgBuildTime: number
}