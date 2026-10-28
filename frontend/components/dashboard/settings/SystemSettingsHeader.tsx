"use client"

import { Button } from "@/components/ui/button"
import { Save, RefreshCw } from "lucide-react"

interface SystemSettingsHeaderProps {
  onSaveSettings: () => void
  onResetSettings: () => void
  hasChanges: boolean
  loading: boolean
}

export default function SystemSettingsHeader({
  onSaveSettings,
  onResetSettings,
  hasChanges,
  loading
}: SystemSettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
          System Settings
        </h2>
        <p className="text-muted-foreground" style={{ fontFamily: 'Geist, sans-serif' }}>
          Configure system preferences and behavior
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onResetSettings}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={onSaveSettings} disabled={!hasChanges || loading}>
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  )
}
