import { useNavigate } from 'react-router-dom'
import { Rocket, Box, CheckCircle, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { MetricCard } from '@/components/MetricCard'
import { ChartCard } from '@/components/ChartCard'
import { ActivityFeed } from '@/components/ActivityFeed'
import { HealthStatus } from '@/components/HealthStatus'
import { QuickActions } from '@/components/QuickActions'
import { StatusBadge } from '@/components/StatusBadge'
import { DeploymentTrendChart } from "@/components/charts/DeploymentTrendChart"
import { useDeployments } from '@/hooks/useDeployments'
import { useAuthStore } from '@/store/authStore'
import { formatRelativeTime } from '@/utils/helpers'
import { motion } from 'framer-motion'

export function Dashboard() {
  const { deployments, stats } = useDeployments()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const recentDeployments = deployments.slice(0, 5)

  return (
    <div>
      <PageHeader
        title={`Good morning, ${user?.name?.split(' ')[0] ?? 'there'} 👋`}
        subtitle="Here's what's happening with your infrastructure"
        actions={
          <button onClick={() => navigate('/deploy')} className="btn-primary flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            New Deploy
          </button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Deployments"
          value={stats.total}
          icon={<Box className="w-5 h-5" />}
          color="blue"
          trend={12}
          trendLabel="vs last month"
        />
        <MetricCard
          title="Running Services"
          value={stats.running}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
          subtitle={`of ${stats.total} total`}
        />
        <MetricCard
          title="Success Rate"
          value={`${stats.successRate.toFixed(1)}%`}
          icon={<Rocket className="w-5 h-5" />}
          color="purple"
          trend={2.4}
          animate={false}
        />
        <MetricCard
          title="Failed Builds"
          value={stats.failed}
          icon={<XCircle className="w-5 h-5" />}
          color="red"
          trend={-15}
          trendLabel="vs last week"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        {/* Deployment trend */}
        <ChartCard
          title="Deployment Trend"
          subtitle="Last 14 days"
          className="xl:col-span-2"
        >
          <DeploymentTrendChart />
        </ChartCard>

        {/* Quick actions */}
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent deployments */}
        <div className="xl:col-span-2">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text">Recent Deployments</h3>
              <button onClick={() => navigate('/deployments')} className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {recentDeployments.map((dep, i) => (
                <motion.div
                  key={dep.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => navigate(`/deployments/${dep.id}`)}
                  className="flex items-center justify-between py-2.5 border-b border-border last:border-0 hover:bg-slate-50 -mx-2 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Box className="w-3.5 h-3.5 text-text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text truncate">{dep.name}</p>
                      <p className="text-xs text-text-secondary truncate">{dep.commitMessage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <StatusBadge status={dep.status} size="sm" />
                    <span className="text-xs text-text-muted hidden sm:inline">{formatRelativeTime(dep.updatedAt)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <HealthStatus />
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}