"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnalyticsData } from "./types"

interface RevenueTabProps {
  data: AnalyticsData | null
  formatCurrency: (amount: number) => string
  formatPercentage: (value: number) => string
}

export default function RevenueTab({
  data,
  formatCurrency,
  formatPercentage
}: RevenueTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            <DollarSign className="h-5 w-5" />
            Revenue Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Geist, sans-serif' }}>
                {formatCurrency(data?.revenue.current || 0)}
              </div>
              <div className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                Current Period
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Geist, sans-serif' }}>
                {formatCurrency(data?.revenue.previous || 0)}
              </div>
              <div className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                Previous Period
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={cn(
                "text-2xl font-bold",
                (data?.revenue.growth || 0) >= 0 ? "text-green-600" : "text-red-600"
              )} style={{ fontFamily: 'Geist, sans-serif' }}>
                {formatPercentage(data?.revenue.growth || 0)}
              </div>
              <div className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                Growth Rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
