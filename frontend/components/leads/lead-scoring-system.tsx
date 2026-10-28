"use client";

import React, { useState, useEffect } from "react";
import LeadScoringHeader from "./scoring/LeadScoringHeader";
import ScoringRulesPanel from "./scoring/ScoringRulesPanel";
import LeadScoreCard from "./scoring/LeadScoreCard";
import LeadDetailModal from "./scoring/LeadDetailModal";
import LoadingSkeleton from "./scoring/LoadingSkeleton";
import { LeadScore, ScoringRule, DEFAULT_SCORING_RULES } from "./scoring/types";
import { fetchLeads, getPriorityColor, getScoreColor } from "./scoring/utils";

export function LeadScoringSystem() {
  const [leads, setLeads] = useState<LeadScore[]>([]);
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>(DEFAULT_SCORING_RULES);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadScore | null>(null);
  const [showRules, setShowRules] = useState(false);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const scoredLeads = await fetchLeads(scoringRules);
      setLeads(scoredLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRules = () => {
    setShowRules(!showRules);
  };

  const handleRefresh = () => {
    loadLeads();
  };

  const handleToggleRule = (ruleId: string) => {
    setScoringRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const handleSelectLead = (lead: LeadScore) => {
    setSelectedLead(lead);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
  };

  useEffect(() => {
    loadLeads();
  }, [scoringRules]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <LeadScoringHeader
        onToggleRules={handleToggleRules}
        onRefresh={handleRefresh}
        showRules={showRules}
      />

      {/* Scoring Rules Panel */}
      {showRules && (
        <ScoringRulesPanel
          scoringRules={scoringRules}
          onToggleRule={handleToggleRule}
        />
      )}

      {/* Lead Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map((lead) => (
          <LeadScoreCard
            key={lead.id}
            lead={lead}
            isSelected={selectedLead?.id === lead.id}
            onClick={() => handleSelectLead(lead)}
            getPriorityColor={getPriorityColor}
            getScoreColor={getScoreColor}
          />
        ))}
      </div>

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        onClose={handleCloseModal}
      />
    </div>
  );
}