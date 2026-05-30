import { LogEntry, LogFilters } from '@/types'
import { mockLogs } from '@/utils/mockData'

export const logsService = {
  async getLogs(filters: Partial<LogFilters> = {}): Promise<LogEntry[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    let logs = [...mockLogs]
    if (filters.search) {
      logs = logs.filter((l) => l.message.toLowerCase().includes(filters.search!.toLowerCase()))
    }
    if (filters.severity && filters.severity !== 'all') {
      logs = logs.filter((l) => l.severity === filters.severity)
    }
    if (filters.service && filters.service !== 'all') {
      logs = logs.filter((l) => l.service === filters.service)
    }
    return logs
  },
}