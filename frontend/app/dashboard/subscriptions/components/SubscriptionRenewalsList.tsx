"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Subscription {
  id: string;
  subscription_name: string;
  expiry_date?: string;
  owner?: {
    full_name: string;
  };
}

interface SubscriptionRenewalsListProps {
  upcomingRenewals: Subscription[];
  onSubscriptionClick: (subscription: Subscription) => void;
  getDaysUntilExpiry: (dateString: string | undefined) => number;
  formatDate: (dateString: string | undefined) => string;
}

export default function SubscriptionRenewalsList({
  upcomingRenewals,
  onSubscriptionClick,
  getDaysUntilExpiry,
  formatDate
}: SubscriptionRenewalsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Required: Renewing Soon</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {upcomingRenewals.length > 0 ? (
            upcomingRenewals.map(sub => (
              <div 
                key={sub.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                onClick={() => onSubscriptionClick(sub)}
              >
                <div>
                  <p className="font-semibold">{sub.subscription_name}</p>
                  <p className="text-sm text-muted-foreground">{sub.owner?.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-destructive">
                    {getDaysUntilExpiry(sub.expiry_date)} days
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDate(sub.expiry_date)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center p-4">No renewals in the next 30 days.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
