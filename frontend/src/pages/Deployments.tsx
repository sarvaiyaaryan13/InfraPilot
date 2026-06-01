import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, RefreshCw, Trash2, ExternalLink, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { StatusBadge } from '@/components/StatusBadge'
import { DataTable, Column } from '@/components/DataTable'
import { useDeployments } from '@/hooks/useDeployments'
import { Deployment, DeploymentStatus } from '@/types'
import { formatRelativeTime, truncateString } from '@/utils/helpers'

const PAGE_SIZE = 10

const STATUS_FILTERS: { label: string; value: DeploymentStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Running', value: 'running' },
  { label: 'Building', value: 'building' },
  { label: 'Failed', value: 'failed' },
  { label: 'Stopped', value: 'stopped' },
]

export function Deployments() {
  const navigate = useNavigate()
  const { deployments, stats, retry, deleteDeployment } = useDeployments()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<DeploymentStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return deployments.filter((d) => {
      const matchesSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.commitMessage.toLowerCase().includes(search.toLowerCase()) ||
        d.author.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [deployments, search, statusFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeletingId(id)
    await deleteDeployment(id)
    setDeletingId(null)
  }

  const handleRetry = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    retry(id)
  }

  const columns: Column<Deployment>[] = [
    {
      key: 'name',
      label: 'Service',
      sortable: true,
      render: (d) => (
        <div>
          <p className="font-medium text-text text-sm">{d.name}</p>
          <p className="text-xs text-text-muted mt-0.5">{truncateString(d.commitMessage, 48)}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: 'w-32',
      render: (d) => <StatusBadge status={d.status} />,
    },
    {
      key: 'region',
      label: 'Region',
      render: (d) => <span className="text-sm text-text-secondary font-mono text-xs">{d.region}</span>,
    },
    {
      key: 'author',
      label: 'Author',
      render: (d) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium flex-shrink-0">
            {d.author.charAt(0)}
          </div>
          <span className="text-sm text-text-secondary">{d.author}</span>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Deploy',
      sortable: true,
      render: (d) => <span className="text-sm text-text-secondary">{formatRelativeTime(d.updatedAt)}</span>,
    },
    {
      key: 'actions',
      label: '',
      width: 'w-24',
      render: (d) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          {d.status === 'failed' && (
            <button onClick={(e) => handleRetry(d.id, e)} className="p-1.5 rounded-lg hover:bg-blue-50 text-text-secondary hover:text-primary transition-colors" title="Retry">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          {d.url && (
            <a href={d.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-slate-100 text-text-secondary hover:text-text transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button onClick={(e) => handleDelete(d.id, e)} disabled={deletingId === d.id} className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-error transition-colors" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Deployments"
        subtitle={`${stats.total} total · ${stats.running} running · ${stats.failed} failed`}
        actions={
          <button onClick={() => navigate('/deploy')} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />New Deploy
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search by name, commit, author..." className="flex-1 max-w-sm" />
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-muted flex-shrink-0" />
          <div className="flex gap-1.5 overflow-x-auto">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { setStatusFilter(f.value); setPage(1) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${statusFilter === f.value ? 'bg-primary text-white' : 'bg-white border border-border text-text-secondary hover:bg-slate-50'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-5">
        <DataTable
          columns={columns}
          data={paginated}
          keyExtractor={(d) => d.id}
          emptyTitle="No deployments found"
          emptyMessage="Try adjusting your filters or create a new deployment."
          onRowClick={(d) => navigate(`/deployments/${d.id}`)}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-xs text-text-secondary">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="p-1.5 rounded-lg border border-border hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-text-secondary px-2">{page} / {totalPages}</span>
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="p-1.5 rounded-lg border border-border hover:bg-slate-50 disabled:opacity-40 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}