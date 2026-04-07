import { useState, useEffect, useMemo, Suspense } from 'react';
import { motion } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, PerspectiveCamera } from '@react-three/drei';
import { useSystemTelemetry } from './hooks/useSystemTelemetry';
import { calculateOrganismState } from './physiology';
import { Heart3D } from './components/Heart3D';
import { MetricsPanel } from './components/MetricsPanel';
import { HistoryChart } from './components/HistoryChart';
import { SystemMetrics } from './types';
import { 
  Activity, 
  Settings, 
  Maximize2, 
  Minimize2, 
  Layout, 
  Info,
  Clock,
  Heart
} from 'lucide-react';

export default function App() {
  const metrics = useSystemTelemetry();
  const [history, setHistory] = useState<SystemMetrics[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate organism state based on current metrics
  const organismState = useMemo(() => calculateOrganismState(metrics), [metrics]);

  // Maintain 60s history
  useEffect(() => {
    setHistory(prev => {
      const next = [...prev, metrics];
      if (next.length > 60) return next.slice(next.length - 60);
      return next;
    });
  }, [metrics]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Fake macOS Menu Bar */}
      <header className="h-8 w-full bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 fixed top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Activity size={14} className="text-blue-400" />
            <span className="text-[11px] font-bold tracking-tight">System.Heartbeat 3D</span>
          </div>
          <nav className="flex items-center gap-3">
            <button className="text-[11px] text-white/60 hover:text-white transition-colors">File</button>
            <button className="text-[11px] text-white/60 hover:text-white transition-colors">View</button>
            <button className="text-[11px] text-white/60 hover:text-white transition-colors">Window</button>
            <button className="text-[11px] text-white/60 hover:text-white transition-colors">Help</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[11px] text-white/60">
            <Clock size={12} />
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <button className="text-white/60 hover:text-white transition-colors">
            <Settings size={14} />
          </button>
        </div>
      </header>

      <main className="pt-12 pb-8 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-3rem)]">
        {/* Left Column: 3D Heart Focus */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full">
          <div className="flex-1 relative bg-white/[0.02] rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col items-center justify-center group">
            <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">3D Physiology Engine</span>
            </div>
            
            {/* 3D Canvas */}
            <div className="w-full h-full cursor-grab active:cursor-grabbing">
              <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
                <Suspense fallback={null}>
                  <ambientLight intensity={0.2} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} color={organismState.color} />
                  
                  <Heart3D metrics={metrics} />
                  
                  <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
                  <Environment preset="city" />
                  <OrbitControls 
                    enableZoom={false} 
                    enablePan={false} 
                    minPolarAngle={Math.PI / 2.5} 
                    maxPolarAngle={Math.PI / 1.5} 
                  />
                </Suspense>
              </Canvas>
            </div>
            
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-10 pointer-events-none">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-white/30 mb-1">State</span>
                <span className="text-sm font-medium tracking-tight">
                  {metrics.cpu > 0.8 ? 'Critical Stress' : metrics.cpu > 0.5 ? 'Active Load' : 'Stable Rhythm'}
                </span>
              </div>
              <div className="flex items-center gap-2 pointer-events-auto">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 backdrop-blur-xl"
                >
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* History Chart */}
          <div className="h-48">
            <HistoryChart history={history} />
          </div>
        </div>

        {/* Right Column: Metrics & Details */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
          <div className="flex items-center gap-2 mb-2">
            <Layout size={18} className="text-blue-400" />
            <h2 className="text-lg font-bold tracking-tight">Telemetry Dashboard</h2>
          </div>

          <MetricsPanel metrics={metrics} />

          <div className="flex-1 bg-white/5 rounded-3xl border border-white/10 p-8 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-blue-400/60" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">3D System Insights</h3>
            </div>
            
            <div className="space-y-6">
              <InsightItem 
                title="Biological Translation"
                description={`The 3D heart is currently ${organismState.pulseRate > 2 ? 'pulsing rapidly' : 'resting calmly'}. This reflects a CPU load of ${Math.round(metrics.cpu * 100)}%.`}
              />
              <InsightItem 
                title="Memory Pressure"
                description={`The heart's volume is ${organismState.breathDepth > 1 ? 'expanded' : 'compressed'}, indicating ${Math.round(metrics.memory * 100)}% memory utilization.`}
              />
              <InsightItem 
                title="Thermal Equilibrium"
                description={`The core hue is ${metrics.thermal > 0.7 ? 'strained red' : 'stable blue'}. Temperature is ${Math.round(metrics.thermal * 100)}%.`}
              />
            </div>

            <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                UPTIME: ACTIVE
              </div>
              <div className="flex items-center gap-1 text-red-400/60">
                <Heart size={12} fill="currentColor" className="animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button (Mini View Toggle) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full shadow-2xl shadow-blue-500/20 flex items-center justify-center border border-white/20 z-50"
      >
        <Activity size={24} />
      </motion.button>
    </div>
  );
}

function InsightItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">{title}</span>
      <p className="text-xs text-white/50 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
