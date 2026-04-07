import { useState, useEffect } from 'react';
import { SystemMetrics } from '../types';

/**
 * In a real macOS app, this would call native APIs.
 * For this web-based visualization, we simulate realistic system behavior
 * with some random spikes and trends to demonstrate the "living" aspect.
 */
export function useSystemTelemetry() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0.1,
    memory: 0.4,
    thermal: 0.3,
    network: 0.05,
    disk: 0.02,
    timestamp: Date.now(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        // Simulate CPU jitter and occasional spikes
        const cpuTarget = Math.random() > 0.9 ? Math.random() * 0.4 + 0.5 : Math.random() * 0.2 + 0.1;
        const cpu = prev.cpu * 0.8 + cpuTarget * 0.2;

        // Memory is more stable
        const memory = Math.min(0.9, Math.max(0.1, prev.memory + (Math.random() - 0.5) * 0.01));

        // Thermal follows CPU with lag
        const thermal = prev.thermal * 0.95 + cpu * 0.05;

        // Network and Disk are bursty
        const network = Math.random() > 0.8 ? Math.random() * 0.6 : Math.random() * 0.1;
        const disk = Math.random() > 0.9 ? Math.random() * 0.4 : Math.random() * 0.05;

        return {
          cpu,
          memory,
          thermal,
          network,
          disk,
          timestamp: Date.now(),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}
