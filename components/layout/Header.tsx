
import React from 'react';
import { useData } from '../../context/DataContext';

const FeatherIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
        <line x1="16" y1="8" x2="2" y2="22"></line>
        <line x1="17.5" y1="15" x2="9" y2="15"></line>
    </svg>
);


const Header: React.FC = () => {
  const { state } = useData();

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm p-4 border-b border-brand-brown-100 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="bg-brand-green-100 p-2 rounded-lg">
          <FeatherIcon className="text-brand-green-700" />
        </div>
        <h1 className="text-xl font-bold text-brand-green-900">{state.farmName}</h1>
      </div>
      <div>
        <span className="text-gray-600 font-medium">Welcome, Farm Manager!</span>
      </div>
    </header>
  );
};

export default Header;
