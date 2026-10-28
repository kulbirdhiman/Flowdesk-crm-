"use client"

import { LeadScore } from "./types"

interface ScoreBreakdownProps {
  lead: LeadScore
}

export default function ScoreBreakdown({ lead }: ScoreBreakdownProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Score Breakdown</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Demographic Factors</span>
          <span className="text-sm font-medium">{lead.scoreBreakdown.demographic.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Behavioral Patterns</span>
          <span className="text-sm font-medium">{lead.scoreBreakdown.behavioral.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Engagement Level</span>
          <span className="text-sm font-medium">{lead.scoreBreakdown.engagement.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Purchase Intent</span>
          <span className="text-sm font-medium">{lead.scoreBreakdown.intent.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Timing Factors</span>
          <span className="text-sm font-medium">{lead.scoreBreakdown.timing.toFixed(1)}</span>
        </div>
      </div>
    </div>
  )
}
