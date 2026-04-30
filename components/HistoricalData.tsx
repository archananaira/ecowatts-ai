import React from 'react';
import { HistoricalDataItem } from '../types';

interface HistoricalDataProps {
  data: HistoricalDataItem[];
  onClear: () => void;
}

const HistoricalData: React.FC<HistoricalDataProps> = ({ data, onClear }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-700">Analysis History</h2>
        {data.length > 0 && (
            <button
                onClick={onClear}
                className="text-xs text-red-500 hover:text-red-700 font-semibold"
            >
                Clear History
            </button>
        )}
      </div>
      {data.length === 0 ? (
        <p className="text-slate-500 text-sm">No past bills analyzed. Upload one to start tracking!</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {data.slice().reverse().map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
              <p className="text-sm font-medium text-slate-700">{item.period}</p>
              <div className="text-right">
                <p className="text-sm text-slate-600">{item.total_kwh} kWh</p>
               <p className="text-xs text-slate-400">
  ₹{item.total_cost.toLocaleString('en-IN')}
</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoricalData;