"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Table as TableIcon } from "lucide-react"

interface AttendanceRecord {
  whalesync_postgres_id?: string
  employee: string
  full_name_from_employee: string
  date: string
  time_in?: number
  time_out?: number
  status: string
  working_hours?: number
  employee_id_from_employee?: string
}

interface AttendanceHistoryTabProps {
  attendanceHistory: AttendanceRecord[]
  isLoading: boolean
}

export default function AttendanceHistoryTab({
  attendanceHistory,
  isLoading
}: AttendanceHistoryTabProps) {
  const getStatusColor = (status: string) => {
    if (status.includes('Present')) return 'bg-green-500'
    if (status.includes('Late')) return 'bg-yellow-500'
    if (status.includes('Half Day')) return 'bg-orange-500'
    if (status.includes('Absent')) return 'bg-red-500'
    return 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TableIcon className="h-5 w-5" />
            Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading attendance history...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Working Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceHistory.map((record, index) => (
                    <TableRow key={record.whalesync_postgres_id || `attendance-${index}-${record.date}`}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {record.time_in ? record.time_in.toString().replace('.', ':') : '-'}
                      </TableCell>
                      <TableCell>
                        {record.time_out ? record.time_out.toString().replace('.', ':') : '-'}
                      </TableCell>
                      <TableCell>
                        {record.working_hours ? `${record.working_hours}h` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(record.status)} text-white`}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
