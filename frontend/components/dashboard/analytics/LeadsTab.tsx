"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { AnalyticsData } from "./types"

interface LeadsTabProps {
  data: AnalyticsData | null
}

export default function LeadsTab({ data }: LeadsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            <Users className="h-5 w-5" />
            Lead Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Geist, sans-serif' }}>
                {data?.leads.current || 0}
              </div>
              <div className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                Current Leads
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600" style={{ fontFamily: 'Geist, sans-serif' }}>
                {data?.conversion.current.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                Conversion Rate
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600" style={{ fontFamily: 'Geist, sans-serif' }}>
                {data?.customers.current || 0}
              </div>
              <div className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                New Customers
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
