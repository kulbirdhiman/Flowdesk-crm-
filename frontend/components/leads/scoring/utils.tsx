import { supabase } from "@/lib/supabaseClient"
import { LeadScore, ScoringRule } from "./types"

export const calculateLeadScore = (lead: any, scoringRules: ScoringRule[]): LeadScore => {
  let totalScore = 0;
  const scoreBreakdown = {
    demographic: 0,
    behavioral: 0,
    engagement: 0,
    intent: 0,
    timing: 0
  };

  // Apply scoring rules
  scoringRules.forEach(rule => {
    if (!rule.enabled) return;

    rule.conditions.forEach(condition => {
      let conditionMet = false;
      const fieldValue = lead[condition.field];

      switch (condition.operator) {
        case 'equals':
          conditionMet = fieldValue === condition.value;
          break;
        case 'contains':
          conditionMet = fieldValue && fieldValue.toString().toLowerCase().includes(condition.value.toLowerCase());
          break;
        case 'greater_than':
          conditionMet = parseFloat(fieldValue) > condition.value;
          break;
        case 'not_null':
          conditionMet = fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
          break;
      }

      if (conditionMet) {
        const points = condition.points * (rule.weight / 100);
        totalScore += points;

        // Categorize points
        switch (rule.category) {
          case 'Demographic':
            scoreBreakdown.demographic += points;
            break;
          case 'Behavioral':
            scoreBreakdown.behavioral += points;
            break;
          case 'Engagement':
            scoreBreakdown.engagement += points;
            break;
          case 'Intent':
            scoreBreakdown.intent += points;
            break;
          case 'Timing':
            scoreBreakdown.timing += points;
            break;
        }
      }
    });
  });

  // Calculate probability based on score
  const probability = Math.min(95, Math.max(5, (totalScore / 100) * 100));
  
  // Determine priority
  let priority: 'High' | 'Medium' | 'Low' = 'Low';
  if (totalScore >= 70) priority = 'High';
  else if (totalScore >= 40) priority = 'Medium';

  // Generate risk factors and opportunities
  const riskFactors: string[] = [];
  const opportunities: string[] = [];

  if (totalScore < 30) {
    riskFactors.push('Low engagement score');
    riskFactors.push('Limited demographic data');
  }
  if (lead.stage === 'Not Connected') {
    riskFactors.push('No initial contact made');
  }
  if (!lead.assigned_to) {
    riskFactors.push('No assigned sales rep');
  }

  if (totalScore >= 70) {
    opportunities.push('High conversion probability');
    opportunities.push('Premium service interest');
  }
  if (lead.source === 'Referral') {
    opportunities.push('Warm lead from referral');
  }
  if (parseFloat(lead.deal_amount) > 100000) {
    opportunities.push('High-value opportunity');
  }

  return {
    id: lead.whalesync_postgres_id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    stage: lead.stage,
    dealAmount: parseFloat(lead.deal_amount) || 0,
    dateCreated: lead.date_and_time,
    totalScore: Math.round(totalScore),
    scoreBreakdown,
    probability: Math.round(probability),
    priority,
    lastActivity: lead.date_and_time,
    nextAction: totalScore >= 70 ? 'Immediate follow-up' : 
                totalScore >= 40 ? 'Schedule call' : 'Nurture sequence',
    riskFactors,
    opportunities
  };
};

export const fetchLeads = async (scoringRules: ScoringRule[]): Promise<LeadScore[]> => {
  try {
    const { data: leadsData, error } = await supabase
      .from('Leads')
      .select('*')
      .order('date_and_time', { ascending: false })
      .limit(50);

    if (error) throw error;

    const scoredLeads = leadsData?.map(lead => calculateLeadScore(lead, scoringRules)) || [];
    return scoredLeads.sort((a, b) => b.totalScore - a.totalScore);
    
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-800 border-red-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getScoreColor = (score: number): string => {
  if (score >= 70) return 'text-green-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};
