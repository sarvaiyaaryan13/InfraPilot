import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { MetricSeries } from '@/types'

interface NetworkChartProps {
  networkIn: MetricSeries
  networkOut: MetricSeries
}

export function NetworkChart({ networkIn, networkOut }: NetworkChartProps) {
  const chartData = networkIn.data.map((point, i) => ({
    time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    in: parseFloat(point.value.toFixed(2)),
    out: parseFloat((networkOut.data[i]?.value ?? 0).toFixed(2)),
  }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} interval={9} />
        <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} unit=" MB/s" />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
          formatter={(value: number, name: string) => [`${value} MB/s`, name === 'in' ? 'Inbound' : 'Outbound']}
          labelStyle={{ color: '#64748B' }}
        />
        <Legend formatter={(v) => v === 'in' ? 'Inbound' : 'Outbound'} iconSize={8} />
        <Line type="monotone" dataKey="in" stroke="#0EA5E9" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="out" stroke="#F59E0B" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}