"use client"

import { Button } from "@/components/ui/button"
import { Brain, Settings, RefreshCw } from "lucide-react"

interface LeadScoringHeaderProps {
  onToggleRules: () => void
  onRefresh: () => void
  showRules: boolean
}

export default function LeadScoringHeader({
  onToggleRules,
  onRefresh,
  showRules
}: LeadScoringHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
          <Brain className="h-6 w-6" />
          AI-Powered Lead Scoring
        </h2>
        <p className="text-muted-foreground">
          Intelligent lead prioritization based on multiple factors
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToggleRules}>
          <Settings className="h-4 w-4 mr-2" />
          Scoring Rules
        </Button>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  )
}
