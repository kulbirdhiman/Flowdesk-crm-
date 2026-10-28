"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"
import { AnalyticsData } from "./types"

interface PerformanceTabProps {
  data: AnalyticsData | null
  formatPercentage: (value: number) => string
}

export default function PerformanceTab({
  data,
  formatPercentage
}: PerformanceTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            <Activity className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Revenue Growth
                </div>
                <div className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Compared to previous period
                </div>
              </div>
              <Badge variant={data?.revenue.growth && data.revenue.growth >= 0 ? "default" : "destructive"}>
                {formatPercentage(data?.revenue.growth || 0)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Lead Growth
                </div>
                <div className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                  New leads compared to previous period
                </div>
              </div>
              <Badge variant={data?.leads.growth && data.leads.growth >= 0 ? "default" : "destructive"}>
                {formatPercentage(data?.leads.growth || 0)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Conversion Improvement
                </div>
                <div className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Conversion rate change
                </div>
              </div>
              <Badge variant={data?.conversion.growth && data.conversion.growth >= 0 ? "default" : "destructive"}>
                {formatPercentage(data?.conversion.growth || 0)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
