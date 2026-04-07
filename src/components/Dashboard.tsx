import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';

const rainfallData = [
  { rainfall: 300, production: 15000 },
  { rainfall: 500, production: 22000 },
  { rainfall: 800, production: 35000 },
  { rainfall: 1200, production: 48000 },
  { rainfall: 1500, production: 55000 },
  { rainfall: 2000, production: 62000 },
  { rainfall: 2500, production: 70000 },
  { rainfall: 3000, production: 75000 },
];

const cropDistribution = [
  { name: 'Maize', count: 45000 },
  { name: 'Potatoes', count: 38000 },
  { name: 'Wheat', count: 32000 },
  { name: 'Rice', count: 28000 },
  { name: 'Yams', count: 15000 },
  { name: 'Cassava', count: 12000 },
];

const COLORS = ['#2D5A27', '#4A7C44', '#6B9E61', '#8DBF7F', '#B0E09D', '#D4F2BC'];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rainfall vs Production */}
        <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm">
          <h3 className="font-serif italic text-lg mb-4 text-zinc-600">Annual Rainfall vs Production</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  dataKey="rainfall" 
                  label={{ value: 'Rainfall (mm)', position: 'insideBottom', offset: -5 }} 
                  fontSize={12}
                />
                <YAxis 
                  label={{ value: 'Production (hg/ha)', angle: -90, position: 'insideLeft' }} 
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="production" 
                  stroke="#2D5A27" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#2D5A27' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Type Distribution */}
        <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm">
          <h3 className="font-serif italic text-lg mb-4 text-zinc-600">Crop Type Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" fontSize={12} width={80} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pesticide Use vs Production Scatter */}
      <div className="bg-white p-6 rounded-xl border border-black/5 shadow-sm">
        <h3 className="font-serif italic text-lg mb-4 text-zinc-600">Pesticide Use vs Production (Sampled)</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Pesticide" 
                unit="t" 
                label={{ value: 'Pesticide Use (tonnes)', position: 'insideBottom', offset: -5 }}
                fontSize={12}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Production" 
                unit="hg/ha" 
                label={{ value: 'Production', angle: -90, position: 'insideLeft' }}
                fontSize={12}
              />
              <ZAxis type="number" range={[50, 400]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter 
                name="Crops" 
                data={[
                  { x: 100, y: 12000 }, { x: 500, y: 25000 }, { x: 1200, y: 45000 },
                  { x: 2000, y: 55000 }, { x: 3500, y: 68000 }, { x: 5000, y: 72000 },
                  { x: 8000, y: 85000 }, { x: 12000, y: 92000 }, { x: 15000, y: 98000 }
                ]} 
                fill="#2D5A27" 
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
