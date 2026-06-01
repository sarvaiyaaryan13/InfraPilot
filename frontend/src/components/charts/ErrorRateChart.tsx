import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { MetricSeries } from '@/types'

interface ErrorRateChartProps {
  data: MetricSeries
}

export function ErrorRateChart({ data }: ErrorRateChartProps) {
  const chartData = data.data.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    value: parseFloat(Math.max(0, point.value).toFixed(2)),
  }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="errGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} interval={9} />
        <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} unit="%" domain={[0, 'auto']} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
          formatter={(value: number) => [`${value}%`, 'Error Rate']}
          labelStyle={{ color: '#64748B' }}
        />
        <ReferenceLine y={2} stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'Threshold', fontSize: 10, fill: '#F59E0B' }} />
        <Area type="monotone" dataKey="value" stroke="#DC2626" strokeWidth={2} fill="url(#errGradient)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}