"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Subscription {
  id: string;
  subscription_name: string;
  vendor?: {
    full_name: string;
  };
  status?: string;
  cost_per_period?: number;
  cost_per_user?: number;
  number_of_users?: number;
}

interface SubscriptionKanbanViewProps {
  subscriptions: Subscription[];
  onSubscriptionClick: (subscription: Subscription) => void;
  formatCurrency: (amount: number | undefined) => string;
  calculateTotalAnnualCost: (sub: Subscription) => number;
  getStatusColor: (status: string | undefined) => string;
}

export default function SubscriptionKanbanView({
  subscriptions,
  onSubscriptionClick,
  formatCurrency,
  calculateTotalAnnualCost,
  getStatusColor
}: SubscriptionKanbanViewProps) {
  const statusColumns = [
    { key: 'Active', label: 'Active', color: 'bg-green-500' },
    { key: 'Paused', label: 'Paused', color: 'bg-yellow-500' },
    { key: 'Inactive', label: 'Inactive', color: 'bg-gray-500' },
    { key: 'Cancelled', label: 'Cancelled', color: 'bg-red-500' }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 min-h-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusColumns.map(({ key, label, color }) => {
          const columnSubscriptions = subscriptions.filter(sub => sub.status === key);
          
          return (
            <div key={key} className="bg-muted/30 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{label}</h3>
                <Badge variant="secondary" className={`${color} text-white`}>
                  {columnSubscriptions.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {columnSubscriptions.map(sub => (
                  <Card 
                    key={sub.id} 
                    className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onSubscriptionClick(sub)}
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">{sub.subscription_name}</h4>
                      <p className="text-xs text-muted-foreground">{sub.vendor?.full_name || 'N/A'}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold">{formatCurrency(calculateTotalAnnualCost(sub))}</span>
                        <Badge className={`${getStatusColor(sub.status)} text-white text-xs`}>
                          {sub.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
