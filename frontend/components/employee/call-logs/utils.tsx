import React from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { SortColumn, SortDirection } from "./types"

// Badge styling functions
export const getCallTypeBadge = (type?: string) => {
  if (type === "Incoming") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
  if (type === "Outgoing") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
  if (type === "Missed") return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
}

export const getSentimentBadge = (sentiment?: string) => {
  const s = sentiment?.toLowerCase() || ""
  if (s.includes("positive")) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
  if (s.includes("neutral")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
  if (s.includes("negative")) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
}

export const getServiceColor = (service?: string) => {
  const s = service?.toLowerCase() || ""
  if (s.includes("usa llc formation")) return "border-green-500/50 text-green-700 bg-green-50 dark:border-green-500/30 dark:text-green-400 dark:bg-green-950/30"
  if (s.includes("dropshipping")) return "border-orange-500/50 text-orange-700 bg-orange-50 dark:border-orange-500/30 dark:text-orange-400 dark:bg-orange-950/30"
  if (s.includes("brand development")) return "border-purple-500/50 text-purple-700 bg-purple-50 dark:border-purple-500/30 dark:text-purple-400 dark:bg-purple-950/30"
  if (s.includes("canton fair")) return "border-blue-500/50 text-blue-700 bg-blue-50 dark:border-blue-500/30 dark:text-blue-400 dark:bg-blue-950/30"
  return "border-gray-500/50 text-gray-700 bg-gray-50 dark:border-gray-500/30 dark:text-gray-400 dark:bg-gray-950/30"
}

// Duration formatting
export const formatDuration = (seconds?: number) => {
  if (!seconds) return "0s"
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${seconds}s`
}

// Sort icon helper
export const getSortIcon = (column: SortColumn, sortColumn: SortColumn | null, sortDirection: SortDirection) => {
  if (sortColumn !== column) {
    return <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-50" />
  }
  if (sortDirection === "asc") {
    return <ArrowUp className="ml-1 h-3 w-3 inline" />
  }
  if (sortDirection === "desc") {
    return <ArrowDown className="ml-1 h-3 w-3 inline" />
  }
  return <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-50" />
}

// Filter functions
export const filterCalls = (
  calls: any[],
  searchTerm: string,
  serviceFilter: string[],
  sentimentFilter: string[],
  dateFilter: Date | undefined
) => {
  return calls.filter((call) => {
    const service = call.service || call.leads?.services
    
    const matchesSearch =
      !searchTerm ||
      call.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.client_number?.includes(searchTerm)

    const matchesService = serviceFilter.length === 0 || serviceFilter.includes(service || "")

    const matchesSentiment = sentimentFilter.length === 0 || sentimentFilter.includes(call.sentiment || "")

    const matchesDate = !dateFilter || 
      (call.call_date && new Date(call.call_date).toDateString() === dateFilter.toDateString())

    return matchesSearch && matchesService && matchesSentiment && matchesDate
  })
}

// Sort function
export const sortCalls = (calls: any[], sortColumn: SortColumn | null, sortDirection: SortDirection) => {
  if (!sortColumn || !sortDirection) return calls

  return [...calls].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortColumn) {
      case "name":
        aValue = a.client_name?.toLowerCase() || ""
        bValue = b.client_name?.toLowerCase() || ""
        break
      case "mobile":
        aValue = a.client_number || ""
        bValue = b.client_number || ""
        break
      case "service":
        aValue = (a.service || a.leads?.services || "").toLowerCase()
        bValue = (b.service || b.leads?.services || "").toLowerCase()
        break
      case "duration":
        aValue = a.duration || 0
        bValue = b.duration || 0
        break
      case "date":
        aValue = a.call_date ? new Date(a.call_date).getTime() : 0
        bValue = b.call_date ? new Date(b.call_date).getTime() : 0
        break
      case "sentiment":
        aValue = a.sentiment?.toLowerCase() || ""
        bValue = b.sentiment?.toLowerCase() || ""
        break
      case "type":
        aValue = a.call_type?.toLowerCase() || ""
        bValue = b.call_type?.toLowerCase() || ""
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })
}

// CSV export function
export const exportToCSV = (calls: any[]) => {
  const headers = [
    "Name",
    "Mobile",
    "Service",
    "Duration",
    "Call Date",
    "Sentiment",
    "Call Type"
  ]
  
  const rows = [
    headers.join(","),
    ...calls.map((call) => {
      const service = call.service || call.leads?.services || ""
      const duration = call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : ""
      const callDate = call.call_date ? new Date(call.call_date).toLocaleDateString() : ""
      
      const row = [
        `"${(call.client_name || "").replace(/"/g, '""')}"`,
        `"${(call.client_number || "").replace(/"/g, '""')}"`,
        `"${service.replace(/"/g, '""')}"`,
        `"${duration}"`,
        `"${callDate}"`,
        `"${call.sentiment || ""}"`,
        `"${call.call_type || ""}"`
      ]
      return row.join(",")
    }),
  ]
  
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `call_logs_${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
