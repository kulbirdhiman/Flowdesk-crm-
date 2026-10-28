"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3 } from "lucide-react"

interface QuickStatsCardProps {
  totalServices: number
  configuredServices: number
  totalAssigned: number
  availableStaff: number
}

export default function QuickStatsCard({
  totalServices,
  configuredServices,
  totalAssigned,
  availableStaff
}: QuickStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Services</span>
          <Badge variant="outline">{totalServices}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Configured</span>
          <Badge variant={configuredServices > 0 ? "default" : "secondary"}>
            {configuredServices}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Assigned Employees</span>
          <Badge variant="outline">{totalAssigned}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Available Staff</span>
          <Badge variant="outline">{availableStaff}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
