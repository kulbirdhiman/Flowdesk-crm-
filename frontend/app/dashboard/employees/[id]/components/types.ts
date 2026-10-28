export interface EmployeeData {
  id: number
  whalesync_postgres_id?: string
  full_name: string
  official_email: string
  official_contact_number?: string
  job_title?: string
  date_of_joining?: string
  employment_type?: string
  status?: string
  profile_photo?: string
  linkedin_profile?: string
  department?: number
  reporting_manager?: number
  monthly_payroll?: number
  bank_details?: string
  dob?: string
  permanent_address?: string
  Notes?: string
  teams?: {
    team_name: string
  }
}

export interface CallData {
  whalesync_postgres_id: string
  employee: string
  client_name?: string
  client_number?: string
  call_date: string
  duration: number
  call_type: string
}

export interface AttendanceData {
  employee: string
  date: string
  status: string
}

export interface DocumentData {
  id?: number
  employee: string
  document_name: string
  document_type: string
  collection_status: string
  issued_date?: string
  attachment?: string
}

export interface Department {
  whalesync_postgres_id: string
  department_name: string
}

export interface Manager {
  full_name: string
  profile_photo?: string
}

export interface DirectReport {
  id: number
  full_name: string
  profile_photo?: string
}

export interface BankDetails {
  bankName: string
  accountNumber: string
  ifscCode: string
}

export const DOCUMENT_TYPES = [
  "Identity & KYC Proof",
  "Employment & Company Records", 
  "Education & Qualification Proof",
  "General"
] as const

export const COLLECTION_STATUS = [
  "Submitted",
  "Not Submitted",
  "N/A"
] as const

export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent", 
  HALF_DAY: "half day",
  LATE: "late"
} as const

export const CALL_TYPES = {
  INCOMING: "Incoming",
  OUTGOING: "Outgoing"
} as const
