"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Clock, 
  Bell, 
  Shield, 
  Save 
} from "lucide-react";

interface HRSettingsViewProps {
  // Add any settings-related props here
}

export default function HRSettingsView({}: HRSettingsViewProps) {
  return (
    <div className="space-y-4">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Attendance Settings
          </CardTitle>
          <CardDescription>Configure attendance system settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Working Hours Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Working Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Default Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  defaultValue="09:00"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="end-time">Default End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  defaultValue="17:00"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="break-duration">Break Duration (minutes)</Label>
              <Input
                id="break-duration"
                type="number"
                defaultValue="60"
                className="mt-1"
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send attendance alerts via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Late Arrival Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify when employees arrive late</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Absence Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify when employees are absent</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Manager Approval</Label>
                  <p className="text-sm text-muted-foreground">Require manager approval for manual entries</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Audit Trail</Label>
                  <p className="text-sm text-muted-foreground">Keep detailed logs of all changes</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
