"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette } from "lucide-react"
import { SystemSettings } from "./types"

interface AppearanceSettingsTabProps {
  settings: SystemSettings
  onSettingChange: (category: keyof SystemSettings, key: string, value: any) => void
}

export default function AppearanceSettingsTab({
  settings,
  onSettingChange
}: AppearanceSettingsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            <Palette className="h-5 w-5" />
            Appearance Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={settings.appearance.theme} onValueChange={(value) => onSettingChange('appearance', 'theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => onSettingChange('appearance', 'primaryColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={settings.appearance.primaryColor}
                  onChange={(e) => onSettingChange('appearance', 'primaryColor', e.target.value)}
                  placeholder="#3b82f6"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="customCss">Custom CSS</Label>
            <Textarea
              id="customCss"
              value={settings.appearance.customCss}
              onChange={(e) => onSettingChange('appearance', 'customCss', e.target.value)}
              placeholder="Enter custom CSS code..."
              className="min-h-32 font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
