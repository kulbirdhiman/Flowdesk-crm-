"use client"

import { Button } from "@/components/ui/button"
import { Download, Settings, Plus } from "lucide-react"

interface EnhancedLeadsHeaderProps {
  onExport?: () => void
  onSettings?: () => void
  onAddLead?: () => void
}

export default function EnhancedLeadsHeader({
  onExport,
  onSettings,
  onAddLead
}: EnhancedLeadsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
          Enhanced Leads Management
        </h1>
        <p className="text-muted-foreground">
          AI-powered lead management with advanced analytics and automation
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={onSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button size="sm" onClick={onAddLead}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>
    </div>
  )
}
