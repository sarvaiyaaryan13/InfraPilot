import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RefreshCw, RotateCcw, ExternalLink, Copy, CheckCheck, Eye, EyeOff, Globe, GitBranch, Tag, Users } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { DeployStepper } from '@/components/DeployStepper'
import { LogViewer } from '@/components/LogViewer'
import { ErrorState } from '@/components/ErrorState'
import { CpuChart } from "@/components/charts/CpuChart"
import { MemoryChart } from "@/components/charts/MemoryChart"
import { ChartCard } from '@/components/ChartCard'
import { useDeployments } from '@/hooks/useDeployments'
import { useMonitoring } from '@/hooks/useMonitoring'
import { useAppStore } from '@/store/appStore'
import { formatRelativeTime, formatDuration, copyToClipboard } from '@/utils/helpers'

const TABS = ['Overview', 'Logs', 'Monitoring', 'Settings']

export function DeploymentDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getDeploymentById, retry, rollback } = useDeployments()
  const { logs } = useAppStore()
  const deployment = getDeploymentById(id ?? '')
  const [tab, setTab] = useState('Overview')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showSecrets, setShowSecrets] = useState(false)
  const { metrics } = useMonitoring('24h')

  if (!deployment) {
    return (
      <div>
        <PageHeader title="Deployment Details" breadcrumbs={[{ label: 'Deployments', href: '/deployments' }, { label: 'Not Found' }]} />
        <ErrorState title="Deployment not found" message="This deployment may have been deleted or doesn't exist." onRetry={() => navigate('/deployments')} />
      </div>
    )
  }

  const handleCopy = async (text: string, key: string) => {
    await copyToClipboard(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const deploymentLogs = logs.filter((l) => l.deploymentId === deployment.id)

  return (
    <div>
      <PageHeader
        title={deployment.name}
        breadcrumbs={[{ label: 'Deployments', href: '/deployments' }, { label: deployment.name }]}
        actions={
          <div className="flex items-center gap-2">
            {deployment.url && (
              <a href={deployment.url} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />Visit
              </a>
            )}
            {deployment.status === 'failed' && (
              <button onClick={() => retry(deployment.id)} className="btn-secondary flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />Retry
              </button>
            )}
            {deployment.status === 'running' && (
              <button onClick={() => rollback(deployment.id)} className="btn-secondary flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />Rollback
              </button>
            )}
          </div>
        }
      />

      {/* Hero info */}
      <div className="card p-5 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <StatusBadge status={deployment.status} />
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <GitBranch className="w-3.5 h-3.5" />
            <span>{deployment.branch}</span>
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-text">{deployment.commit}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Globe className="w-3.5 h-3.5" />{deployment.region}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Users className="w-3.5 h-3.5" />{deployment.replicas} replica{deployment.replicas !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Tag className="w-3.5 h-3.5" />{deployment.version}
          </div>
          <span className="text-xs text-text-muted ml-auto">Updated {formatRelativeTime(deployment.updatedAt)}</span>
        </div>
        {deployment.url && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-text-secondary">URL:</span>
            <a href={deployment.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-mono">{deployment.url}</a>
            <button onClick={() => handleCopy(deployment.url, 'url')} className="text-text-muted hover:text-text transition-colors">
              {copiedKey === 'url' ? <CheckCheck className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-border mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {/* Overview */}
        {tab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-text mb-4">Build Pipeline</h3>
                <DeployStepper stages={deployment.pipeline} />
              </div>
              {deployment.buildSettings.envVariables.length > 0 && (
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-text">Environment Variables</h3>
                    <button onClick={() => setShowSecrets(!showSecrets)} className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text">
                      {showSecrets ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {showSecrets ? 'Hide' : 'Show'} secrets
                    </button>
                  </div>
                  <div className="space-y-2">
                    {deployment.buildSettings.envVariables.map((ev) => (
                      <div key={ev.key} className="flex items-center justify-between font-mono text-xs bg-slate-50 rounded-lg px-3 py-2">
                        <span className="text-text font-medium">{ev.key}</span>
                        <span className="text-text-secondary">{ev.isSecret && !showSecrets ? '••••••••' : ev.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-text mb-4">Container Info</h3>
                <div className="space-y-3">
                  {[
                    ['Service', deployment.name],
                    ['Version', deployment.version],
                    ['Region', deployment.region],
                    ['Replicas', String(deployment.replicas)],
                    ['Build Time', deployment.duration ? formatDuration(deployment.duration) : 'N/A'],
                    ['Author', deployment.author],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-xs text-text-secondary">{k}</span>
                      <span className="text-xs font-medium text-text font-mono">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {deployment.tags.length > 0 && (
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-text mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {deployment.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-slate-100 text-text-secondary text-xs rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logs */}
        {tab === 'Logs' && (
          <LogViewer logs={deploymentLogs.length > 0 ? deploymentLogs : []} maxHeight="500px" />
        )}

        {/* Monitoring */}
        {tab === 'Monitoring' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="CPU Usage" subtitle={`Current: ${deployment.cpu.toFixed(1)}%`}>
              <CpuChart data={metrics.cpu} />
            </ChartCard>
            <ChartCard title="Memory Usage" subtitle={`Current: ${deployment.memory.toFixed(1)}%`}>
              <MemoryChart data={metrics.memory} />
            </ChartCard>
          </div>
        )}

        {/* Settings */}
        {tab === 'Settings' && (
          <div className="max-w-lg space-y-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-text mb-4">Build Settings</h3>
              <div className="space-y-3">
                {[
                  ['Build Command', deployment.buildSettings.buildCommand],
                  ['Start Command', deployment.buildSettings.startCommand],
                  ['Root Directory', deployment.buildSettings.rootDirectory],
                  ['Node Version', deployment.buildSettings.nodeVersion],
                ].map(([k, v]) => (
                  <div key={k}>
                    <label className="label">{k}</label>
                    <div className="input font-mono text-xs bg-slate-50 text-text-secondary">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-text mb-4">Danger Zone</h3>
              <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <p className="text-sm font-medium text-text">Delete Deployment</p>
                  <p className="text-xs text-text-secondary">This action cannot be undone.</p>
                </div>
                <button className="btn-danger text-xs">Delete</button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}