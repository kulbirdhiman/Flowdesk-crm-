"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LeadScore } from "./types"

interface LeadScoreCardProps {
  lead: LeadScore
  isSelected: boolean
  onClick: () => void
  getPriorityColor: (priority: string) => string
  getScoreColor: (score: number) => string
}

export default function LeadScoreCard({
  lead,
  isSelected,
  onClick,
  getPriorityColor,
  getScoreColor
}: LeadScoreCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{lead.name}</h3>
            <p className="text-sm text-muted-foreground">{lead.email}</p>
            <p className="text-sm text-muted-foreground">{lead.phone}</p>
          </div>
          <Badge className={getPriorityColor(lead.priority)}>
            {lead.priority} Priority
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Lead Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(lead.totalScore)}`}>
              {lead.totalScore}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                lead.totalScore >= 70 ? 'bg-green-500' :
                lead.totalScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${lead.totalScore}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Conversion Probability</span>
            <span className="text-sm font-medium">{lead.probability}%</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Source</span>
            <Badge variant="outline">{lead.source}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Stage</span>
            <Badge variant="secondary">{lead.stage}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Deal Amount</span>
            <span className="text-sm font-medium">₹{lead.dealAmount.toLocaleString()}</span>
          </div>

          <div className="pt-2 border-t">
            <p className="text-sm font-medium text-blue-600">{lead.nextAction}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
