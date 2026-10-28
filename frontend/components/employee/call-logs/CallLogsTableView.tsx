"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import CallLogsTableHeader from "./CallLogsTableHeader"
import CallLogsTableRow from "./CallLogsTableRow"
import CallLogsPagination from "./CallLogsPagination"
import { CallLog } from "./types"

interface CallLogsTableViewProps {
  calls: CallLog[]
  columnVisibility: {
    name: boolean
    mobile: boolean
    service: boolean
    duration: boolean
    date: boolean
    sentiment: boolean
    type: boolean
  }
  sortColumn: "name" | "mobile" | "service" | "duration" | "date" | "sentiment" | "type" | null
  sortDirection: "asc" | "desc" | null
  currentPage: number
  setCurrentPage: (page: number) => void
  rowsPerPage: number
  setRowsPerPage: (rows: number) => void
  onSort: (column: "name" | "mobile" | "service" | "duration" | "date" | "sentiment" | "type") => void
  onRowClick: (callId: string) => void
  getSortIcon: (column: "name" | "mobile" | "service" | "duration" | "date" | "sentiment" | "type") => React.ReactNode
  getCallTypeBadge: (type?: string) => string
  getSentimentBadge: (sentiment?: string) => string
  getServiceColor: (service?: string) => string
  formatDuration: (seconds?: number) => string
}

export default function CallLogsTableView({
  calls,
  columnVisibility,
  sortColumn,
  sortDirection,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  onSort,
  onRowClick,
  getSortIcon,
  getCallTypeBadge,
  getSentimentBadge,
  getServiceColor,
  formatDuration
}: CallLogsTableViewProps) {
  const totalPages = Math.ceil(calls.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedCalls = calls.slice(startIndex, endIndex)

  return (
    <div className="w-full rounded-md border flex-1 min-h-0 flex flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <CallLogsTableHeader
            columnVisibility={columnVisibility}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={onSort}
            getSortIcon={getSortIcon}
          />
          <TableBody>
            {paginatedCalls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length} className="text-center text-xs py-8 text-muted-foreground">
                  No call logs found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedCalls.map((call) => (
                <CallLogsTableRow
                  key={call.whalesync_postgres_id}
                  call={call}
                  columnVisibility={columnVisibility}
                  onRowClick={onRowClick}
                  getCallTypeBadge={getCallTypeBadge}
                  getSentimentBadge={getSentimentBadge}
                  getServiceColor={getServiceColor}
                  formatDuration={formatDuration}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CallLogsPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        startIndex={startIndex}
        endIndex={endIndex}
        totalCalls={calls.length}
      />
    </div>
  )
}
