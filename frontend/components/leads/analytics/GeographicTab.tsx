"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface GeographicTabProps {
  geographicDistribution: Array<{ city: string; leads: number; revenue: number }>
}

export default function GeographicTab({
  geographicDistribution
}: GeographicTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {geographicDistribution.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{location.city}</p>
                    <p className="text-sm text-muted-foreground">
                      {location.leads} leads • ₹{location.revenue.toLocaleString()} revenue
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{location.leads} leads</p>
                  <p className="text-xs text-muted-foreground">₹{location.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
