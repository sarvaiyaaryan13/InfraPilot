import { ReactNode, useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingSkeleton } from './LoadingSkeleton'
import { EmptyState } from './EmptyState'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render: (row: T) => ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  isLoading?: boolean
  emptyTitle?: string
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

type SortDir = 'asc' | 'desc' | null

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  emptyTitle = 'No data found',
  emptyMessage = 'Nothing to display here yet.',
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc')
      else if (sortDir === 'desc') { setSortDir(null); setSortKey(null) }
      else setSortDir('asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left text-xs font-medium text-text-secondary uppercase tracking-wide py-3 px-4 first:pl-0 last:pr-0 ${col.sortable ? 'cursor-pointer hover:text-text select-none' : ''} ${col.width || ''}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <span className="text-text-muted">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronsUpDown className="w-3.5 h-3.5" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {data.map((row, index) => (
              <motion.tr
                key={keyExtractor(row)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                className={`border-b border-border last:border-0 hover:bg-slate-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-3.5 px-4 text-sm first:pl-0 last:pr-0">
                    {col.render(row)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}