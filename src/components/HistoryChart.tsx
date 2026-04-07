import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SystemMetrics } from '../types';

interface HistoryChartProps {
  history: SystemMetrics[];
}

export function HistoryChart({ history }: HistoryChartProps) {
  const data = useMemo(() => {
    return history.map((m) => ({
      time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cpu: Math.round(m.cpu * 100),
      memory: Math.round(m.memory * 100),
    }));
  }, [history]);

  return (
    <div className="h-48 w-full p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
      <h3 className="text-xs font-medium uppercase tracking-wider text-white/40 mb-4 px-2">
        History (60s)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            domain={[0, 100]} 
            hide 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Line 
            type="monotone" 
            dataKey="cpu" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="memory" 
            stroke="#a855f7" 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
