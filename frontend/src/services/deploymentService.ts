import { DeploymentFormData, Deployment, PipelineStage } from '@/types'
import { generateId } from '@/utils/helpers'

const regions: Record<string, string> = {
  'us-east-1': 'US East (N. Virginia)',
  'us-west-2': 'US West (Oregon)',
  'eu-west-1': 'EU (Ireland)',
  'ap-southeast-1': 'AP (Singapore)',
}

export const deploymentService = {
  async createDeployment(formData: DeploymentFormData): Promise<Deployment> {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const pipeline: PipelineStage[] = [
      { id: generateId(), name: formData.source === 'zip' ? 'Extract Archive' : 'Clone Repository', status: 'pending' },
      { id: generateId(), name: 'Install Dependencies', status: 'pending' },
      { id: generateId(), name: 'Run Tests', status: 'pending' },
      { id: generateId(), name: 'Build', status: 'pending' },
      { id: generateId(), name: 'Deploy', status: 'pending' },
    ]

    return {
      id: 'dep-' + generateId(),
      name: formData.name,
      status: 'queued',
      source: formData.source,
      branch: formData.branch,
      commit: Math.random().toString(36).substring(2, 9),
      commitMessage: 'Initial deployment',
      author: 'You',
      region: formData.region,
      url: `https://${formData.name}.infrapilot.app`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      duration: 0,
      version: 'v1.0.0',
      tags: formData.tags,
      replicas: formData.replicas,
      cpu: 0,
      memory: 0,
      buildSettings: formData.buildSettings,
      pipeline,
    }
  },

  async validateRepository(url: string): Promise<{ valid: boolean; name: string; branch: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    if (!url.includes('github.com') && !url.includes('gitlab.com')) {
      throw new Error('Only GitHub and GitLab repositories are supported')
    }
    const parts = url.split('/')
    const name = parts[parts.length - 1].replace('.git', '')
    return { valid: true, name, branch: 'main' }
  },
}