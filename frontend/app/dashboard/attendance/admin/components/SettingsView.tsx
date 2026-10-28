"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Edit, 
  Plus
} from "lucide-react";

interface Settings {
  autoApproval: boolean;
  lateMarkingAlerts: boolean;
  exceptionNotifications: boolean;
}

interface SettingsViewProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

export function SettingsView({ settings, setSettings }: SettingsViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Settings</CardTitle>
        <CardDescription>Configure attendance policies and rules</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-approval">Auto-approve attendance</Label>
              <p className="text-sm text-slate-600">Automatically approve attendance within policy</p>
            </div>
            <Switch 
              id="auto-approval" 
              checked={settings.autoApproval}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, autoApproval: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="late-marking-alerts">Late marking alerts</Label>
              <p className="text-sm text-slate-600">Get notified when attendance is marked late</p>
            </div>
            <Switch 
              id="late-marking-alerts" 
              checked={settings.lateMarkingAlerts}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, lateMarkingAlerts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="exception-notifications">Exception notifications</Label>
              <p className="text-sm text-slate-600">Receive alerts for attendance exceptions</p>
            </div>
            <Switch 
              id="exception-notifications" 
              checked={settings.exceptionNotifications}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, exceptionNotifications: checked })
              }
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-4">Holiday Calendar</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">New Year's Day</p>
                <p className="text-sm text-slate-600">January 1, 2024</p>
              </div>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Independence Day</p>
                <p className="text-sm text-slate-600">July 4, 2024</p>
              </div>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button className="mt-4" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Holiday
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
