"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell } from "lucide-react"
import { SystemSettings } from "./types"

interface NotificationsSettingsTabProps {
  settings: SystemSettings
  onSettingChange: (category: keyof SystemSettings, key: string, value: any) => void
}

export default function NotificationsSettingsTab({
  settings,
  onSettingChange
}: NotificationsSettingsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              Notification Channels
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                    Send notifications via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => onSettingChange('notifications', 'emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                    Send notifications via SMS
                  </p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.notifications.smsNotifications}
                  onCheckedChange={(checked) => onSettingChange('notifications', 'smsNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                    Send browser push notifications
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => onSettingChange('notifications', 'pushNotifications', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
              Event Notifications
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="leadAssigned">Lead Assigned</Label>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                    Notify when a lead is assigned
                  </p>
                </div>
                <Switch
                  id="leadAssigned"
                  checked={settings.notifications.leadAssigned}
                  onCheckedChange={(checked) => onSettingChange('notifications', 'leadAssigned', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="leadConverted">Lead Converted</Label>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                    Notify when a lead is converted
                  </p>
                </div>
                <Switch
                  id="leadConverted"
                  checked={settings.notifications.leadConverted}
                  onCheckedChange={(checked) => onSettingChange('notifications', 'leadConverted', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="taskReminder">Task Reminders</Label>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
                    Send task reminder notifications
                  </p>
                </div>
                <Switch
                  id="taskReminder"
                  checked={settings.notifications.taskReminder}
                  onCheckedChange={(checked) => onSettingChange('notifications', 'taskReminder', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
