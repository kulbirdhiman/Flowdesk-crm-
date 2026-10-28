export interface AttendanceRecord {
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

export interface EmployeeInfo {
  id: string
  name: string
  isTechTeam: boolean
  photo: string
}

export interface DeviceInfo {
  isPC: boolean
  isCompanyWifi: boolean
  ipAddress: string
}

export interface AttendanceStatus {
  present: string
  late: string
  halfDay: string
  absent: string
}

export const ATTENDANCE_STATUS: AttendanceStatus = {
  present: 'Present',
  late: 'Late',
  halfDay: 'Half Day',
  absent: 'Absent'
}

export const OFFICE_TIMINGS = {
  regular: {
    start: '09:30:00',
    end: '18:30:00'
  },
  tech: {
    start: '10:00:00',
    end: '18:00:00'
  }
}

export const GRACE_PERIOD_MINUTES = 15
