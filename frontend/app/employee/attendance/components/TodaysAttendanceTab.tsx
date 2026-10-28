"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock3 } from "lucide-react"
import AttendanceStatusDisplay from "./AttendanceStatusDisplay"
import AttendanceActions from "./AttendanceActions"

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

interface TodaysAttendanceTabProps {
  attendance: AttendanceRecord | null
  currentTime: Date
  isLoading: boolean
  deviceInfo: {
    isPC: boolean
    isCompanyWifi: boolean
    ipAddress: string
  }
  onCheckIn: () => void
  onCheckOut: () => void
}

export default function TodaysAttendanceTab({
  attendance,
  currentTime,
  isLoading,
  deviceInfo,
  onCheckIn,
  onCheckOut
}: TodaysAttendanceTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock3 className="h-5 w-5" />
            Today's Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceStatusDisplay 
            attendance={attendance} 
            currentTime={currentTime} 
          />
          
          <div className="flex justify-center mt-6">
            <AttendanceActions
              attendance={attendance}
              isLoading={isLoading}
              deviceInfo={deviceInfo}
              onCheckIn={onCheckIn}
              onCheckOut={onCheckOut}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
