import React, { useState } from 'react';
import { Suggestion } from '../types';

interface SuggestionsProps {
  suggestions: Suggestion[];
}

const PriorityBadge: React.FC<{ priority: 'high' | 'medium' | 'low' }> = ({ priority }) => {
  const colorClasses = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[priority]}`}>
      {priority} priority
    </span>
  );
};

const LightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-yellow-500"><line x1="12" x2="12" y1="2" y2="5"></line><path d="M8.86 8.86A6 6 0 0 1 12 4v0a6 6 0 0 1 3.14 8.86"></path><path d="M12 18a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4Z"></path><path d="M12 22v-2"></path></svg>;

const ChevronDownIcon = ({ className }: { className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 transition-transform ${className}`}><polyline points="6 9 12 15 18 9"></polyline></svg>;


const Suggestions: React.FC<SuggestionsProps> = ({ suggestions }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleSuggestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Savings Suggestions</h3>
      <div className="space-y-2">
        {suggestions.map((item, index) => (
          <div key={index} className="border border-slate-200 rounded-lg">
            <button
                onClick={() => toggleSuggestion(index)}
                className="w-full flex justify-between items-center p-4 text-left"
                aria-expanded={openIndex === index}
            >
                <p className="font-semibold text-slate-700">{item.category}</p>
                <div className="flex items-center space-x-4">
                    <PriorityBadge priority={item.priority} />
                    <ChevronDownIcon className={openIndex === index ? 'rotate-180' : ''} />
                </div>
            </button>
            {openIndex === index && (
                <div className="px-4 pb-4">
                    <p className="text-slate-600 mb-3">{item.suggestion}</p>
                    <div className="flex items-center bg-green-50 p-3 rounded-md text-sm">
                        <LightbulbIcon/>
                        <p className="ml-2 text-green-800 font-medium">{item.potential_savings}</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right">Implementation: {item.implementation_ease}</p>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;