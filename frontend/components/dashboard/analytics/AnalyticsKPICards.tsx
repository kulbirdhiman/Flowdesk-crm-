"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Activity, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnalyticsData } from "./types"

interface AnalyticsKPICardsProps {
  data: AnalyticsData | null
  formatCurrency: (amount: number) => string
  formatPercentage: (value: number) => string
}

export default function AnalyticsKPICards({
  data,
  formatCurrency,
  formatPercentage
}: AnalyticsKPICardsProps) {
  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'revenue': return <DollarSign className="h-4 w-4" />;
      case 'leads': return <Users className="h-4 w-4" />;
      case 'conversion': return <Target className="h-4 w-4" />;
      case 'customers': return <Activity className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getMetricValue = (metric: string) => {
    if (!data) return 0;
    switch (metric) {
      case 'revenue': return formatCurrency(data.revenue.current);
      case 'leads': return data.leads.current.toString();
      case 'conversion': return `${data.conversion.current.toFixed(1)}%`;
      case 'customers': return data.customers.current.toString();
      default: return '0';
    }
  };

  const getMetricGrowth = (metric: string) => {
    if (!data) return 0;
    switch (metric) {
      case 'revenue': return data.revenue.growth;
      case 'leads': return data.leads.growth;
      case 'conversion': return data.conversion.growth;
      case 'customers': return data.customers.growth;
      default: return 0;
    }
  };

  const metrics = [
    { key: 'revenue', label: 'Total Revenue', color: 'text-green-600' },
    { key: 'leads', label: 'Total Leads', color: 'text-blue-600' },
    { key: 'conversion', label: 'Conversion Rate', color: 'text-purple-600' },
    { key: 'customers', label: 'New Customers', color: 'text-orange-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const growth = getMetricGrowth(metric.key);
        const isPositive = growth >= 0;
        
        return (
          <Card key={metric.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                {metric.label}
              </CardTitle>
              <div className={cn("text-muted-foreground", metric.color)}>
                {getMetricIcon(metric.key)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Geist, sans-serif' }}>
                {getMetricValue(metric.key)}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={cn(isPositive ? "text-green-600" : "text-red-600")}>
                  {formatPercentage(growth)}
                </span>
                <span>vs previous period</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  )
}
