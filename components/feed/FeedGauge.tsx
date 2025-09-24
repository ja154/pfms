import React from 'react';

interface FeedGaugeProps {
  value: number;
  maxValue: number;
}

const FeedGauge: React.FC<FeedGaugeProps> = ({ value, maxValue }) => {
  const percentage = Math.min(Math.max(value / maxValue, 0), 1);
  const radius = 85;
  const strokeWidth = 25;
  const viewBoxSizeX = 220;
  const viewBoxSizeY = 110;
  
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage);

  const getBarColor = () => {
    if (percentage > 0.5) return 'stroke-green-600';
    if (percentage > 0.2) return 'stroke-amber-500';
    return 'stroke-red-600';
  };
  
  const barColor = getBarColor();
  const startX = (viewBoxSizeX / 2) - radius;
  const endX = (viewBoxSizeX / 2) + radius;
  const y = viewBoxSizeY;

  const path = `M ${startX},${y} A ${radius},${radius} 0 0 1 ${endX},${y}`;

  return (
    <div className="relative flex justify-center items-center h-full pt-4">
      <svg width="100%" height="auto" viewBox={`0 0 ${viewBoxSizeX} ${viewBoxSizeY + strokeWidth/2}`}>
        {/* Background Arc */}
        <path
          d={path}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-slate-200"
          strokeLinecap="round"
        />
        {/* Foreground Arc */}
        <path
          d={path}
          fill="none"
          strokeWidth={strokeWidth}
          className={`${barColor} transition-all duration-700 ease-in-out`}
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-2 text-center">
        <p className="text-4xl font-bold text-slate-900">{value.toLocaleString()}<span className="text-2xl text-slate-500 font-medium">kg</span></p>
        <p className="text-md font-medium text-slate-600">{(percentage * 100).toFixed(1)}% Full</p>
      </div>
    </div>
  );
};

export default FeedGauge;
