import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { SystemMetrics } from '../types';

interface OrganismProps {
  metrics: SystemMetrics;
}

export const Organism: React.FC<OrganismProps> = ({ metrics }) => {
  // Physiology Mapping
  const pulseDuration = useMemo(() => {
    // CPU 0 -> 2s, CPU 1 -> 0.4s
    return 2 - (metrics.cpu * 1.6);
  }, [metrics.cpu]);

  const breathScale = useMemo(() => {
    // Memory 0 -> 1.0, Memory 1 -> 1.3
    return 1 + (metrics.memory * 0.3);
  }, [metrics.memory]);

  const color = useMemo(() => {
    // Thermal 0 (Blue) -> 1 (Red)
    const r = Math.floor(metrics.thermal * 255);
    const g = Math.floor((1 - metrics.thermal) * 150 + 50);
    const b = Math.floor((1 - metrics.thermal) * 255);
    return `rgb(${r}, ${g}, ${b})`;
  }, [metrics.thermal]);

  const jitter = useMemo(() => {
    // Disk activity causes micro-jitter
    return metrics.disk * 5;
  }, [metrics.disk]);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: pulseDuration * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ backgroundColor: color }}
        className="absolute w-64 h-64 rounded-full blur-3xl"
      />

      {/* Core Organism */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, jitter, -jitter, 0],
          y: [0, -jitter, jitter, 0],
        }}
        transition={{
          scale: {
            duration: pulseDuration,
            repeat: Infinity,
            ease: "easeInOut",
          },
          x: { duration: 0.1, repeat: Infinity },
          y: { duration: 0.1, repeat: Infinity },
        }}
        className="relative z-10"
      >
        <svg width="300" height="300" viewBox="0 0 200 200">
          <defs>
            <radialGradient id="organismGradient">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="black" stopOpacity="0.5" />
            </radialGradient>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            </filter>
          </defs>

          <g filter="url(#goo)">
            {/* Main Body */}
            <motion.circle
              cx="100"
              cy="100"
              r={40 * breathScale}
              fill="url(#organismGradient)"
            />
            
            {/* Satellite Blobs (Network Activity) */}
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                cx="100"
                cy="100"
                r={10 + metrics.network * 20}
                fill={color}
                animate={{
                  x: Math.cos(i * (Math.PI * 2 / 5)) * (60 + metrics.network * 40),
                  y: Math.sin(i * (Math.PI * 2 / 5)) * (60 + metrics.network * 40),
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* Pulse Rings */}
      <motion.div
        animate={{
          scale: [1, 2],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: pulseDuration,
          repeat: Infinity,
          ease: "easeOut",
        }}
        style={{ borderColor: color }}
        className="absolute w-32 h-32 border-2 rounded-full"
      />
    </div>
  );
};
