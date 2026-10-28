"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users } from "lucide-react"
import { format } from "date-fns"
import { ChartData } from "./types"

interface OverviewTabProps {
  chartData: ChartData[]
  formatCurrency: (amount: number) => string
}

export default function OverviewTab({
  chartData,
  formatCurrency
}: OverviewTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
              <TrendingUp className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {chartData.slice(-7).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm" style={{ fontFamily: 'Geist, sans-serif' }}>
                    {format(new Date(item.date), 'MMM dd')}
                  </span>
                  <span className="font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
              <Users className="h-5 w-5" />
              Lead Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {chartData.slice(-7).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm" style={{ fontFamily: 'Geist, sans-serif' }}>
                    {format(new Date(item.date), 'MMM dd')}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{item.leads} leads</Badge>
                    <Badge variant="outline">{item.conversions} converted</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
