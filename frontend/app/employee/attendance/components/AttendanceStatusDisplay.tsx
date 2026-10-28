"use client"

import { CheckCircle, XCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

interface AttendanceStatusDisplayProps {
  attendance: AttendanceRecord | null
  currentTime: Date
}

export default function AttendanceStatusDisplay({ 
  attendance, 
  currentTime 
}: AttendanceStatusDisplayProps) {
  const getStatusColor = (status: string) => {
    if (status.includes('Present')) return 'bg-green-500'
    if (status.includes('Late')) return 'bg-yellow-500'
    if (status.includes('Half Day')) return 'bg-orange-500'
    if (status.includes('Absent')) return 'bg-red-500'
    return 'bg-gray-500'
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  if (!attendance) {
    return (
      <div className="text-center space-y-4">
        <div className="p-6 border rounded-lg">
          <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-lg font-semibold">No attendance marked for today</p>
          <p className="text-sm text-muted-foreground">Ready to start your workday?</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Current Time</p>
          <p className="text-xl font-bold">{formatTime(currentTime)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 border rounded-lg">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Check In</p>
          <p className="text-lg font-semibold">
            {attendance.time_in ? attendance.time_in.toString().replace('.', ':') : 'Not marked'}
          </p>
        </div>
        <div className="text-center p-4 border rounded-lg">
          <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Check Out</p>
          <p className="text-lg font-semibold">
            {attendance.time_out ? attendance.time_out.toString().replace('.', ':') : 'Not marked'}
          </p>
        </div>
        <div className="text-center p-4 border rounded-lg">
          <div className="h-8 w-8 bg-blue-600 rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge className={`${getStatusColor(attendance.status)} text-white`}>
            {attendance.status}
          </Badge>
        </div>
      </div>
      
      {attendance.working_hours && (
        <div className="text-center p-4 border rounded-lg">
          <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Working Hours</p>
          <p className="text-2xl font-bold">{attendance.working_hours}h</p>
        </div>
      )}

      {attendance.time_in && !attendance.time_out && (
        <div className="space-y-4 w-full max-w-md mx-auto">
          <div className="text-center p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Current Time</p>
            <p className="text-xl font-bold">{formatTime(currentTime)}</p>
          </div>
        </div>
      )}

      {attendance.time_in && attendance.time_out && (
        <div className="text-center p-6 border rounded-lg">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <p className="text-lg font-semibold">Attendance completed for today</p>
          <p className="text-sm text-muted-foreground">Great job! See you tomorrow.</p>
        </div>
      )}
    </div>
  )
}
