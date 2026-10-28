export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  city: string
  source: string
  stage: string
  services: string
  dealAmount: number
  dateCreated: string
  assignedTo: string
  enrichedData?: {
    companyName?: string
    jobTitle?: string
    industry?: string
    companySize?: string
    socialProfiles?: string[]
    additionalEmails?: string[]
    additionalPhones?: string[]
  }
}

export interface DuplicateGroup {
  id: string
  confidence: number
  reason: string
  leads: Lead[]
  suggestedAction: 'merge' | 'keep_separate' | 'manual_review'
}

export interface EnrichmentResult {
  leadId: string
  status: 'success' | 'partial' | 'failed'
  newData: any
  confidence: number
  sources: string[]
}

export interface LeadData {
  whalesync_postgres_id: string
  name: string
  email: string
  phone: string
  city: string
  source: string
  stage: string
  services: string
  deal_amount: string
  date_and_time: string
  assigned_to: string
  [key: string]: any
}
