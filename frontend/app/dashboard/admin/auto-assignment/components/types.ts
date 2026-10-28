export interface EmployeeFields {
  whalesync_postgres_id: string
  full_name: string
  job_title?: string
  profile_photo?: string
}

export interface LeadFields {
  whalesync_postgres_id: string
  services?: string
  assigned_to?: string
  [key: string]: any
}

export interface SavedConfig {
  [serviceName: string]: string[]
}

export interface ServiceStats {
  totalServices: number
  configuredServices: number
}
