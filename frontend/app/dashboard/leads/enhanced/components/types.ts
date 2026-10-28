export interface LeadMetrics {
  totalLeads: number
  conversionRate: number
  avgResponseTime: string
  leadQualityScore: number
  leadsGrowth: string
  conversionGrowth: string
  responseTimeGrowth: string
}

export interface LeadSource {
  name: string
  percentage: number
  color: string
}

export interface TrendData {
  period: string
  growth: string
  isPositive: boolean
}

export interface AutomationWorkflow {
  id: string
  icon: any
  title: string
  description: string
  status: "Active" | "Draft" | "Paused"
  iconColor: string
  createdAt: string
  updatedAt: string
}

export const DEFAULT_METRICS: LeadMetrics = {
  totalLeads: 1234,
  conversionRate: 24.5,
  avgResponseTime: "2.4h",
  leadQualityScore: 87,
  leadsGrowth: "+12%",
  conversionGrowth: "+2.3%",
  responseTimeGrowth: "-15%"
}

export const DEFAULT_SOURCES: LeadSource[] = [
  { name: "Website", percentage: 45, color: "bg-blue-500" },
  { name: "Referral", percentage: 25, color: "bg-green-500" },
  { name: "Social Media", percentage: 20, color: "bg-yellow-500" },
  { name: "Cold Call", percentage: 10, color: "bg-purple-500" }
]

export const DEFAULT_TRENDS: TrendData[] = [
  { period: "This Week", growth: "+15%", isPositive: true },
  { period: "This Month", growth: "+12%", isPositive: true },
  { period: "This Quarter", growth: "+8%", isPositive: true },
  { period: "This Year", growth: "+25%", isPositive: true }
]
