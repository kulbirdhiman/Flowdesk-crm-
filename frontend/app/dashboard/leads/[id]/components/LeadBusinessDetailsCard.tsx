"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function LeadBusinessDetailsCard({ lead }: { lead: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Business Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Deal Amount</p>
            <p className="text-sm font-medium mt-1">{lead.deal_amount ? `₹${lead.deal_amount.toLocaleString()}` : "-"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Client Budget</p>
            <p className="text-sm font-medium mt-1">{lead.client_budget || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Current Business Turnover</p>
            <p className="text-sm font-medium mt-1">{lead.current_business_turnover || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Expected Closing</p>
            <p className="text-sm font-medium mt-1">{lead.expected_closing ? new Date(lead.expected_closing).toLocaleDateString() : "-"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


