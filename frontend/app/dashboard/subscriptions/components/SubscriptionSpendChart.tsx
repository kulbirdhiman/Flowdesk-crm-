"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubscriptionSpendChartProps {
  spendByCategory: { [key: string]: number };
  totalAnnualCost: number;
  formatCurrency: (amount: number) => string;
  getCategoryColor: (index: number) => string;
}

export default function SubscriptionSpendChart({
  spendByCategory,
  totalAnnualCost,
  formatCurrency,
  getCategoryColor
}: SubscriptionSpendChartProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Annual Spend by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(spendByCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([category, spend], index) => {
              const percentage = (spend / totalAnnualCost) * 100;
              return (
                <div key={category} className="flex items-center">
                  <span className="w-28 text-sm text-muted-foreground">{category}</span>
                  <div className="flex-1 bg-muted rounded-full h-4 mr-4">
                    <div 
                      className={`${getCategoryColor(index)} h-4 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="font-semibold">{formatCurrency(spend)}</span>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
