export interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  leads: {
    current: number;
    previous: number;
    growth: number;
  };
  conversion: {
    current: number;
    previous: number;
    growth: number;
  };
  customers: {
    current: number;
    previous: number;
    growth: number;
  };
}

export interface ChartData {
  date: string;
  revenue: number;
  leads: number;
  conversions: number;
}
