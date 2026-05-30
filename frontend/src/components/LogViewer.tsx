import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Download, CheckCheck } from 'lucide-react'
import { LogEntry } from '@/types'
import { getSeverityColor, getSeverityBgColor, copyToClipboard, downloadText, formatDateTime } from '@/utils/helpers'

interface LogViewerProps {
  logs: LogEntry[]
  autoScroll?: boolean
  maxHeight?: string
}

export function LogViewer({ logs, autoScroll = false, maxHeight = '400px' }: LogViewerProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, autoScroll])

  const handleCopy = async (log: LogEntry) => {
    await copyToClipboard(`[${log.timestamp}] [${log.severity.toUpperCase()}] [${log.service}] ${log.message}`)
    setCopied(log.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDownloadAll = () => {
    const content = logs.map((l) => `[${l.timestamp}] [${l.severity.toUpperCase()}] [${l.service}] ${l.message}`).join('\n')
    downloadText(content, 'infrapilot-logs.txt')
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-mono text-text-secondary ml-2">logs — {logs.length} entries</span>
        </div>
        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
      </div>
      <div
        className="overflow-y-auto scrollbar-thin bg-slate-950 font-mono"
        style={{ maxHeight }}
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, backgroundColor: 'rgba(37, 99, 235, 0.1)' }}
              animate={{ opacity: 1, backgroundColor: 'transparent' }}
              transition={{ duration: 0.5 }}
              className="group flex items-start gap-3 px-4 py-1.5 hover:bg-white/5 border-b border-white/5 last:border-0"
            >
              <span className="text-slate-500 text-xs pt-0.5 flex-shrink-0 tabular-nums">
                {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
              </span>
              <span className={`text-xs font-bold uppercase w-10 flex-shrink-0 pt-0.5 ${getSeverityColor(log.severity)}`}>
                {log.severity.slice(0, 4)}
              </span>
              <span className="text-slate-400 text-xs pt-0.5 flex-shrink-0 w-24 truncate">
                {log.service}
              </span>
              <span className="text-slate-200 text-xs flex-1 leading-relaxed break-all">
                {log.message}
              </span>
              <button
                onClick={() => handleCopy(log)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-all flex-shrink-0 pt-0.5"
              >
                {copied === log.id ? (
                  <CheckCheck className="w-3.5 h-3.5 text-success" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}