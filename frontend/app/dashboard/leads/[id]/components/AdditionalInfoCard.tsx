"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdditionalInfoCard({ lead }: { lead: any }) {
  if (!(lead.any_other_interests || lead.call_notes || lead.call_remark)) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lead.any_other_interests && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Other Interests</p>
            <p className="text-sm mt-1">{lead.any_other_interests}</p>
          </div>
        )}
        {lead.call_notes && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Call Notes</p>
            <p className="text-sm mt-1">{lead.call_notes}</p>
          </div>
        )}
        {lead.call_remark && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Call Remark</p>
            <p className="text-sm mt-1">{lead.call_remark}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


