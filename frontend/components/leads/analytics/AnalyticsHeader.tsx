"use client"

import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

interface AnalyticsHeaderProps {
  onExportReport: () => void
  onRefresh: () => void
}

export default function AnalyticsHeader({
  onExportReport,
  onRefresh
}: AnalyticsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
          Advanced Analytics Dashboard
        </h2>
        <p className="text-muted-foreground">
          Comprehensive insights into your lead management performance
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  )
}
