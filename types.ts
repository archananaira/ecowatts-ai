
export interface Analysis {
  period: string;
  total_kwh: number;
  total_cost: number;
  cost_per_kwh: number;
  daily_usage: number;
  bill_days: number;
  comparison_to_average: string;
}

export interface TrendAnalysis {
  trend: string;
  change_percentage: number;
  seasonal_pattern: string;
  anomalies: string;
}

export interface Suggestion {
  category: string;
  suggestion: string;
  potential_savings: string;
  priority: 'high' | 'medium' | 'low';
  implementation_ease: string;
}

export interface BillAnalysis {
  analysis: Analysis;
  trend_analysis: TrendAnalysis;
  suggestions: Suggestion[];
  summary: string;
  historical_context: string;
}

export interface HistoricalDataItem {
  id: string;
  period: string;
  total_kwh: number;
  total_cost: number;
}
