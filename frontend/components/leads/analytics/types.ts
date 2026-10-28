export interface LeadAnalytics {
  totalLeads: number
  convertedLeads: number
  conversionRate: number
  avgResponseTime: number
  totalRevenue: number
  revenueGrowth: number
  leadQualityScore: number
  topSources: Array<{ source: string; count: number; conversion: number }>
  stageDistribution: Array<{ stage: string; count: number; percentage: number }>
  responseTimeTrend: Array<{ date: string; avgTime: number }>
  leadSourcePerformance: Array<{ source: string; leads: number; revenue: number; conversion: number }>
  teamPerformance: Array<{ name: string; leads: number; converted: number; revenue: number; score: number }>
  leadIntentAnalysis: Array<{ intent: string; count: number; probability: number }>
  geographicDistribution: Array<{ city: string; leads: number; revenue: number }>
  timeBasedAnalysis: Array<{ hour: number; leads: number; conversion: number }>
}

export interface LeadData {
  whalesync_postgres_id: string
  stage?: string
  deal_amount?: string
  source?: string
  city?: string
  date_and_time?: string
  [key: string]: any
}
