import { SystemMetrics, OrganismState } from './types';

export function calculateOrganismState(metrics: SystemMetrics): OrganismState {
  // CPU (0-1) maps to pulseRate (0.5 to 3.0 Hz)
  const pulseRate = 0.5 + metrics.cpu * 2.5;

  // Memory (0-1) maps to breathDepth (0.8 to 1.2 scale)
  const breathDepth = 0.8 + metrics.memory * 0.4;

  // CPU spikes increase tension (0 to 1)
  const tension = metrics.cpu > 0.7 ? (metrics.cpu - 0.7) / 0.3 : 0;

  // Thermal (0-1) maps to color (Blue to Red)
  // 0.0: #3b82f6 (Blue 500)
  // 0.5: #f59e0b (Amber 500)
  // 1.0: #ef4444 (Red 500)
  let color = '#3b82f6';
  if (metrics.thermal > 0.7) {
    color = '#ef4444';
  } else if (metrics.thermal > 0.4) {
    color = '#f59e0b';
  }

  // Network (0-1) maps to velocity
  const velocity = 1 + metrics.network * 5;

  // Stability decreases with high CPU/Disk
  const stability = Math.max(0, 1 - (metrics.cpu * 0.5 + metrics.disk * 0.5));

  return {
    pulseRate,
    breathDepth,
    tension,
    color,
    velocity,
    stability,
  };
}
