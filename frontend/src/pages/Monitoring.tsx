import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Cpu, HardDrive, Network, Clock, AlertTriangle, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { ChartCard } from '@/components/ChartCard'
import { CpuChart } from "@/components/charts/CpuChart"
import { MemoryChart } from "@/components/charts/MemoryChart"
import { NetworkChart } from "@/components/charts/NetworkChart"
import { ResponseTimeChart } from "@/components/charts/ResponseTimeChart"
import { ErrorRateChart } from "@/components/charts/ErrorRateChart"
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { useMonitoring } from '@/hooks/useMonitoring'
import { TimeRange } from '@/types'
import { formatPercentage } from '@/utils/helpers'

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
]

function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-text-muted mb-0.5">{label}</span>
      <span className={`text-sm font-semibold ${color}`}>{value}</span>
    </div>
  )
}

export function Monitoring() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const { metrics, isLoading } = useMonitoring(timeRange)

  return (
    <div>
      <PageHeader
        title="Monitoring"
        subtitle="Real-time infrastructure metrics"
        actions={
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {TIME_RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setTimeRange(r.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${timeRange === r.value ? 'bg-white text-text shadow-sm' : 'text-text-secondary hover:text-text'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {[
          { label: 'CPU', value: `${metrics.cpu.current.toFixed(1)}%`, icon: <Cpu className="w-4 h-4" />, color: 'text-primary', bg: 'bg-blue-50' },
          { label: 'Memory', value: `${metrics.memory.current.toFixed(1)}%`, icon: <HardDrive className="w-4 h-4" />, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Net In', value: `${metrics.network.in.current.toFixed(1)} MB/s`, icon: <Network className="w-4 h-4" />, color: 'text-info', bg: 'bg-sky-50' },
          { label: 'Resp Time', value: `${metrics.responseTime.current.toFixed(0)}ms`, icon: <Clock className="w-4 h-4" />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Error Rate', value: `${metrics.errorRate.current.toFixed(2)}%`, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-error', bg: 'bg-red-50' },
          { label: 'Uptime', value: `${metrics.uptime.toFixed(2)}%`, icon: <TrendingUp className="w-4 h-4" />, color: 'text-success', bg: 'bg-green-50' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className="card p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-2`}>
              {item.icon}
            </div>
            <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-text-secondary mt-0.5">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5">
              <LoadingSkeleton className="h-4 w-32 mb-4" />
              <LoadingSkeleton className="h-40 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard
            title="CPU Usage"
            subtitle={`Avg ${metrics.cpu.avg.toFixed(1)}% · Peak ${metrics.cpu.max.toFixed(1)}%`}
            actions={<StatBadge label="Current" value={`${metrics.cpu.current.toFixed(1)}%`} color="text-primary" />}
          >
            <CpuChart data={metrics.cpu} />
          </ChartCard>

          <ChartCard
            title="Memory Usage"
            subtitle={`Avg ${metrics.memory.avg.toFixed(1)}% · Peak ${metrics.memory.max.toFixed(1)}%`}
            actions={<StatBadge label="Current" value={`${metrics.memory.current.toFixed(1)}%`} color="text-purple-600" />}
          >
            <MemoryChart data={metrics.memory} />
          </ChartCard>

          <ChartCard
            title="Network I/O"
            subtitle={`In ${metrics.network.in.current.toFixed(1)} MB/s · Out ${metrics.network.out.current.toFixed(1)} MB/s`}
          >
            <NetworkChart networkIn={metrics.network.in} networkOut={metrics.network.out} />
          </ChartCard>

          <ChartCard
            title="Response Time"
            subtitle={`P50 ${metrics.responseTime.avg.toFixed(0)}ms · P99 ${metrics.responseTime.max.toFixed(0)}ms`}
            actions={<StatBadge label="Current" value={`${metrics.responseTime.current.toFixed(0)}ms`} color="text-amber-600" />}
          >
            <ResponseTimeChart data={metrics.responseTime} />
          </ChartCard>

          <ChartCard
            title="Error Rate"
            subtitle={`Avg ${metrics.errorRate.avg.toFixed(2)}% · Threshold 2%`}
            actions={<StatBadge label="Current" value={`${metrics.errorRate.current.toFixed(2)}%`} color={metrics.errorRate.current > 2 ? 'text-error' : 'text-success'} />}
            className="lg:col-span-2"
          >
            <ErrorRateChart data={metrics.errorRate} />
          </ChartCard>
        </div>
      )}

      {/* Requests per minute */}
      <motion.div className="card p-5 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 text-success flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Requests / minute</p>
              <p className="text-xs text-text-secondary">Across all services</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-text">{metrics.requestsPerMinute.toLocaleString()}</div>
        </div>
      </motion.div>
    </div>
  )
}