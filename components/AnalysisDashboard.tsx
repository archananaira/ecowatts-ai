import React, { useState, useEffect } from 'react';
import { BillAnalysis, HistoricalDataItem } from '../types';
import AnalysisOverview from './AnalysisOverview';
import TrendAnalysisComponent from './TrendAnalysis';
import Suggestions from './Suggestions';

interface AnalysisDashboardProps {
  analysis: BillAnalysis;
  historicalData: HistoricalDataItem[];
  onSave: () => void;
  isSaved: boolean;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis, historicalData, onSave, isSaved }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isSaved) {
        setShowSuccess(true);
        const timer = setTimeout(() => setShowSuccess(false), 2000);
        return () => clearTimeout(timer);
    }
  }, [isSaved]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">AI Summary</h3>
                <p className="text-slate-600 italic">"{analysis.summary}"</p>
                <p className="text-sm text-slate-500 mt-2">{analysis.historical_context}</p>
            </div>
            <div className="flex-shrink-0 ml-4">
                 <button
                    onClick={onSave}
                    disabled={isSaved}
                    className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isSaved ? 'Saved' : 'Save Analysis'}
                </button>
                {showSuccess && <p className="text-xs text-green-600 mt-1 text-center">Saved!</p>}
            </div>
        </div>
      </div>
      <AnalysisOverview data={analysis.analysis} />
      <TrendAnalysisComponent trendData={analysis.trend_analysis} historicalData={historicalData} />
      <Suggestions suggestions={analysis.suggestions} />
    </div>
  );
};

export default AnalysisDashboard;