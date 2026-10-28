"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LeadScore } from "./types"
import ScoreBreakdown from "./ScoreBreakdown"
import RiskOpportunities from "./RiskOpportunities"

interface LeadDetailModalProps {
  lead: LeadScore | null
  onClose: () => void
}

export default function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  if (!lead) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Lead Score Analysis - {lead.name}</span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScoreBreakdown lead={lead} />
          <RiskOpportunities lead={lead} />
        </div>
      </CardContent>
    </Card>
  )
}
