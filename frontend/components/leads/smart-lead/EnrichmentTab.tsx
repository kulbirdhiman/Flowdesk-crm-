"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  Star, 
  Phone, 
  MapPin, 
  DollarSign, 
  Building, 
  Users, 
  Target 
} from "lucide-react"
import { Lead } from "./types"

interface EnrichmentTabProps {
  leads: Lead[]
  selectedLeads: Set<string>
  onToggleSelection: (leadId: string) => void
  onEnrichSelected: () => void
  loading: boolean
}

export default function EnrichmentTab({
  leads,
  selectedLeads,
  onToggleSelection,
  onEnrichSelected,
  loading
}: EnrichmentTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Enrichment</h3>
          <p className="text-sm text-muted-foreground">
            Enhance lead data with additional information
          </p>
        </div>
        <Button 
          onClick={onEnrichSelected}
          disabled={selectedLeads.size === 0 || loading}
        >
          <Zap className="h-4 w-4 mr-2" />
          Enrich Selected ({selectedLeads.size})
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map((lead) => (
          <Card 
            key={lead.id} 
            className={`cursor-pointer transition-all ${
              selectedLeads.has(lead.id) ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onToggleSelection(lead.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold">{lead.name}</h4>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                </div>
                {lead.enrichedData && (
                  <Badge className="bg-green-100 text-green-800">
                    <Star className="h-3 w-3 mr-1" />
                    Enriched
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3" />
                  {lead.phone}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3" />
                  {lead.city}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-3 w-3" />
                  ₹{lead.dealAmount.toLocaleString()}
                </div>
              </div>

              {lead.enrichedData && (
                <div className="mt-4 pt-4 border-t">
                  <h5 className="text-sm font-medium mb-2">Enriched Data</h5>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building className="h-3 w-3" />
                      {lead.enrichedData.companyName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {lead.enrichedData.jobTitle}
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-3 w-3" />
                      {lead.enrichedData.industry}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
