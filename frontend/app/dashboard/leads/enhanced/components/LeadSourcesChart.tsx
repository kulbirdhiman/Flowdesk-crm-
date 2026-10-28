"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "lucide-react"

interface LeadSource {
  name: string
  percentage: number
  color: string
}

interface LeadSourcesChartProps {
  sources?: LeadSource[]
}

const DEFAULT_SOURCES: LeadSource[] = [
  { name: "Website", percentage: 45, color: "bg-blue-500" },
  { name: "Referral", percentage: 25, color: "bg-green-500" },
  { name: "Social Media", percentage: 20, color: "bg-yellow-500" },
  { name: "Cold Call", percentage: 10, color: "bg-purple-500" }
]

export default function LeadSourcesChart({ sources = DEFAULT_SOURCES }: LeadSourcesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Lead Sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sources.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                <span className="text-sm">{source.name}</span>
              </div>
              <span className="text-sm font-medium">{source.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
