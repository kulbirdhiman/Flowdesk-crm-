"use client"

import OverviewKPICards from "./OverviewKPICards"
import LeadSourcesChart from "./LeadSourcesChart"
import LeadTrendsChart from "./LeadTrendsChart"

interface OverviewTabProps {
  totalLeads?: number
  conversionRate?: number
  avgResponseTime?: string
  leadQualityScore?: number
  leadsGrowth?: string
  conversionGrowth?: string
  responseTimeGrowth?: string
}

export default function OverviewTab({
  totalLeads,
  conversionRate,
  avgResponseTime,
  leadQualityScore,
  leadsGrowth,
  conversionGrowth,
  responseTimeGrowth
}: OverviewTabProps) {
  return (
    <div className="space-y-4">
      <OverviewKPICards
        totalLeads={totalLeads}
        conversionRate={conversionRate}
        avgResponseTime={avgResponseTime}
        leadQualityScore={leadQualityScore}
        leadsGrowth={leadsGrowth}
        conversionGrowth={conversionGrowth}
        responseTimeGrowth={responseTimeGrowth}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LeadSourcesChart />
        <LeadTrendsChart />
      </div>
    </div>
  )
}
