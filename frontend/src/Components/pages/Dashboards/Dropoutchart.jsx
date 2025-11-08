import React from 'react';
import { PieChart, Pie, Cell,Tooltip ,Legend } from 'recharts';

const data = [
  { name: 'Low Risk', value: 300 },
  { name: 'Medium Risk', value: 100 },
  { name: 'High Risk', value: 50 },
];

const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

const Dropoutchart = () => {
  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        label
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default Dropoutchart;
