"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";
import AnalyticsHeader from "./analytics/AnalyticsHeader";
import AnalyticsKPICards from "./analytics/AnalyticsKPICards";
import OverviewTab from "./analytics/OverviewTab";
import LeadSourcesTab from "./analytics/LeadSourcesTab";
import TeamPerformanceTab from "./analytics/TeamPerformanceTab";
import GeographicTab from "./analytics/GeographicTab";
import TemporalTab from "./analytics/TemporalTab";
import LeadIntentTab from "./analytics/LeadIntentTab";
import { LeadAnalytics, LeadData } from "./analytics/types";
import { calculateAnalytics, exportReport } from "./analytics/utils";

export function AdvancedAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<LeadAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch leads data
      const { data: leads, error: leadsError } = await supabase
        .from('Leads')
        .select('*')
        .order('date_and_time', { ascending: false });

      if (leadsError) throw leadsError;

      // Calculate analytics using utility function
      const calculatedAnalytics = calculateAnalytics(leads || []);
      setAnalytics(calculatedAnalytics);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const handleExportReport = () => {
    if (analytics) {
      exportReport(analytics);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnalyticsHeader
        onExportReport={handleExportReport}
        onRefresh={fetchAnalytics}
      />

      {/* KPI Cards */}
      <AnalyticsKPICards
        totalLeads={analytics.totalLeads}
        convertedLeads={analytics.convertedLeads}
        conversionRate={analytics.conversionRate}
        avgResponseTime={analytics.avgResponseTime}
        totalRevenue={analytics.totalRevenue}
        revenueGrowth={analytics.revenueGrowth}
        leadQualityScore={analytics.leadQualityScore}
      />

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="temporal">Time Analysis</TabsTrigger>
          <TabsTrigger value="intent">Lead Intent</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <OverviewTab
            stageDistribution={analytics.stageDistribution}
            responseTimeTrend={analytics.responseTimeTrend}
          />
        </TabsContent>

        {/* Lead Sources Tab */}
        <TabsContent value="sources">
          <LeadSourcesTab
            topSources={analytics.topSources}
            leadSourcePerformance={analytics.leadSourcePerformance}
          />
        </TabsContent>

        {/* Team Performance Tab */}
        <TabsContent value="performance">
          <TeamPerformanceTab
            teamPerformance={analytics.teamPerformance}
          />
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic">
          <GeographicTab
            geographicDistribution={analytics.geographicDistribution}
          />
        </TabsContent>

        {/* Temporal Analysis Tab */}
        <TabsContent value="temporal">
          <TemporalTab
            timeBasedAnalysis={analytics.timeBasedAnalysis}
          />
        </TabsContent>

        {/* Lead Intent Tab */}
        <TabsContent value="intent">
          <LeadIntentTab
            leadIntentAnalysis={analytics.leadIntentAnalysis}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}