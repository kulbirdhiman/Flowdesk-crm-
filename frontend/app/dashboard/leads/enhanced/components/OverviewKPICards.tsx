"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Clock, Brain, TrendingUp, TrendingDown } from "lucide-react"

interface OverviewKPICardsProps {
  totalLeads?: number
  conversionRate?: number
  avgResponseTime?: string
  leadQualityScore?: number
  leadsGrowth?: string
  conversionGrowth?: string
  responseTimeGrowth?: string
}

export default function OverviewKPICards({
  totalLeads = 1234,
  conversionRate = 24.5,
  avgResponseTime = "2.4h",
  leadQualityScore = 87,
  leadsGrowth = "+12%",
  conversionGrowth = "+2.3%",
  responseTimeGrowth = "-15%"
}: OverviewKPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
              <p className="text-2xl font-bold">{totalLeads.toLocaleString()}</p>
              <p className="text-xs text-green-600">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                {leadsGrowth} from last month
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
              <p className="text-xs text-green-600">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                {conversionGrowth} from last month
              </p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">{avgResponseTime}</p>
              <p className="text-xs text-green-600">
                <TrendingDown className="h-3 w-3 inline mr-1" />
                {responseTimeGrowth} from last month
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lead Quality Score</p>
              <p className="text-2xl font-bold">{leadQualityScore}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${leadQualityScore}%` }}></div>
              </div>
            </div>
            <Brain className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
