import React, { useState, useCallback, useEffect } from 'react';
import { BillAnalysis, HistoricalDataItem } from './types';
import { analyzeBill } from './services/geminiService';
import Header from './components/Header';
import BillUploader from './components/BillUploader';
import AnalysisDashboard from './components/AnalysisDashboard';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import HistoricalData from './components/HistoricalData';

const SAVED_BILLS_KEY = 'ecoWattsAiHistory';

const App: React.FC = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<BillAnalysis | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnalysisSaved, setIsAnalysisSaved] = useState<boolean>(false);

  useEffect(() => {
    try {
        const savedData = localStorage.getItem(SAVED_BILLS_KEY);
        if (savedData) {
            setHistoricalData(JSON.parse(savedData));
        }
    } catch (e) {
        console.error("Failed to load historical data from localStorage", e);
    }
  }, []);

  const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve({ base64, mimeType: file.type });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setCurrentAnalysis(null);
    setIsAnalysisSaved(false);

    try {
      // Use a snapshot of historical data for this analysis
      const historicalDataForAnalysis = [...historicalData];
      const image = await fileToBase64(file);
      const result = await analyzeBill(image, historicalDataForAnalysis);
      
      setCurrentAnalysis(result);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [historicalData]);

  const handleSaveAnalysis = () => {
    if (!currentAnalysis || isAnalysisSaved) return;

    const newHistoryItem: HistoricalDataItem = {
        id: new Date().toISOString(),
        period: currentAnalysis.analysis.period,
        total_kwh: currentAnalysis.analysis.total_kwh,
        total_cost: currentAnalysis.analysis.total_cost,
    };

    const updatedHistory = [...historicalData, newHistoryItem];
    setHistoricalData(updatedHistory);
    localStorage.setItem(SAVED_BILLS_KEY, JSON.stringify(updatedHistory));
    setIsAnalysisSaved(true);
  };

  const handleClearHistory = () => {
    setHistoricalData([]);
    localStorage.removeItem(SAVED_BILLS_KEY);
  };

  const WelcomeMessage: React.FC = () => (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to EcoWatts AI</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
            Get personalized insights into your energy consumption. Just upload a photo of your electricity bill, and our AI will analyze your usage, track trends, and provide actionable tips to help you save money and energy.
        </p>
    </div>
);


  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <BillUploader onAnalyze={handleAnalyze} isLoading={isLoading} />
            <HistoricalData data={historicalData} onClear={handleClearHistory} />
          </div>
          <div className="lg:col-span-2">
            {isLoading && <Loader />}
            {error && <ErrorMessage message={error} />}
            {currentAnalysis && !isLoading && (
              <AnalysisDashboard 
                analysis={currentAnalysis} 
                historicalData={[...historicalData, { // Include current analysis in chart preview
                    id: 'current',
                    period: currentAnalysis.analysis.period,
                    total_cost: currentAnalysis.analysis.total_cost,
                    total_kwh: currentAnalysis.analysis.total_kwh,
                }]}
                onSave={handleSaveAnalysis}
                isSaved={isAnalysisSaved}
              />
            )}
            {!currentAnalysis && !isLoading && !error && <WelcomeMessage/>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;