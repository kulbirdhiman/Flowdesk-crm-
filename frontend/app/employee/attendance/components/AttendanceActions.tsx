"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

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

interface AttendanceActionsProps {
  attendance: AttendanceRecord | null
  isLoading: boolean
  deviceInfo: {
    isPC: boolean
    isCompanyWifi: boolean
    ipAddress: string
  }
  onCheckIn: () => void
  onCheckOut: () => void
}

export default function AttendanceActions({
  attendance,
  isLoading,
  deviceInfo,
  onCheckIn,
  onCheckOut
}: AttendanceActionsProps) {
  if (!attendance) {
    return (
      <div className="space-y-4">
        <Button
          onClick={onCheckIn}
          disabled={isLoading || !deviceInfo.isPC}
          className="bg-green-600 hover:bg-green-700 w-full"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Check In Now
        </Button>
        
        {!deviceInfo.isPC && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 font-medium">
              Please use PC/laptop to mark attendance
            </p>
          </div>
        )}
      </div>
    )
  }

  if (!attendance.time_in) {
    return (
      <Button
        onClick={onCheckIn}
        disabled={isLoading || !deviceInfo.isPC}
        className="bg-green-600 hover:bg-green-700"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Check In Now
      </Button>
    )
  }

  if (!attendance.time_out) {
    return (
      <Button
        onClick={onCheckOut}
        disabled={isLoading}
        className="bg-red-600 hover:bg-red-700 w-full"
      >
        <XCircle className="mr-2 h-4 w-4" />
        Check Out Now
      </Button>
    )
  }

  return null
}
