"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface AttendanceData {
  employee: string
  date: string
  status: string
}

interface AttendanceTabProps {
  attendance: AttendanceData[]
  selectedDate: string
  onDateChange: (date: string) => void
}

export default function AttendanceTab({
  attendance,
  selectedDate,
  onDateChange
}: AttendanceTabProps) {
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || ""
    if (s === "present") return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Present</Badge>
    if (s === "absent") return <Badge variant="destructive">Absent</Badge>
    if (s === "half day") return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Half Day</Badge>
    return <Badge variant="secondary">{status || "N/A"}</Badge>
  }

  const selectedDateRecord = attendance.find((a) => a.date === selectedDate)

  return (
    <div className="mt-0 space-y-4">
      <div>
        <h3 className="text-lg font-bold mb-2">Check Attendance by Date</h3>
        <Card className="bg-muted/30">
          <CardContent className="p-3 flex items-end space-x-3">
            <div>
              <Label htmlFor="attendance-date" className="text-xs">
                Select a Date
              </Label>
              <Input
                id="attendance-date"
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="flex-grow">
              {selectedDateRecord ? (
                <p className="text-sm font-medium">
                  Status on {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long" })}: {getStatusBadge(selectedDateRecord.status)}
                </p>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">
                  No record for {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long" })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Attendance Log</h3>
        <Card className="max-h-72 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                attendance
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {new Date(record.date + "T00:00:00").toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
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
