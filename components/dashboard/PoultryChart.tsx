
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PoultryCategory } from '../../types';
import Card from '../ui/Card';

interface PoultryChartProps {
  data: PoultryCategory[];
}

const PoultryChart: React.FC<PoultryChartProps> = ({ data }) => {
  return (
    <Card className="h-96">
      <h3 className="text-lg font-semibold text-brand-green-900 mb-4">Poultry Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} interval={0} />
          <YAxis />
          <Tooltip 
            cursor={{fill: 'rgba(220, 252, 231, 0.5)'}}
            contentStyle={{
                background: 'white',
                border: '1px solid #dcfce7',
                borderRadius: '0.5rem',
            }}
          />
          <Legend wrapperStyle={{paddingTop: '20px'}} />
          <Bar dataKey="count" fill="#16a34a" name="Number of Birds" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PoultryChart;