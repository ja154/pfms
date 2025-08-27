
import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import IdeaSidebar from './components/layout/IdeaSidebar';
import Dashboard from './components/dashboard/Dashboard';
import PoultryManagement from './components/poultry/PoultryManagement';
import FeedManagement from './components/feed/FeedManagement';
import RecordsView from './components/records/RecordsView';
import { DataProvider } from './context/DataContext';
import Settings from './components/settings/Settings';
import CalendarView from './components/calendar/CalendarView';
import TabBookView from './components/tabbook/TabBookView';

export type ViewType = 'dashboard' | 'poultry' | 'feed' | 'records' | 'calendar' | 'settings' | 'tabbook';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'poultry':
        return <PoultryManagement />;
      case 'feed':
        return <FeedManagement />;
      case 'records':
        return <RecordsView />;
      case 'calendar':
        return <CalendarView />;
      case 'settings':
        return <Settings />;
      case 'tabbook':
        return <TabBookView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="flex h-screen bg-gray-100 text-gray-800">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 md:p-8">
            {renderView()}
          </main>
        </div>
        <IdeaSidebar />
      </div>
    </DataProvider>
  );
};

export default App;