"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart } from "lucide-react"

interface TrendData {
  period: string
  growth: string
  isPositive: boolean
}

interface LeadTrendsChartProps {
  trends?: TrendData[]
}

const DEFAULT_TRENDS: TrendData[] = [
  { period: "This Week", growth: "+15%", isPositive: true },
  { period: "This Month", growth: "+12%", isPositive: true },
  { period: "This Quarter", growth: "+8%", isPositive: true },
  { period: "This Year", growth: "+25%", isPositive: true }
]

export default function LeadTrendsChart({ trends = DEFAULT_TRENDS }: LeadTrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          Lead Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{trend.period}</span>
              <Badge className={trend.isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {trend.growth}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
