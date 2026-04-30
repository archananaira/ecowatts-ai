import React from 'react';
import { TrendAnalysis, HistoricalDataItem } from '../types';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendAnalysisProps {
  trendData: TrendAnalysis;
  historicalData: HistoricalDataItem[];
}

const TrendIcon: React.FC<{ trend: string }> = ({ trend }) => {
  if (trend.toLowerCase().includes('increasing')) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-red-500"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
  }
  if (trend.toLowerCase().includes('decreasing')) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-500"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>;
  }
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-slate-500"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
};


const TrendAnalysisComponent: React.FC<TrendAnalysisProps> = ({ trendData, historicalData }) => {
  const chartData = historicalData.map(item => ({
    name: item.period.split(' ')[0], // Use first word of period as label
    kWh: item.total_kwh,
    Cost: item.total_cost,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Trend Analysis</h3>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0">
          <TrendIcon trend={trendData.trend} />
        </div>
        <div>
          <p className="font-semibold text-slate-700 capitalize">{trendData.trend} Trend</p>
          <p className="text-sm text-slate-500">{trendData.change_percentage}% change</p>
        </div>
      </div>
      
      <div className="text-sm space-y-2 text-slate-600 mb-6">
        <p><span className="font-semibold">Seasonal Pattern:</span> {trendData.seasonal_pattern}</p>
        <p><span className="font-semibold">Anomalies:</span> {trendData.anomalies}</p>
      </div>
      
      {chartData.length > 1 && (
        <>
        <h4 className="text-md font-semibold text-slate-700 mb-2">Historical Usage & Cost</h4>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" stroke="#16a34a" />
                    <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                    <Tooltip formatter={(value, name) => {
  if (name === 'Cost') {
    return [`₹${Number(value).toLocaleString('en-IN')}`, 'Cost'];
  }
  return [value, name];
}} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="kWh" fill="#16a34a" name="Usage (kWh)" />
                    <Line yAxisId="right" type="monotone" dataKey="Cost" stroke="#8884d8" name="Cost (₹)"/>
                </ComposedChart>
            </ResponsiveContainer>
        </div>
        </>
      )}
    </div>
  );
};

export default TrendAnalysisComponent;