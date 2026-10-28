"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CallLog } from "./types"

interface CallLogsTableRowProps {
  call: CallLog
  columnVisibility: {
    name: boolean
    mobile: boolean
    service: boolean
    duration: boolean
    date: boolean
    sentiment: boolean
    type: boolean
  }
  onRowClick: (callId: string) => void
  getCallTypeBadge: (type?: string) => string
  getSentimentBadge: (sentiment?: string) => string
  getServiceColor: (service?: string) => string
  formatDuration: (seconds?: number) => string
}

export default function CallLogsTableRow({
  call,
  columnVisibility,
  onRowClick,
  getCallTypeBadge,
  getSentimentBadge,
  getServiceColor,
  formatDuration
}: CallLogsTableRowProps) {
  const service = call.service || call.leads?.services

  return (
    <TableRow 
      className="hover:bg-muted/50 cursor-pointer"
      onClick={() => onRowClick(call.whalesync_postgres_id)}
    >
      {columnVisibility.name && (
        <TableCell className="px-3 py-3 text-sm font-medium">{call.client_name || "-"}</TableCell>
      )}
      {columnVisibility.mobile && (
        <TableCell className="px-3 py-3 text-sm whitespace-nowrap">{call.client_number || "-"}</TableCell>
      )}
      {columnVisibility.service && (
        <TableCell className="px-3 py-3">
          {service ? (
            <Badge variant="outline" className={`${getServiceColor(service)} text-sm px-2 py-1 border`}>
              {service}
            </Badge>
          ) : (
            "-"
          )}
        </TableCell>
      )}
      {columnVisibility.duration && (
        <TableCell className="px-3 py-3 text-sm">{formatDuration(call.duration)}</TableCell>
      )}
      {columnVisibility.date && (
        <TableCell className="px-3 py-3 text-sm whitespace-nowrap">
          {call.call_date
            ? new Date(call.call_date).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </TableCell>
      )}
      {columnVisibility.sentiment && (
        <TableCell className="px-3 py-3">
          <Badge className={`${getSentimentBadge(call.sentiment)} text-sm px-2 py-1`}>
            {call.sentiment || "-"}
          </Badge>
        </TableCell>
      )}
      {columnVisibility.type && (
        <TableCell className="px-3 py-3">
          <Badge className={`${getCallTypeBadge(call.call_type)} text-sm px-2 py-1`}>
            {call.call_type || "-"}
          </Badge>
        </TableCell>
      )}
    </TableRow>
  )
}
