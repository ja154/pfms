
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/80 p-6 transition-shadow duration-300 hover:shadow-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default Card;