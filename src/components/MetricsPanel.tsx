import { motion } from 'motion/react';
import { SystemMetrics } from '../types';
import { Cpu, Database, Thermometer, Globe, HardDrive } from 'lucide-react';
import { cn } from '../lib/utils';

interface MetricsPanelProps {
  metrics: SystemMetrics;
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  const items = [
    { label: 'CPU', value: metrics.cpu, icon: Cpu, color: 'text-blue-400' },
    { label: 'Memory', value: metrics.memory, icon: Database, color: 'text-purple-400' },
    { label: 'Thermal', value: metrics.thermal, icon: Thermometer, color: 'text-orange-400' },
    { label: 'Network', value: metrics.network, icon: Globe, color: 'text-green-400' },
    { label: 'Disk', value: metrics.disk, icon: HardDrive, color: 'text-slate-400' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <item.icon size={16} className={item.color} />
              <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                {item.label}
              </span>
            </div>
            <span className="text-sm font-mono font-bold">
              {Math.round(item.value * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", item.color.replace('text-', 'bg-'))}
              initial={{ width: 0 }}
              animate={{ width: `${item.value * 100}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
