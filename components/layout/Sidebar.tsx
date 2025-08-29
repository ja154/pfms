
import React from 'react';
import type { ViewType } from '../../App';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 group ${
        isActive
          ? 'bg-gradient-to-r from-brand-green-600 to-brand-green-500 text-white shadow-lg shadow-brand-green-500/30'
          : 'text-gray-600 hover:bg-brand-green-100/50 hover:text-brand-green-800'
      }`}
    >
      {icon}
      <span className="ml-4 font-semibold">{label}</span>
    </li>
  );
};

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
);
const PoultryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.43 5.43a2.43 2.43 0 1 0-2.86 2.86"></path><path d="M13.78 12.57 6.2 20.15s-2.83-2.83-2.83-5.66S6.2 8.83 6.2 8.83Z"></path><path d="m14 14 3 3"></path><path d="M12.57 13.78 20.15 6.2s2.83 2.83 2.83 5.66-2.83 5.66-2.83 5.66Z"></path><path d="m10 10-3 3"></path></svg>
);
const FeedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.29 14.29c-1.8 1.8-4.2 2.71-6.51 2.71-5.08 0-9.22-4.14-9.22-9.22 0-2.31.91-4.71 2.71-6.51Z"></path><path d="M14.29 14.29 22 22"></path><path d="M11.36 11.36c-1.8-1.8-2.71-4.2-2.71-6.51 0-2.31.91-4.71 2.71-6.51 1.8-1.8 4.2-2.71 6.51-2.71s4.71.91 6.51 2.71C23.09 4.14 24 6.54 24 8.85c0 2.31-.91 4.71-2.71 6.51l-8.64-8.64Z"></path></svg>
);
const RecordsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
);
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const TabBookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
);
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-white/95 backdrop-blur-sm shadow-lg flex-shrink-0 z-30 p-4 flex flex-col border-r border-gray-200/80">
      <div className="flex items-center justify-center mb-8 pt-4">
        <img src="https://picsum.photos/seed/poultry/40/40" alt="Logo" className="rounded-full" />
        <span className="ml-3 text-2xl font-bold text-brand-green-800">PFMS</span>
      </div>
      <nav className="flex-1">
        <ul>
          <NavItem
            icon={<DashboardIcon />}
            label="Dashboard"
            isActive={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')}
          />
          <NavItem
            icon={<PoultryIcon />}
            label="Poultry"
            isActive={activeView === 'poultry'}
            onClick={() => setActiveView('poultry')}
          />
          <NavItem
            icon={<FeedIcon />}
            label="Feed"
            isActive={activeView === 'feed'}
            onClick={() => setActiveView('feed')}
          />
          <NavItem
            icon={<RecordsIcon />}
            label="Records"
            isActive={activeView === 'records'}
            onClick={() => setActiveView('records')}
          />
           <NavItem
            icon={<CalendarIcon />}
            label="Calendar"
            isActive={activeView === 'calendar'}
            onClick={() => setActiveView('calendar')}
          />
          <NavItem
            icon={<TabBookIcon />}
            label="Tab Book"
            isActive={activeView === 'tabbook'}
            onClick={() => setActiveView('tabbook')}
          />
        </ul>
      </nav>
      <div>
         <ul>
           <NavItem
            icon={<SettingsIcon />}
            label="Settings"
            isActive={activeView === 'settings'}
            onClick={() => setActiveView('settings')}
          />
         </ul>
      </div>
    </aside>
  );
};

export default Sidebar;