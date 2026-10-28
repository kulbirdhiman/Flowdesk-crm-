"use client"

import { Button } from "@/components/ui/button"
import { Brain, Zap, RefreshCw } from "lucide-react"

interface SmartLeadHeaderProps {
  onEnrichData: () => void
  onRefresh: () => void
}

export default function SmartLeadHeader({
  onEnrichData,
  onRefresh
}: SmartLeadHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
          <Brain className="h-6 w-6" />
          Smart Lead Management
        </h2>
        <p className="text-muted-foreground">
          AI-powered lead optimization and data enrichment
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onEnrichData}>
          <Zap className="h-4 w-4 mr-2" />
          Enrich Data
        </Button>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  )
}
