export interface LeadScore {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  stage: string;
  dealAmount: number;
  dateCreated: string;
  totalScore: number;
  scoreBreakdown: {
    demographic: number;
    behavioral: number;
    engagement: number;
    intent: number;
    timing: number;
  };
  probability: number;
  priority: 'High' | 'Medium' | 'Low';
  lastActivity: string;
  nextAction: string;
  riskFactors: string[];
  opportunities: string[];
}

export interface ScoringRule {
  id: string;
  name: string;
  category: string;
  weight: number;
  enabled: boolean;
  conditions: Array<{
    field: string;
    operator: string;
    value: any;
    points: number;
  }>;
}

export const DEFAULT_SCORING_RULES: ScoringRule[] = [
  {
    id: '1',
    name: 'High Value Service',
    category: 'Demographic',
    weight: 20,
    enabled: true,
    conditions: [
      { field: 'services', operator: 'contains', value: 'USA LLC Formation', points: 25 },
      { field: 'services', operator: 'contains', value: 'Brand Development', points: 20 },
      { field: 'services', operator: 'contains', value: 'Dropshipping', points: 15 }
    ]
  },
  {
    id: '2',
    name: 'Geographic Location',
    category: 'Demographic',
    weight: 15,
    enabled: true,
    conditions: [
      { field: 'city', operator: 'equals', value: 'Delhi', points: 20 },
      { field: 'city', operator: 'equals', value: 'Mumbai', points: 18 },
      { field: 'city', operator: 'equals', value: 'Bangalore', points: 15 }
    ]
  },
  {
    id: '3',
    name: 'Lead Source Quality',
    category: 'Behavioral',
    weight: 25,
    enabled: true,
    conditions: [
      { field: 'source', operator: 'equals', value: 'Referral', points: 30 },
      { field: 'source', operator: 'equals', value: 'Website', points: 20 },
      { field: 'source', operator: 'equals', value: 'Social Media', points: 15 },
      { field: 'source', operator: 'equals', value: 'Cold Call', points: 10 }
    ]
  },
  {
    id: '4',
    name: 'Engagement Level',
    category: 'Engagement',
    weight: 20,
    enabled: true,
    conditions: [
      { field: 'followUpDay', operator: 'not_null', value: null, points: 15 },
      { field: 'assigned_to', operator: 'not_null', value: null, points: 10 }
    ]
  },
  {
    id: '5',
    name: 'Deal Amount',
    category: 'Intent',
    weight: 20,
    enabled: true,
    conditions: [
      { field: 'deal_amount', operator: 'greater_than', value: 100000, points: 25 },
      { field: 'deal_amount', operator: 'greater_than', value: 50000, points: 15 },
      { field: 'deal_amount', operator: 'greater_than', value: 25000, points: 10 }
    ]
  }
];
