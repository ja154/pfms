
import React, { ReactNode } from 'react';
import Card from '../ui/Card';

export const TotalPoultryIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a4 4 0 0 0 4-4V8a4 4 0 0 0-8 0v8a4 4 0 0 0 4 4Z"></path><path d="m18 8-2.5 2.5"></path><path d="m6 8 2.5 2.5"></path><path d="M14 12h-4"></path><path d="M16 4.5 14 2"></path><path d="m8 4.5 2-2.5"></path><path d="m18 16 2.5 2.5"></path><path d="m6 16-2.5 2.5"></path></svg>
);
export const FeedStockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.29 14.29c-1.8 1.8-4.2 2.71-6.51 2.71-5.08 0-9.22-4.14-9.22-9.22 0-2.31.91-4.71 2.71-6.51Z"></path><path d="M14.29 14.29 22 22"></path><path d="M11.36 11.36c-1.8-1.8-2.71-4.2-2.71-6.51 0-2.31.91-4.71 2.71-6.51 1.8-1.8 4.2-2.71 6.51-2.71s4.71.91 6.51 2.71C23.09 4.14 24 6.54 24 8.85c0 2.31-.91 4.71-2.71 6.51l-8.64-8.64Z"></path></svg>
);
export const FeedDaysLeftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  color: 'green' | 'blue' | 'amber';
}

const colorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-800' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-800' },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, color }) => {
  const classes = colorClasses[color];
  return (
    <Card className="p-0">
      <div className="flex items-center">
        <div className={`p-5 rounded-l-lg ${classes.bg}`}>
            <div className={`p-2 bg-white rounded-md shadow-sm ${classes.text}`}>
                {icon}
            </div>
        </div>
        <div className="p-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
            <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;