"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface CallData {
  whalesync_postgres_id: string
  employee: string
  client_name?: string
  client_number?: string
  call_date: string
  duration: number
  call_type: string
}

interface CallsTabProps {
  calls: CallData[]
  filteredCalls: CallData[]
  callsDate: string
  callsSearch: string
  onDateChange: (date: string) => void
  onSearchChange: (search: string) => void
}

export default function CallsTab({
  calls,
  filteredCalls,
  callsDate,
  callsSearch,
  onDateChange,
  onSearchChange
}: CallsTabProps) {
  const router = useRouter()

  const getCallTypeBadge = (type: string) => {
    if (type === "Incoming") return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Incoming</Badge>
    if (type === "Outgoing") return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">Outgoing</Badge>
    return <Badge variant="secondary">{type}</Badge>
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const incomingCalls = calls.filter((c) => c.call_type === "Incoming").length
  const outgoingCalls = calls.filter((c) => c.call_type === "Outgoing").length

  return (
    <div className="mt-0 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="bg-blue-100 dark:bg-blue-900/30">
          <CardContent className="p-3 text-center">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-300">Total Calls</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{calls.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-100 dark:bg-green-900/30">
          <CardContent className="p-3 text-center">
            <p className="text-xs font-medium text-green-800 dark:text-green-300">Incoming</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-200">{incomingCalls}</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-100 dark:bg-orange-900/30">
          <CardContent className="p-3 text-center">
            <p className="text-xs font-medium text-orange-800 dark:text-orange-300">Outgoing</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">{outgoingCalls}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="calls-date" className="text-sm">
            Filter by Date
          </Label>
          <Input 
            id="calls-date" 
            type="date" 
            value={callsDate} 
            onChange={(e) => onDateChange(e.target.value)} 
            className="text-sm" 
          />
        </div>
        <div>
          <Label htmlFor="calls-search" className="text-sm">
            Search by Name or Number
          </Label>
          <Input
            id="calls-search"
            type="text"
            placeholder="Search..."
            value={callsSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Call Log</h3>
        <Card className="max-h-72 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCalls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No calls recorded matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCalls
                  .sort((a, b) => new Date(b.call_date).getTime() - new Date(a.call_date).getTime())
                  .map((call) => (
                    <TableRow
                      key={call.whalesync_postgres_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/dashboard/calls/${call.whalesync_postgres_id}`)}
                    >
                      <TableCell className="font-medium">
                        {new Date(call.call_date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <div>{call.client_name || "Unknown Client"}</div>
                        <div className="text-xs text-muted-foreground">{call.client_number || ""}</div>
                      </TableCell>
                      <TableCell>{getCallTypeBadge(call.call_type)}</TableCell>
                      <TableCell>{formatDuration(call.duration)}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
