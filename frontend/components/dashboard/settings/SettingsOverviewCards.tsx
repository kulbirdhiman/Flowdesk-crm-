"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Bell, Shield, Globe } from "lucide-react"
import { SystemSettings } from "./types"

interface SettingsOverviewCardsProps {
  settings: SystemSettings
}

export default function SettingsOverviewCards({ settings }: SettingsOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
            General Settings
          </CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
            {settings.general.companyName}
          </div>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
            {settings.general.timezone}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
            Notifications
          </CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
            {Object.values(settings.notifications).filter(Boolean).length}
          </div>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
            Active notifications
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
            Security
          </CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
            {settings.security.twoFactorAuth ? "2FA" : "Basic"}
          </div>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
            Authentication level
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
            Integrations
          </CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
            {Object.values(settings.integrations).filter(Boolean).length}
          </div>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
            Active integrations
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
