
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
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Insect Distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} interval={0} tick={{ fill: '#475569', fontSize: 12 }} />
          <YAxis tick={{ fill: '#475569', fontSize: 12 }}/>
          <Tooltip 
            cursor={{fill: 'rgba(22, 163, 74, 0.1)'}}
            contentStyle={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend wrapperStyle={{paddingTop: '20px'}} />
          <Bar dataKey="count" fill="#16a34a" name="Insect Count" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PoultryChart;