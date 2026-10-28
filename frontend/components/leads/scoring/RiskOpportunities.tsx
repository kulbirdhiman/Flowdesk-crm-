"use client"

import { AlertTriangle, CheckCircle } from "lucide-react"
import { LeadScore } from "./types"

interface RiskOpportunitiesProps {
  lead: LeadScore
}

export default function RiskOpportunities({ lead }: RiskOpportunitiesProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-red-600 mb-2">Risk Factors</h4>
        <div className="space-y-1">
          {lead.riskFactors.map((risk, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="h-4 w-4" />
              {risk}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-green-600 mb-2">Opportunities</h4>
        <div className="space-y-1">
          {lead.opportunities.map((opportunity, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              {opportunity}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
