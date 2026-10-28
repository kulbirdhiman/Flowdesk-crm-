import { AttendanceRecord, EmployeeInfo, DeviceInfo, ATTENDANCE_STATUS, OFFICE_TIMINGS, GRACE_PERIOD_MINUTES } from "./types"

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

export const getStatusColor = (status: string): string => {
  if (status.includes('Present')) return 'bg-green-500'
  if (status.includes('Late')) return 'bg-yellow-500'
  if (status.includes('Half Day')) return 'bg-orange-500'
  if (status.includes('Absent')) return 'bg-red-500'
  return 'bg-gray-500'
}

export const calculateStatus = (checkInTime: string, isTechTeam: boolean): string => {
  const now = new Date()
  const checkIn = new Date(`${now.toISOString().split('T')[0]}T${checkInTime}`)
  
  // Office timings
  const officeStart = new Date(`${now.toISOString().split('T')[0]}T${OFFICE_TIMINGS.regular.start}`)
  const techStart = new Date(`${now.toISOString().split('T')[0]}T${OFFICE_TIMINGS.tech.start}`)
  const halfDayCutoff = new Date(`${now.toISOString().split('T')[0]}T12:00:00`)
  
  const startTime = isTechTeam ? techStart : officeStart
  
  // Check if after half day cutoff
  if (checkIn >= halfDayCutoff) {
    return ATTENDANCE_STATUS.halfDay
  }
  
  // Check if within grace period
  const diffMinutes = (checkIn.getTime() - startTime.getTime()) / (1000 * 60)
  
  if (diffMinutes <= GRACE_PERIOD_MINUTES) {
    return ATTENDANCE_STATUS.present
  } else {
    return ATTENDANCE_STATUS.late
  }
}

export const calculateWorkingHours = (timeIn: number, timeOut: number, date: string): number => {
  const checkInTime = new Date(`${date}T${timeIn.toString().replace('.', ':')}:00`)
  const checkOutTime = new Date(`${date}T${timeOut.toString().replace('.', ':')}:00`)
  return (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
}

export const checkForOvertime = (checkOutTime: Date, isTechTeam: boolean, date: string): boolean => {
  const officeEnd = new Date(`${date}T${OFFICE_TIMINGS.regular.end}`)
  const techEnd = new Date(`${date}T${OFFICE_TIMINGS.tech.end}`)
  const endTime = isTechTeam ? techEnd : officeEnd
  
  return checkOutTime > endTime
}

export const formatTimeFromNumber = (timeNumber: number): string => {
  return timeNumber.toString().replace('.', ':')
}

export const parseTimeToNumber = (timeString: string): number => {
  return parseFloat(timeString.replace(':', '.'))
}

export const isDevicePC = (): boolean => {
  return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const getEmployeeInitials = (name: string): string => {
  return name?.split(' ').map(n => n[0]).join('') || 'E'
}

export const validateAttendanceData = (attendance: AttendanceRecord): boolean => {
  return !!(attendance.employee && attendance.date && attendance.status)
}

export const getAttendanceSummary = (attendanceHistory: AttendanceRecord[]) => {
  const summary = {
    totalDays: attendanceHistory.length,
    presentDays: 0,
    lateDays: 0,
    halfDays: 0,
    absentDays: 0,
    totalWorkingHours: 0
  }

  attendanceHistory.forEach(record => {
    if (record.status.includes('Present')) summary.presentDays++
    else if (record.status.includes('Late')) summary.lateDays++
    else if (record.status.includes('Half Day')) summary.halfDays++
    else if (record.status.includes('Absent')) summary.absentDays++
    
    if (record.working_hours) {
      summary.totalWorkingHours += record.working_hours
    }
  })

  return summary
}
