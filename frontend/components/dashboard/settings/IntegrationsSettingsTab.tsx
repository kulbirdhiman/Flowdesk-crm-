"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Globe } from "lucide-react"
import { SystemSettings } from "./types"

interface IntegrationsSettingsTabProps {
  settings: SystemSettings
  onSettingChange: (category: keyof SystemSettings, key: string, value: any) => void
}

export default function IntegrationsSettingsTab({
  settings,
  onSettingChange
}: IntegrationsSettingsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            <Globe className="h-5 w-5" />
            Integration Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emailProvider">Email Provider</Label>
              <Select value={settings.integrations.emailProvider} onValueChange={(value) => onSettingChange('integrations', 'emailProvider', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smtp">SMTP</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                  <SelectItem value="ses">Amazon SES</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="smsProvider">SMS Provider</Label>
              <Select value={settings.integrations.smsProvider} onValueChange={(value) => onSettingChange('integrations', 'smsProvider', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="aws-sns">AWS SNS</SelectItem>
                  <SelectItem value="messagebird">MessageBird</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="calendarSync">Calendar Sync</Label>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Sync with Google Calendar
                </p>
              </div>
              <Switch
                id="calendarSync"
                checked={settings.integrations.calendarSync}
                onCheckedChange={(checked) => onSettingChange('integrations', 'calendarSync', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="crmSync">CRM Sync</Label>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Sync with external CRM systems
                </p>
              </div>
              <Switch
                id="crmSync"
                checked={settings.integrations.crmSync}
                onCheckedChange={(checked) => onSettingChange('integrations', 'crmSync', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analyticsTracking">Analytics Tracking</Label>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Enable analytics and tracking
                </p>
              </div>
              <Switch
                id="analyticsTracking"
                checked={settings.integrations.analyticsTracking}
                onCheckedChange={(checked) => onSettingChange('integrations', 'analyticsTracking', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
