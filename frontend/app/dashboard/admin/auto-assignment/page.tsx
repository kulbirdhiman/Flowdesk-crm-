"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AutoAssignmentStatsCards from "./components/AutoAssignmentStatsCards";
import ServiceConfigurationCard from "./components/ServiceConfigurationCard";
import AssignmentEngineCard from "./components/AssignmentEngineCard";
import QuickStatsCard from "./components/QuickStatsCard";
import { EmployeeFields, LeadFields, SavedConfig } from "./components/types";
import { getServiceIcon, getTotalAssignedEmployees, getServiceStats } from "./components/utils";

const AutoAssignmentPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [employees, setEmployees] = useState<EmployeeFields[]>([]);
  const [config, setConfig] = useState<SavedConfig>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>("Save Today's Configuration");
  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  const [assignmentLog, setAssignmentLog] = useState<React.ReactNode>('');
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [assignmentProgress, setAssignmentProgress] = useState<number>(0);

  const todayKey = 'service_mapping_' + new Date().toISOString().slice(0, 10);

  // Helper functions for UI management
  const toggleServiceExpansion = (serviceName: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceName)) {
      newExpanded.delete(serviceName);
    } else {
      newExpanded.add(serviceName);
    }
    setExpandedServices(newExpanded);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch leads to get unique services
        const { data: leadsData, error: leadsError } = await supabase
          .from('Leads')
          .select('services')
          .not('services', 'is', null);

        if (leadsError) throw leadsError;

        // Extract unique services
        const serviceSet = new Set<string>();
        leadsData?.forEach(lead => {
          if (lead.services) {
            serviceSet.add(lead.services);
          }
        });

        // Fetch employees from Sales Team - only sales people
        const { data: employeeData, error: employeeError } = await supabase
          .from('Employee Directory')
          .select('whalesync_postgres_id, full_name, job_title, profile_photo')
          .eq('status', 'Active')
          .ilike('job_title', '%Sales%')
          .order('full_name');

        if (employeeError) throw employeeError;

        setServices(Array.from(serviceSet).sort());
        setEmployees(employeeData || []);

        // Load saved configuration from localStorage
        const savedConfigJSON = localStorage.getItem(todayKey);
        setConfig(savedConfigJSON ? JSON.parse(savedConfigJSON) : {});
      } catch (err: any) {
        setError(`Failed to load component: ${err.message}. Please check your database connection.`);
        toast.error(`Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [todayKey]);

  const handleCheckboxChange = useCallback((serviceName: string, employeeId: string) => {
    setConfig(prevConfig => {
      const currentSelection = prevConfig[serviceName] || [];
      const newSelection = currentSelection.includes(employeeId)
        ? currentSelection.filter(id => id !== employeeId)
        : [...currentSelection, employeeId];
      return { ...prevConfig, [serviceName]: newSelection };
    });
  }, []);

  const handleSaveConfig = useCallback(() => {
    setIsSaving(true);
    setSaveMessage('Saving...');
    try {
      localStorage.setItem(todayKey, JSON.stringify(config));
      setSaveMessage('Saved!');
      toast.success('Configuration saved successfully!');
      setTimeout(() => {
        setSaveMessage("Save Today's Configuration");
        setIsSaving(false);
      }, 2000);
    } catch (error: any) {
      setAssignmentLog(<p className="text-red-600">Error saving configuration: {error.message}</p>);
      toast.error(`Error: ${error.message}`);
      setSaveMessage("Save Today's Configuration");
      setIsSaving(false);
    }
  }, [config, todayKey]);

  const handleClearConfig = useCallback(() => {
    localStorage.removeItem(todayKey);
    setConfig({});
    toast.info('Configuration cleared');
  }, [todayKey]);

  const handleRunAssignment = useCallback(async () => {
    setIsAssigning(true);
    setAssignmentLog(
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <p>Processing...</p>
      </div>
    );

    try {
      console.log('🚀 Starting auto-assignment process...');
      console.log('📅 Today key:', todayKey);
      
      // Test Supabase client
      console.log('🔍 Testing Supabase client...');
      console.log('Supabase client:', supabase);
      console.log('Supabase URL:', supabase.supabaseUrl);
      console.log('Supabase Key (first 20 chars):', supabase.supabaseKey?.substring(0, 20) + '...');
      
      const savedConfigJSON = localStorage.getItem(todayKey);
      console.log('💾 Saved config from localStorage:', savedConfigJSON);
      
      if (!savedConfigJSON) {
        throw new Error("Today's assignment configuration has not been saved yet.");
      }
      const assignmentRules: SavedConfig = JSON.parse(savedConfigJSON);
      console.log('📋 Assignment rules loaded:', assignmentRules);
      
      // Validate configuration
      const hasValidRules = Object.keys(assignmentRules).some(service => 
        assignmentRules[service] && assignmentRules[service].length > 0
      );
      
      if (!hasValidRules) {
        throw new Error("No valid assignment rules found. Please configure at least one service with employees.");
      }
      
      console.log('✅ Configuration validation passed');

      // Test database connection first
      console.log('🔍 Testing database connection...');
      const { data: testData, error: testError } = await supabase
        .from('Leads')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Database connection test failed:', testError);
        console.error('❌ Test error details:', {
          message: testError.message,
          code: testError.code,
          hint: testError.hint,
          details: testError.details
        });
        
        // Try to get table info
        console.log('🔍 Checking if Leads table exists...');
        const { data: tableInfo, error: tableError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_name', 'Leads');
        
        if (tableError) {
          console.error('❌ Cannot check table existence:', tableError);
        } else {
          console.log('📋 Table info:', tableInfo);
        }
        
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      console.log('✅ Database connection successful');

      // Fetch unassigned leads
      console.log('🔍 Fetching unassigned leads from database...');
      
      // Try alternative query approach
      let allLeads, leadsError;
      
      try {
        // First try: Get all leads and filter in JavaScript
        const { data, error } = await supabase
          .from('Leads')
          .select('whalesync_postgres_id, services, assigned_to');
        
        allLeads = data;
        leadsError = error;
        
        if (leadsError) {
          console.log('⚠️ First query failed, trying alternative...');
          // Second try: Simple query without OR condition
          const { data: data2, error: error2 } = await supabase
        .from('Leads')
            .select('whalesync_postgres_id, services, assigned_to');
          
          allLeads = data2;
          leadsError = error2;
        }
      } catch (err) {
        console.error('❌ Query execution failed:', err);
        throw new Error(`Query failed: ${err.message}`);
      }

      if (leadsError) {
        console.error('❌ Error fetching leads:', leadsError);
        console.error('❌ Error details:', {
          message: leadsError.message,
          code: leadsError.code,
          hint: leadsError.hint,
          details: leadsError.details
        });
        throw new Error(`Database error: ${leadsError.message || 'Failed to fetch leads'}`);
      }

      console.log('📊 All leads fetched:', allLeads?.length || 0);
      console.log('📋 Sample leads:', allLeads?.slice(0, 3));

      const unassignedLeads = allLeads?.filter(lead =>
        !lead.assigned_to || lead.assigned_to === ''
      ) || [];
      
      console.log('🎯 Unassigned leads found:', unassignedLeads.length);
      console.log('📋 Sample unassigned leads:', unassignedLeads.slice(0, 3));

      if (unassignedLeads.length === 0) {
        setAssignmentLog('No unassigned leads to process.');
        toast.info('No unassigned leads found');
        setIsAssigning(false);
        return;
      }

      // Initialize round-robin counters
      const roundRobinCounters: { [key: string]: number } = {};
      Object.keys(assignmentRules).forEach(serviceName => {
        roundRobinCounters[serviceName] = 0;
      });
      console.log('🔄 Round-robin counters initialized:', roundRobinCounters);

      // Prepare updates
      const updates: { id: string; assigned_to: string }[] = [];
      let assignedCount = 0;

      console.log('🔄 Processing leads for assignment...');
      unassignedLeads.forEach((lead, index) => {
        const leadService = lead.services;
        console.log(`Lead ${index + 1}: Service="${leadService}", ID=${lead.whalesync_postgres_id}`);
        
        if (!leadService) {
          console.log(`⚠️ Lead ${index + 1}: No service specified, skipping`);
          return;
        }

        const serviceName = leadService;
        const employeesForService = assignmentRules[serviceName];
        console.log(`🔍 Service "${serviceName}" has employees:`, employeesForService);

        if (employeesForService && employeesForService.length > 0) {
          const counter = roundRobinCounters[serviceName] || 0;
          const employeeToAssignId = employeesForService[counter];
          console.log(`✅ Assigning lead to employee ${employeeToAssignId} (counter: ${counter})`);
          
          updates.push({
            id: lead.whalesync_postgres_id,
            assigned_to: employeeToAssignId
          });
          assignedCount++;
          roundRobinCounters[serviceName] = (counter + 1) % employeesForService.length;
        } else {
          console.log(`⚠️ No employees assigned for service "${serviceName}"`);
        }
      });

      console.log('📊 Assignment summary:');
      console.log('- Total updates prepared:', updates.length);
      console.log('- Assigned count:', assignedCount);
      console.log('- Updates:', updates);

      // Execute updates in batches
      if (updates.length > 0) {
        console.log('💾 Executing database updates...');
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < updates.length; i += 10) {
          const batch = updates.slice(i, i + 10);
          console.log(`📦 Processing batch ${Math.floor(i/10) + 1} (${batch.length} updates)`);
          
          for (const update of batch) {
            console.log(`🔄 Updating lead ${update.id} → employee ${update.assigned_to}`);
            const { error: updateError } = await supabase
              .from('Leads')
              .update({ assigned_to: update.assigned_to })
              .eq('whalesync_postgres_id', update.id);

            if (updateError) {
              console.error('❌ Error updating lead:', update.id, updateError);
              errorCount++;
            } else {
              console.log('✅ Successfully updated lead:', update.id);
              successCount++;
            }
          }
        }
        
        console.log('📊 Update results:');
        console.log('- Successful updates:', successCount);
        console.log('- Failed updates:', errorCount);
      } else {
        console.log('⚠️ No updates to execute');
      }

      setAssignmentLog(`Success! ${assignedCount} leads have been assigned.`);
      toast.success(`${assignedCount} leads assigned successfully!`);
    } catch (err: any) {
      setAssignmentLog(<p className="text-red-600">Error: {err.message}</p>);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsAssigning(false);
    }
  }, [todayKey]);

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col h-screen">
            <SiteHeader />
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading configuration...</p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col h-screen">
            <SiteHeader />
            <div className="flex items-center justify-center flex-1">
              <Card className="w-full max-w-md bg-destructive/10 border-destructive">
                <CardContent className="p-6">
                  <p className="font-bold text-destructive">Failed to load component:</p>
                  <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const stats = getServiceStats(services, config);
  const totalAssigned = getTotalAssignedEmployees(config);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen bg-gradient-to-br from-background to-muted/20">
          <SiteHeader 
            title="Auto-Assignment Configuration" 
            showQuickNotes={true} 
            notesStorageKey="auto_assignment"
            useDatabase={true}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="w-full px-4 py-2">
              {/* Stats Cards */}
              <AutoAssignmentStatsCards
                totalServices={stats.totalServices}
                configuredServices={stats.configuredServices}
                totalAssigned={totalAssigned}
                availableStaff={employees.length}
              />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                {/* Service Configuration */}
                <div className="xl:col-span-2">
                  <ServiceConfigurationCard
                    services={services}
                    employees={employees}
                    config={config}
                    expandedServices={expandedServices}
                    isSaving={isSaving}
                    saveMessage={saveMessage}
                    onToggleServiceExpansion={toggleServiceExpansion}
                    onCheckboxChange={handleCheckboxChange}
                    onSaveConfig={handleSaveConfig}
                    onClearConfig={handleClearConfig}
                    getServiceIcon={getServiceIcon}
                  />
                </div>

                {/* Assignment Engine */}
                <div className="space-y-4">
                  <AssignmentEngineCard
                    isAssigning={isAssigning}
                    assignmentProgress={assignmentProgress}
                    assignmentLog={assignmentLog}
                    onRunAssignment={handleRunAssignment}
                  />

                  {/* Quick Stats */}
                  <QuickStatsCard
                    totalServices={stats.totalServices}
                    configuredServices={stats.configuredServices}
                    totalAssigned={totalAssigned}
                    availableStaff={employees.length}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Designed & Developed by <span className="font-semibold text-primary">Startup Squad Pvt. Ltd.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AutoAssignmentPage;