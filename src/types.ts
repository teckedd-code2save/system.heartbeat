export interface SystemMetrics {
  cpu: number; // 0-1
  memory: number; // 0-1
  thermal: number; // 0-1
  network: number; // 0-1
  disk: number; // 0-1
  timestamp: number;
}

export interface OrganismState {
  pulseRate: number;
  breathDepth: number;
  tension: number;
  color: string;
  velocity: number;
  stability: number;
}
