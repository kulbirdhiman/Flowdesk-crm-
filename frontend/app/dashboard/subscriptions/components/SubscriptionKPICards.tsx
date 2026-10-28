"use client";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

interface SubscriptionKPICardsProps {
  totalAnnualCost: number;
  activeSubscriptions: number;
  renewalsSoon: number;
  autoRenewEnabled: number;
  formatCurrency: (amount: number) => string;
}

export default function SubscriptionKPICards({
  totalAnnualCost,
  activeSubscriptions,
  renewalsSoon,
  autoRenewEnabled,
  formatCurrency
}: SubscriptionKPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <CardHeader className="pb-2">
          <CardDescription>Total Annual Cost</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(totalAnnualCost)}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <CardHeader className="pb-2">
          <CardDescription>Active Subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{activeSubscriptions}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <CardHeader className="pb-2">
          <CardDescription>Renewals in Next 30 Days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{renewalsSoon}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <CardHeader className="pb-2">
          <CardDescription>Enabled Auto-Renewals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{autoRenewEnabled}</div>
        </CardContent>
      </Card>
    </div>
  );
}
