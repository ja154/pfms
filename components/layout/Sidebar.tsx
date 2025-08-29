
import React from 'react';
import type { ViewType } from '../../App';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const NavItem: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`flex items-center p-3 my-1.5 cursor-pointer rounded-lg transition-colors text-sm font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <span className="ml-3">{label}</span>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-[220px] bg-white flex-shrink-0 p-4 flex flex-col border-r border-slate-200">
      <div className="text-left mb-8 pt-4 pl-2">
        <span className="text-2xl font-bold text-slate-900">Frass<span className="text-green-600">Farm</span></span>
      </div>
      <nav className="flex-1">
        <ul>
          <NavItem
            label="Dashboard"
            isActive={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')}
          />
          <NavItem
            label="Insects"
            isActive={activeView === 'poultry'}
            onClick={() => setActiveView('poultry')}
          />
          <NavItem
            label="Feed"
            isActive={activeView === 'feed'}
            onClick={() => setActiveView('feed')}
          />
          <NavItem
            label="Records"
            isActive={activeView === 'records'}
            onClick={() => setActiveView('records')}
          />
           <NavItem
            label="Calendar"
            isActive={activeView === 'calendar'}
            onClick={() => setActiveView('calendar')}
          />
          <NavItem
            label="Tab Book"
            isActive={activeView === 'tabbook'}
            onClick={() => setActiveView('tabbook')}
          />
        </ul>
      </nav>
      <div>
         <ul>
           <NavItem
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