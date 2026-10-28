"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield } from "lucide-react"
import { SystemSettings } from "./types"

interface SecuritySettingsTabProps {
  settings: SystemSettings
  onSettingChange: (category: keyof SystemSettings, key: string, value: any) => void
}

export default function SecuritySettingsTab({
  settings,
  onSettingChange
}: SecuritySettingsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            <Shield className="h-5 w-5" />
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Require 2FA for all users
                </p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={settings.security.twoFactorAuth}
                onCheckedChange={(checked) => onSettingChange('security', 'twoFactorAuth', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => onSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                placeholder="30"
              />
            </div>
            
            <div>
              <Label htmlFor="passwordPolicy">Password Policy</Label>
              <Select value={settings.security.passwordPolicy} onValueChange={(value) => onSettingChange('security', 'passwordPolicy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weak">Weak (6+ characters)</SelectItem>
                  <SelectItem value="medium">Medium (8+ characters, mixed case)</SelectItem>
                  <SelectItem value="strong">Strong (12+ characters, special chars)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auditLogging">Audit Logging</Label>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Log all user actions for security
                </p>
              </div>
              <Switch
                id="auditLogging"
                checked={settings.security.auditLogging}
                onCheckedChange={(checked) => onSettingChange('security', 'auditLogging', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
