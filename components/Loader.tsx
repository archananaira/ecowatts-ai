
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      <p className="mt-4 text-lg text-slate-600 font-semibold">Analyzing your bill...</p>
      <p className="mt-2 text-sm text-slate-500">This may take a moment. The AI is hard at work!</p>
    </div>
  );
};

export default Loader;
