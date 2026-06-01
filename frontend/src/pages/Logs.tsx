import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Download, Play, Pause, Trash2, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { LogViewer } from '@/components/LogViewer'
import { useAppStore } from '@/store/appStore'
import { LogEntry, LogSeverity } from '@/types'
import { mockServices } from '@/utils/mockData'
import { generateId, downloadText, getSeverityBgColor } from '@/utils/helpers'

const SEVERITY_OPTIONS: { label: string; value: LogSeverity | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Debug', value: 'debug' },
  { label: 'Info', value: 'info' },
  { label: 'Warn', value: 'warn' },
  { label: 'Error', value: 'error' },
  { label: 'Fatal', value: 'fatal' },
]

const SAMPLE_MESSAGES = [
  (svc: string) => `GET /api/v1/status → 200 OK (${Math.floor(Math.random() * 100 + 10)}ms)`,
  (svc: string) => `POST /api/v1/events → 201 Created (${Math.floor(Math.random() * 80 + 20)}ms)`,
  (svc: string) => `Cache hit rate: ${(Math.random() * 30 + 70).toFixed(1)}%`,
  (svc: string) => `Heartbeat OK — replica ${Math.floor(Math.random() * 5 + 1)}`,
  (svc: string) => `Memory GC cycle completed in ${Math.floor(Math.random() * 50 + 10)}ms`,
  (svc: string) => `Processed ${Math.floor(Math.random() * 500 + 100)} queue jobs`,
  (svc: string) => `Connection pool: ${Math.floor(Math.random() * 8 + 2)}/10 active`,
]

export function Logs() {
  const { logs, addLog, clearLogs } = useAppStore()
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState<LogSeverity | 'all'>('all')
  const [service, setService] = useState<string>('all')
  const [streaming, setStreaming] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)

  const services = ['all', ...Array.from(new Set(mockServices.map((s) => s.name)))]

  const filtered = logs.filter((l) => {
    const matchSearch = !search || l.message.toLowerCase().includes(search.toLowerCase()) || l.service.toLowerCase().includes(search.toLowerCase())
    const matchSev = severity === 'all' || l.severity === severity
    const matchSvc = service === 'all' || l.service === service
    return matchSearch && matchSev && matchSvc
  })

  const handleDownload = () => {
    const content = filtered.map((l) => `[${l.timestamp}] [${l.severity.toUpperCase()}] [${l.service}] ${l.message}`).join('\n')
    downloadText(content, 'logs.txt')
  }

  const streamLog = useCallback(() => {
    const svcNames = mockServices.map((s) => s.name)
    const svc = svcNames[Math.floor(Math.random() * svcNames.length)]
    const severities: LogSeverity[] = ['info', 'info', 'info', 'debug', 'warn', 'error']
    const sev = severities[Math.floor(Math.random() * severities.length)]
    const msgFn = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)]
    const newLog: LogEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      severity: sev,
      service: svc,
      deploymentId: 'dep-001',
      message: msgFn(svc),
    }
    addLog(newLog)
  }, [addLog])

  useEffect(() => {
    if (!streaming) return
    const interval = setInterval(streamLog, 800 + Math.random() * 1200)
    return () => clearInterval(interval)
  }, [streaming, streamLog])

  return (
    <div>
      <PageHeader
        title="Logs"
        subtitle={`${filtered.length} entries`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStreaming(!streaming)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${streaming ? 'bg-green-50 border-green-200 text-success' : 'bg-white border-border text-text-secondary hover:bg-slate-50'}`}
            >
              {streaming ? <><Pause className="w-3.5 h-3.5" />Live</> : <><Play className="w-3.5 h-3.5" />Start Live</>}
            </button>
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" />Export
            </button>
            <button onClick={clearLogs} className="btn-secondary flex items-center gap-1.5 text-xs text-error hover:bg-red-50">
              <Trash2 className="w-3.5 h-3.5" />Clear
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search messages, services..." className="flex-1 min-w-48 max-w-sm" />

        {/* Severity filter */}
        <div className="flex gap-1.5 overflow-x-auto">
          {SEVERITY_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSeverity(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${severity === s.value ? 'bg-primary text-white' : 'bg-white border border-border text-text-secondary hover:bg-slate-50'}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Service filter */}
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="input text-xs w-auto min-w-36"
        >
          {services.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Services' : s}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-4">
        {(['error', 'warn', 'info'] as LogSeverity[]).map((sev) => {
          const count = filtered.filter((l) => l.severity === sev).length
          return (
            <motion.div key={sev} className="card px-3 py-2 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className={`w-2 h-2 rounded-full ${sev === 'error' ? 'bg-error' : sev === 'warn' ? 'bg-warning' : 'bg-info'}`} />
              <span className="text-xs text-text-secondary capitalize">{sev}</span>
              <span className="text-xs font-semibold text-text">{count}</span>
            </motion.div>
          )
        })}
        {streaming && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-success font-medium">Live streaming</span>
          </div>
        )}
      </div>

      <LogViewer logs={filtered} autoScroll={autoScroll && streaming} maxHeight="calc(100vh - 380px)" />
    </div>
  )
}