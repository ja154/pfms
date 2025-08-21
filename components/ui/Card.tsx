
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
