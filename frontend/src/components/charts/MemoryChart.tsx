import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MetricSeries } from '@/types'

interface MemoryChartProps {
  data: MetricSeries
}

export function MemoryChart({ data }: MemoryChartProps) {
  const chartData = data.data.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    value: parseFloat(point.value.toFixed(1)),
  }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} interval={9} />
        <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
          formatter={(value: number) => [`${value}%`, 'Memory']}
          labelStyle={{ color: '#64748B' }}
        />
        <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} fill="url(#memoryGradient)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}