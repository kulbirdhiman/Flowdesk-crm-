"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";
import SmartLeadHeader from "./smart-lead/SmartLeadHeader";
import DuplicatesTab from "./smart-lead/DuplicatesTab";
import EnrichmentTab from "./smart-lead/EnrichmentTab";
import DataQualityTab from "./smart-lead/DataQualityTab";
import InsightsTab from "./smart-lead/InsightsTab";
import { Lead, DuplicateGroup, EnrichmentResult, LeadData } from "./smart-lead/types";
import { 
  detectDuplicates, 
  enrichLeads, 
  mergeLeads, 
  getConfidenceColor, 
  formatLeadData 
} from "./smart-lead/utils";

export function SmartLeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [enrichmentResults, setEnrichmentResults] = useState<EnrichmentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [showEnrichment, setShowEnrichment] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      const { data: leadsData, error } = await supabase
        .from('Leads')
        .select('*')
        .order('date_and_time', { ascending: false })
        .limit(100);

      if (error) throw error;

      const formattedLeads = formatLeadData(leadsData || []);
      setLeads(formattedLeads);
      
      // Detect duplicates
      const duplicateGroups = detectDuplicates(formattedLeads);
      setDuplicates(duplicateGroups);
      
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrichLeads = async (leadIds: string[]) => {
    try {
      setLoading(true);
      
      const results = await enrichLeads(leadIds);
      setEnrichmentResults(results);
      
      // Update leads with enriched data
      setLeads(prev => prev.map(lead => {
        const result = results.find(r => r.leadId === lead.id);
        if (result) {
          return {
            ...lead,
            enrichedData: result.newData
          };
        }
        return lead;
      }));
      
    } catch (error) {
      console.error('Error enriching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMergeLeads = async (duplicateGroup: DuplicateGroup) => {
    try {
      const updatedLead = await mergeLeads(duplicateGroup);
      
      // Remove from duplicates list
      setDuplicates(prev => prev.filter(d => d.id !== duplicateGroup.id));
      
      // Update leads list
      setLeads(prev => prev.filter(lead => 
        !duplicateGroup.leads.some(dLead => dLead.id === lead.id)
      ).concat(updatedLead));
      
    } catch (error) {
      console.error('Error merging leads:', error);
    }
  };

  const handleToggleSelection = (leadId: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const handleEnrichSelected = () => {
    handleEnrichLeads(Array.from(selectedLeads));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <SmartLeadHeader
        onEnrichData={() => setShowEnrichment(true)}
        onRefresh={fetchLeads}
      />

      <Tabs defaultValue="duplicates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
          <TabsTrigger value="enrichment">Enrichment</TabsTrigger>
          <TabsTrigger value="quality">Data Quality</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Duplicates Tab */}
        <TabsContent value="duplicates">
          <DuplicatesTab
            duplicates={duplicates}
            onMergeLeads={handleMergeLeads}
            getConfidenceColor={getConfidenceColor}
          />
        </TabsContent>

        {/* Enrichment Tab */}
        <TabsContent value="enrichment">
          <EnrichmentTab
            leads={leads}
            selectedLeads={selectedLeads}
            onToggleSelection={handleToggleSelection}
            onEnrichSelected={handleEnrichSelected}
            loading={loading}
          />
        </TabsContent>

        {/* Data Quality Tab */}
        <TabsContent value="quality">
          <DataQualityTab />
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights">
          <InsightsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}