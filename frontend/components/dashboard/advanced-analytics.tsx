"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, DollarSign, Users, Activity } from "lucide-react";
import AnalyticsHeader from "./analytics/AnalyticsHeader";
import AnalyticsKPICards from "./analytics/AnalyticsKPICards";
import OverviewTab from "./analytics/OverviewTab";
import RevenueTab from "./analytics/RevenueTab";
import LeadsTab from "./analytics/LeadsTab";
import PerformanceTab from "./analytics/PerformanceTab";
import LoadingSkeleton from "./analytics/LoadingSkeleton";
import { AnalyticsData, ChartData } from "./analytics/types";
import { fetchAnalyticsData, formatCurrency, formatPercentage } from "./analytics/utils";

export function AdvancedAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const { data: analyticsData, chartData: chartDataArray } = await fetchAnalyticsData(dateRange);
      setData(analyticsData);
      setChartData(chartDataArray);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <AnalyticsHeader
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onRefresh={handleRefresh}
      />

      {/* KPI Cards */}
      <AnalyticsKPICards
        data={data}
        formatCurrency={formatCurrency}
        formatPercentage={formatPercentage}
      />

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <OverviewTab
            chartData={chartData}
            formatCurrency={formatCurrency}
          />
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <RevenueTab
            data={data}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
          />
        </TabsContent>

        {/* Leads Tab */}
        <TabsContent value="leads">
          <LeadsTab data={data} />
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <PerformanceTab
            data={data}
            formatPercentage={formatPercentage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}