
import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import IdeaSidebar from './components/layout/IdeaSidebar';
import Dashboard from './components/dashboard/Dashboard';
import PoultryManagement from './components/poultry/PoultryManagement';
import FeedManagement from './components/feed/FeedManagement';
import RecordsView from './components/records/RecordsView';
import { DataProvider, useData } from './context/DataContext';
import Settings from './components/settings/Settings';
import CalendarView from './components/calendar/CalendarView';
import TabBookView from './components/tabbook/TabBookView';

export type ViewType = 'dashboard' | 'poultry' | 'feed' | 'records' | 'calendar' | 'settings' | 'tabbook';

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green-600 h-6 w-6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const { state } = useData();
  const [notification, setNotification] = useState<{ id: string; title: string; description: string } | null>(null);
  const [notifiedTaskIds, setNotifiedTaskIds] = useState<string[]>([]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      for (const task of state.tasks) {
        if (task.completed || !task.reminder || task.reminder === 'none' || notifiedTaskIds.includes(task.id)) {
          continue;
        }

        const taskDueDate = new Date(task.date);
        let reminderTime: Date | null = null;
        
        switch (task.reminder) {
          case '30m':
            reminderTime = new Date(taskDueDate.getTime() - 30 * 60 * 1000);
            break;
          case '1h':
            reminderTime = new Date(taskDueDate.getTime() - 60 * 60 * 1000);
            break;
          case '1d':
            reminderTime = new Date(taskDueDate.getTime() - 24 * 60 * 60 * 1000);
            break;
        }

        if (reminderTime && now >= reminderTime && now < taskDueDate) {
          if (!notification) {
            setNotification({ id: task.id, title: task.title, description: `Task is due on ${taskDueDate.toLocaleDateString()}` });
            setNotifiedTaskIds(prev => [...prev, task.id]);
          }
          break; 
        }
      }
    };

    const interval = setInterval(checkReminders, 30 * 1000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [state.tasks, notifiedTaskIds, notification]);
  
  const closeNotification = () => {
    setNotification(null);
  };

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
    <>
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
      {notification && (
        <div role="alert" aria-live="assertive" className="fixed top-5 right-5 bg-white rounded-xl shadow-2xl p-4 w-full max-w-sm z-50 border-l-4 border-brand-green-500 animate-in fade-in-0 slide-in-from-right-8 duration-500">
          <div className="flex items-start">
             <div className="flex-shrink-0 pt-0.5">
                <BellIcon />
             </div>
             <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-bold text-gray-900">Task Reminder: {notification.title}</p>
                <p className="mt-1 text-sm text-gray-600">{notification.description}</p>
             </div>
             <div className="ml-4 flex-shrink-0 flex">
                <button onClick={closeNotification} className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500">
                  <span className="sr-only">Close</span>
                  <CloseIcon />
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};


export default App;
