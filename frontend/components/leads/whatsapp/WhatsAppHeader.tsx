"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, FileText, Users } from "lucide-react"

interface WhatsAppHeaderProps {
  onTemplatesClick: () => void
  onCampaignsClick: () => void
}

export default function WhatsAppHeader({
  onTemplatesClick,
  onCampaignsClick
}: WhatsAppHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: 'Geist, sans-serif' }}>
          <MessageCircle className="h-6 w-6 text-green-500" />
          WhatsApp Integration
        </h2>
        <p className="text-muted-foreground">
          Direct communication with leads through WhatsApp
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onTemplatesClick}>
          <FileText className="h-4 w-4 mr-2" />
          Templates
        </Button>
        <Button variant="outline" size="sm" onClick={onCampaignsClick}>
          <Users className="h-4 w-4 mr-2" />
          Campaigns
        </Button>
      </div>
    </div>
  )
}
