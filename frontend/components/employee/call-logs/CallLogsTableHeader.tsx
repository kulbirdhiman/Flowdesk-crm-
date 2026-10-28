"use client"

import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CallLogsTableHeaderProps {
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
  onSort: (column: "name" | "mobile" | "service" | "duration" | "date" | "sentiment" | "type") => void
  getSortIcon: (column: "name" | "mobile" | "service" | "duration" | "date" | "sentiment" | "type") => React.ReactNode
}

export default function CallLogsTableHeader({
  columnVisibility,
  sortColumn,
  sortDirection,
  onSort,
  getSortIcon
}: CallLogsTableHeaderProps) {
  return (
    <TableHeader className="sticky top-0 bg-background z-10">
      <TableRow className="hover:bg-transparent">
        {columnVisibility.name && (
          <TableHead 
            className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
            onClick={() => onSort("name")}
          >
            Name{getSortIcon("name")}
          </TableHead>
        )}
        {columnVisibility.mobile && (
          <TableHead 
            className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
            onClick={() => onSort("mobile")}
          >
            Mobile{getSortIcon("mobile")}
          </TableHead>
        )}
        {columnVisibility.service && (
          <TableHead 
            className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
            onClick={() => onSort("service")}
          >
            Service{getSortIcon("service")}
          </TableHead>
        )}
        {columnVisibility.duration && (
          <TableHead 
            className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
            onClick={() => onSort("duration")}
          >
            Duration{getSortIcon("duration")}
          </TableHead>
        )}
        {columnVisibility.date && (
          <TableHead 
            className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
            onClick={() => onSort("date")}
          >
            Call Date{getSortIcon("date")}
          </TableHead>
        )}
        {columnVisibility.sentiment && (
          <TableHead 
            className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
            onClick={() => onSort("sentiment")}
          >
            Sentiment{getSortIcon("sentiment")}
          </TableHead>
        )}
        {columnVisibility.type && (
          <TableHead 
            className="h-10 px-3 text-sm font-semibold bg-background cursor-pointer select-none hover:bg-muted/50"
            onClick={() => onSort("type")}
          >
            Call Type{getSortIcon("type")}
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
  )
}
