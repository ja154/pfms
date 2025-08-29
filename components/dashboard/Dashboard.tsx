
import React from 'react';
import StatCard, { TotalPoultryIcon, FeedStockIcon, FeedDaysLeftIcon } from './StatCard';
import PoultryChart from './PoultryChart';
import UpcomingEvents from './UpcomingEvents';
import { useData } from '../../context/DataContext';

const Dashboard: React.FC = () => {
  const { state } = useData();
  const { poultry, feed } = state;

  const totalPoultry = poultry.reduce((sum, category) => sum + category.count, 0);
  const feedDaysLeft = feed.total > 0 && feed.dailyConsumption > 0 ? Math.floor(feed.total / feed.dailyConsumption) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-0 slide-in-from-top-8 duration-500">
        <StatCard title="Total Poultry" value={totalPoultry.toLocaleString()} description="All birds on farm" icon={<TotalPoultryIcon />} />
        <StatCard title="Feed Stock" value={`${feed.total.toLocaleString()} kg`} description="Total feed available" icon={<FeedStockIcon />} />
        <StatCard title="Feed Days Left" value={`${feedDaysLeft} days`} description="Estimated until empty" icon={<FeedDaysLeftIcon />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-0 slide-in-from-top-12 duration-500 delay-100">
        <div className="lg:col-span-2">
            <PoultryChart data={poultry} />
        </div>
        <div>
            <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;