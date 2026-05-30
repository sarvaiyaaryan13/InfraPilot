import { useState, useCallback } from 'react'
import { useAppStore } from '@/store/appStore'
import { DeploymentFormData, Deployment } from '@/types'
import { deploymentService } from '@/services/deploymentService'
import { generateId } from '@/utils/helpers'

export function useDeployments() {
  const { deployments, addDeployment, updateDeployment, removeDeployment } = useAppStore()
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployError, setDeployError] = useState<string | null>(null)

  const deploy = useCallback(
    async (formData: DeploymentFormData) => {
      setIsDeploying(true)
      setDeployError(null)
      try {
        const newDeployment = await deploymentService.createDeployment(formData)
        addDeployment(newDeployment)
        return { success: true, deployment: newDeployment }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Deployment failed'
        setDeployError(msg)
        return { success: false, error: msg }
      } finally {
        setIsDeploying(false)
      }
    },
    [addDeployment]
  )

  const retry = useCallback(
    async (id: string) => {
      updateDeployment(id, { status: 'queued' })
      await new Promise((resolve) => setTimeout(resolve, 1000))
      updateDeployment(id, { status: 'building' })
      await new Promise((resolve) => setTimeout(resolve, 3000))
      updateDeployment(id, {
        status: 'running',
        updatedAt: new Date().toISOString(),
      })
    },
    [updateDeployment]
  )

  const rollback = useCallback(
    async (id: string) => {
      updateDeployment(id, { status: 'rolling_back' })
      await new Promise((resolve) => setTimeout(resolve, 2000))
      updateDeployment(id, { status: 'running', updatedAt: new Date().toISOString() })
    },
    [updateDeployment]
  )

  const stopDeployment = useCallback(
    async (id: string) => {
      updateDeployment(id, { status: 'stopped', replicas: 0 })
    },
    [updateDeployment]
  )

  const deleteDeployment = useCallback(
    async (id: string) => {
      removeDeployment(id)
    },
    [removeDeployment]
  )

  const getDeploymentById = useCallback(
    (id: string): Deployment | undefined => {
      return deployments.find((d) => d.id === id)
    },
    [deployments]
  )

  const stats = {
    total: deployments.length,
    running: deployments.filter((d) => d.status === 'running').length,
    failed: deployments.filter((d) => d.status === 'failed').length,
    building: deployments.filter((d) => d.status === 'building').length,
    successRate:
      deployments.length > 0
        ? ((deployments.filter((d) => d.status === 'running' || d.status === 'stopped').length /
            deployments.length) *
            100)
        : 0,
  }

  return {
    deployments,
    isDeploying,
    deployError,
    stats,
    deploy,
    retry,
    rollback,
    stopDeployment,
    deleteDeployment,
    getDeploymentById,
  }
}