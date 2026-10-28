import { format } from "date-fns"
import { LeadData, LeadAnalytics } from "./types"

export const calculateAnalytics = (leads: LeadData[]): LeadAnalytics => {
  const totalLeads = leads?.length || 0
  const convertedLeads = leads?.filter(lead => lead.stage === 'Converted').length || 0
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
  
  // Calculate average response time (mock calculation)
  const avgResponseTime = Math.random() * 24 // Random between 0-24 hours
  
  // Calculate total revenue
  const totalRevenue = leads?.reduce((sum, lead) => {
    return sum + (parseFloat(lead.deal_amount) || 0)
  }, 0) || 0
  
  const revenueGrowth = Math.random() * 20 - 5 // Random between -5% to 15%
  
  // Calculate lead quality score (mock calculation)
  const leadQualityScore = Math.random() * 40 + 60 // Random between 60-100
  
  // Source analysis
  const sourceCounts: { [key: string]: number } = {}
  const sourceConversions: { [key: string]: number } = {}
  
  leads?.forEach(lead => {
    const source = lead.source || 'Unknown'
    sourceCounts[source] = (sourceCounts[source] || 0) + 1
    if (lead.stage === 'Converted') {
      sourceConversions[source] = (sourceConversions[source] || 0) + 1
    }
  })
  
  const topSources = Object.keys(sourceCounts).map(source => ({
    source,
    count: sourceCounts[source],
    conversion: sourceCounts[source] > 0 ? (sourceConversions[source] || 0) / sourceCounts[source] * 100 : 0
  })).sort((a, b) => b.count - a.count).slice(0, 5)
  
  // Stage distribution
  const stageCounts: { [key: string]: number } = {}
  leads?.forEach(lead => {
    const stage = lead.stage || 'Unknown'
    stageCounts[stage] = (stageCounts[stage] || 0) + 1
  })
  
  const stageDistribution = Object.keys(stageCounts).map(stage => ({
    stage,
    count: stageCounts[stage],
    percentage: totalLeads > 0 ? (stageCounts[stage] / totalLeads) * 100 : 0
  }))
  
  // Response time trend (mock data)
  const responseTimeTrend = Array.from({ length: 30 }, (_, i) => ({
    date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), 'MMM dd'),
    avgTime: Math.random() * 24
  }))
  
  // Lead source performance
  const leadSourcePerformance = topSources.map(source => ({
    source: source.source,
    leads: source.count,
    revenue: Math.random() * 100000,
    conversion: source.conversion
  }))
  
  // Team performance (mock data)
  const teamPerformance = [
    { name: 'John Doe', leads: 45, converted: 12, revenue: 150000, score: 85 },
    { name: 'Jane Smith', leads: 38, converted: 15, revenue: 180000, score: 92 },
    { name: 'Mike Johnson', leads: 52, converted: 8, revenue: 120000, score: 78 },
    { name: 'Sarah Wilson', leads: 41, converted: 18, revenue: 200000, score: 95 }
  ]
  
  // Lead intent analysis (mock data)
  const leadIntentAnalysis = [
    { intent: 'High Intent', count: 25, probability: 85 },
    { intent: 'Medium Intent', count: 45, probability: 60 },
    { intent: 'Low Intent', count: 30, probability: 25 },
    { intent: 'No Intent', count: 20, probability: 5 }
  ]
  
  // Geographic distribution
  const cityCounts: { [key: string]: number } = {}
  const cityRevenue: { [key: string]: number } = {}
  
  leads?.forEach(lead => {
    const city = lead.city || 'Unknown'
    cityCounts[city] = (cityCounts[city] || 0) + 1
    cityRevenue[city] = (cityRevenue[city] || 0) + (parseFloat(lead.deal_amount) || 0)
  })
  
  const geographicDistribution = Object.keys(cityCounts).map(city => ({
    city,
    leads: cityCounts[city],
    revenue: cityRevenue[city]
  })).sort((a, b) => b.leads - a.leads).slice(0, 10)
  
  // Time-based analysis (mock data)
  const timeBasedAnalysis = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    leads: Math.floor(Math.random() * 20),
    conversion: Math.random() * 30 + 10
  }))
  
  return {
    totalLeads,
    convertedLeads,
    conversionRate,
    avgResponseTime,
    totalRevenue,
    revenueGrowth,
    leadQualityScore,
    topSources,
    stageDistribution,
    responseTimeTrend,
    leadSourcePerformance,
    teamPerformance,
    leadIntentAnalysis,
    geographicDistribution,
    timeBasedAnalysis
  }
}

export const exportReport = (analytics: LeadAnalytics) => {
  // Mock export functionality
  console.log('Exporting analytics report:', analytics)
  // In a real implementation, this would generate and download a report
}
