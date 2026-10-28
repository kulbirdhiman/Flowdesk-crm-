"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, Mail, MapPin, DollarSign } from "lucide-react"

interface Lead {
  whalesync_postgres_id: string
  name: string
  phone: string
  email: string
  city: string
  deal_amount: string
  [key: string]: any
}

interface LeadSelectorProps {
  selectedLead: Lead | null
}

export default function LeadSelector({ selectedLead }: LeadSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Select Lead
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {selectedLead ? (
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{selectedLead.name}</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  {selectedLead.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  {selectedLead.email}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  {selectedLead.city}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3" />
                  ₹{parseFloat(selectedLead.deal_amount || 0).toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-8 w-8 mx-auto mb-2" />
              <p>Select a lead to start messaging</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
