"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Edit } from "lucide-react"
import { WhatsAppCampaign } from "./types"

interface CampaignsTabProps {
  campaigns: WhatsAppCampaign[]
  onCreateCampaign: () => void
}

export default function CampaignsTab({
  campaigns,
  onCreateCampaign
}: CampaignsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>WhatsApp Campaigns</span>
            <Button onClick={onCreateCampaign}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p>No campaigns created yet</p>
                <p className="text-sm">Create your first WhatsApp campaign to reach multiple leads</p>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {campaign.recipients} recipients • {campaign.sent} sent • {campaign.delivered} delivered
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      campaign.status === 'sent' ? 'default' :
                      campaign.status === 'sending' ? 'secondary' :
                      campaign.status === 'scheduled' ? 'outline' : 'destructive'
                    }>
                      {campaign.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
