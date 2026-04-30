
import React from 'react';
import { Analysis } from '../types';

interface AnalysisOverviewProps {
  data: Analysis;
}

const InfoCard: React.FC<{ title: string; value: string | number; unit?: string, icon: JSX.Element }> = ({ title, value, unit, icon }) => (
  <div className="bg-slate-50 p-4 rounded-lg flex items-start">
    <div className="bg-green-100 text-green-600 p-2 rounded-full mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-xl font-bold text-slate-800">
        {value} <span className="text-base font-normal text-slate-600">{unit}</span>
      </p>
    </div>
  </div>
);

const BoltIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>);
const DollarSignIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>);
const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);
const SunIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>);

const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-slate-800 mb-1">Bill Overview</h3>
      <p className="text-sm text-slate-500 mb-4">{data.period}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Total Usage" value={data.total_kwh} unit="kWh" icon={<BoltIcon/>} />
        <InfoCard 
  title="Total Cost" 
  value={`₹${data.total_cost.toLocaleString('en-IN')}`} 
  icon={<BoltIcon/>}
/>
        <InfoCard title="Daily Average" value={data.daily_usage} unit="kWh/day" icon={<SunIcon/>}/>
        <InfoCard title="Billing Days" value={data.bill_days} unit="days" icon={<CalendarIcon/>}/>
      </div>
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-center text-green-800 font-medium">{data.comparison_to_average}</p>
      </div>
    </div>
  );
};

export default AnalysisOverview;
