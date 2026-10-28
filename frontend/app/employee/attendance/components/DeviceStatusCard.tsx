"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Wifi } from "lucide-react"

interface DeviceInfo {
  isPC: boolean
  isCompanyWifi: boolean
  ipAddress: string
}

interface DeviceStatusCardProps {
  deviceInfo: DeviceInfo
}

export default function DeviceStatusCard({ deviceInfo }: DeviceStatusCardProps) {
  return (
    <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Monitor className="h-4 w-4 text-primary" />
          Device Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${deviceInfo.isPC ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">{deviceInfo.isPC ? 'PC/Laptop' : 'Mobile Device'}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-sm text-muted-foreground">Any Network Allowed</span>
        </div>
      </CardContent>
    </Card>
  )
}
