import { supabase } from "@/lib/supabaseClient"
import { AnalyticsData, ChartData } from "./types"

export const fetchAnalyticsData = async (dateRange: { from: Date; to: Date }): Promise<{ data: AnalyticsData; chartData: ChartData[] }> => {
  try {
    // Fetch leads data with all necessary fields
    const { data: leadsData, error: leadsError } = await supabase
      .from('Leads')
      .select(`
        whalesync_postgres_id,
        name,
        stage,
        deal_amount,
        date_and_time,
        services,
        source,
        assigned_to,
        follow_up_day
      `)
      .order('date_and_time', { ascending: false });

    if (leadsError) throw leadsError;

    // Calculate analytics
    const currentPeriod = leadsData?.filter(lead => 
      new Date(lead.date_and_time) >= dateRange.from
    ) || [];
    
    const previousPeriod = leadsData?.filter(lead => {
      const leadDate = new Date(lead.date_and_time);
      const prevStart = new Date(dateRange.from);
      prevStart.setDate(prevStart.getDate() - (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
      return leadDate >= prevStart && leadDate < dateRange.from;
    }) || [];

    const currentRevenue = currentPeriod
      .filter(lead => lead.stage?.toLowerCase() === 'converted')
      .reduce((sum, lead) => sum + (parseFloat(lead.deal_amount) || 0), 0);
    
    const previousRevenue = previousPeriod
      .filter(lead => lead.stage?.toLowerCase() === 'converted')
      .reduce((sum, lead) => sum + (parseFloat(lead.deal_amount) || 0), 0);

    const currentLeads = currentPeriod.length;
    const previousLeads = previousPeriod.length;

    const currentConversions = currentPeriod.filter(lead => 
      lead.stage?.toLowerCase() === 'converted'
    ).length;
    const previousConversions = previousPeriod.filter(lead => 
      lead.stage?.toLowerCase() === 'converted'
    ).length;

    const currentConversionRate = currentLeads > 0 ? (currentConversions / currentLeads) * 100 : 0;
    const previousConversionRate = previousLeads > 0 ? (previousConversions / previousLeads) * 100 : 0;

    const currentCustomers = new Set(currentPeriod
      .filter(lead => lead.stage?.toLowerCase() === 'converted')
      .map(lead => lead.name)
    ).size;
    
    const previousCustomers = new Set(previousPeriod
      .filter(lead => lead.stage?.toLowerCase() === 'converted')
      .map(lead => lead.name)
    ).size;

    const data: AnalyticsData = {
      revenue: {
        current: currentRevenue,
        previous: previousRevenue,
        growth: previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0
      },
      leads: {
        current: currentLeads,
        previous: previousLeads,
        growth: previousLeads > 0 ? ((currentLeads - previousLeads) / previousLeads) * 100 : 0
      },
      conversion: {
        current: currentConversionRate,
        previous: previousConversionRate,
        growth: previousConversionRate > 0 ? ((currentConversionRate - previousConversionRate) / previousConversionRate) * 100 : 0
      },
      customers: {
        current: currentCustomers,
        previous: previousCustomers,
        growth: previousCustomers > 0 ? ((currentCustomers - previousCustomers) / previousCustomers) * 100 : 0
      }
    };

    // Generate chart data
    const dailyData: { [key: string]: { revenue: number; leads: number; conversions: number } } = {};
    
    currentPeriod.forEach(lead => {
      const date = new Date(lead.date_and_time).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { revenue: 0, leads: 0, conversions: 0 };
      }
      dailyData[date].leads++;
      if (lead.stage?.toLowerCase() === 'converted') {
        dailyData[date].revenue += parseFloat(lead.deal_amount) || 0;
        dailyData[date].conversions++;
      }
    });

    const chartData: ChartData[] = Object.entries(dailyData)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { data, chartData };

  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};
