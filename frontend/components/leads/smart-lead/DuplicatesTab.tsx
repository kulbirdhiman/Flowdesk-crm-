"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Merge, 
  Eye,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar
} from "lucide-react"
import { format } from "date-fns"
import { Lead, DuplicateGroup } from "./types"

interface DuplicatesTabProps {
  duplicates: DuplicateGroup[]
  onMergeLeads: (duplicateGroup: DuplicateGroup) => void
  getConfidenceColor: (confidence: number) => string
}

export default function DuplicatesTab({
  duplicates,
  onMergeLeads,
  getConfidenceColor
}: DuplicatesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Duplicate Detection</h3>
          <p className="text-sm text-muted-foreground">
            Found {duplicates.length} potential duplicate groups
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="space-y-4">
        {duplicates.map((group) => (
          <Card key={group.id} className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold">
                      {group.leads.length} potential duplicates
                    </span>
                    <Badge className={getConfidenceColor(group.confidence)}>
                      {group.confidence.toFixed(0)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Reason: {group.reason}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMergeLeads(group)}
                  >
                    <Merge className="h-4 w-4 mr-2" />
                    Merge
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.leads.map((lead) => (
                  <div key={lead.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{lead.name}</h4>
                      <Badge variant="outline">{lead.stage}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {lead.city}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3" />
                        ₹{lead.dealAmount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(lead.dateCreated), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {duplicates.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Duplicates Found</h3>
              <p className="text-muted-foreground">
                Your lead database appears to be clean with no duplicate entries detected.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
