"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ChevronLeft, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

interface LeadHeaderProps {
  lead: any;
  initials: string;
  getStageColor: (stage: string) => string;
  onBack: () => void;
}

export default function LeadHeader({ lead, initials, getStageColor, onBack }: LeadHeaderProps) {
  return (
    <Card className="bg-gradient-to-t from-primary/5 to-card shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="flex flex-col items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 self-start">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Avatar className="h-20 w-20 border-2 border-border">
              {lead.assigned_to?.profile_photo && (
                <AvatarImage src={lead.assigned_to.profile_photo} alt={lead.name || "Lead"} />
              )}
              <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold">{lead.name}</h1>
              {lead.stage && <Badge className={getStageColor(lead.stage)}>{lead.stage}</Badge>}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {lead.mobile && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{lead.mobile}</span>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate max-w-[200px]">{lead.email}</span>
                </div>
              )}
              {lead.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{lead.city}</span>
                </div>
              )}
            </div>

            {lead.assigned_to && (
              <div className="text-sm text-muted-foreground">
                Assigned to: <span className="font-medium text-foreground">{lead.assigned_to.full_name}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="default" className="gap-2" onClick={() => (window.location.href = `tel:${lead.mobile}`)} disabled={!lead.mobile}>
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button size="sm" variant="outline" className="gap-2" onClick={() => window.open(`https://wa.me/${lead.mobile}`, "_blank")} disabled={!lead.mobile}>
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}


