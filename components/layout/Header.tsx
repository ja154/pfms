
import React from 'react';
import { useData } from '../../context/DataContext';

const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 20A7 7 0 0 1 4 13V8a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1.23A7 7 0 0 1 11 20z"></path>
      <path d="M15.5 5.5A2.5 2.5 0 0 1 18 8"></path>
    </svg>
);


const Header: React.FC = () => {
  const { state } = useData();

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm p-4 border-b border-gray-200/80 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="bg-brand-green-100 p-2 rounded-lg">
          <LeafIcon className="text-brand-green-700" />
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