"use client";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

interface SubscriptionStats {
  total: number;
  active: number;
  renewalsSoon: number;
}

interface SubscriptionStatisticsCardsProps {
  stats: SubscriptionStats;
}

export default function SubscriptionStatisticsCards({ stats }: SubscriptionStatisticsCardsProps) {
  return (
    <div className="pt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription>Total Subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription>Active Subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription>Renewals in Next 30 Days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.renewalsSoon}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
