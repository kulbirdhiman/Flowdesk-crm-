"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Brain, 
  MessageCircle, 
  Zap, 
  TrendingUp,
  Activity
} from "lucide-react";
import { AdvancedAnalyticsDashboard } from "@/components/leads/advanced-analytics-dashboard";
import { LeadScoringSystem } from "@/components/leads/lead-scoring-system";
import { WhatsAppIntegration } from "@/components/leads/whatsapp-integration";
import { SmartLeadManagement } from "@/components/leads/smart-lead-management";
import EnhancedLeadsHeader from "./components/EnhancedLeadsHeader";
import OverviewTab from "./components/OverviewTab";
import AutomationTab from "./components/AutomationTab";
import { DEFAULT_METRICS } from "./components/types";

export default function EnhancedLeadsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleExport = () => {
    console.log("Export functionality");
  };

  const handleSettings = () => {
    console.log("Settings functionality");
  };

  const handleAddLead = () => {
    console.log("Add lead functionality");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header */}
          <EnhancedLeadsHeader
            onExport={handleExport}
            onSettings={handleSettings}
            onAddLead={handleAddLead}
          />

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="scoring" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Lead Scoring
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="smart" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Smart Management
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Automation
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <OverviewTab {...DEFAULT_METRICS} />
            </TabsContent>

            {/* Lead Scoring Tab */}
            <TabsContent value="scoring" className="space-y-4">
              <LeadScoringSystem />
            </TabsContent>

            {/* WhatsApp Tab */}
            <TabsContent value="whatsapp" className="space-y-4">
              <WhatsAppIntegration />
            </TabsContent>

            {/* Smart Management Tab */}
            <TabsContent value="smart" className="space-y-4">
              <SmartLeadManagement />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <AdvancedAnalyticsDashboard />
            </TabsContent>

            {/* Automation Tab */}
            <TabsContent value="automation" className="space-y-4">
              <AutomationTab />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}