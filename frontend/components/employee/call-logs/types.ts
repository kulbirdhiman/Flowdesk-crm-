export interface CallLog {
  whalesync_postgres_id: string
  client_name?: string
  client_number?: string
  duration?: number
  call_date?: string
  sentiment?: string
  call_type?: string
  service?: string
  leads?: {
    services?: string
  }
}

export interface CallLogsTableProps {
  calls: CallLog[]
}

export type SortColumn = "name" | "mobile" | "service" | "duration" | "date" | "sentiment" | "type"
export type SortDirection = "asc" | "desc" | null

export interface ColumnVisibility {
  name: boolean
  mobile: boolean
  service: boolean
  duration: boolean
  date: boolean
  sentiment: boolean
  type: boolean
}
