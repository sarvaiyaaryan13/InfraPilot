import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { mockDeploymentTrend } from '@/utils/mockData'

export function DeploymentTrendChart() {
  const data = mockDeploymentTrend.slice(-14)

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }} barSize={8} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} interval={1} />
        <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
          labelStyle={{ color: '#64748B' }}
        />
        <Legend iconSize={8} formatter={(v) => v === 'successful' ? 'Successful' : 'Failed'} />
        <Bar dataKey="successful" fill="#16A34A" radius={[3, 3, 0, 0]} />
        <Bar dataKey="failed" fill="#FCA5A5" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}