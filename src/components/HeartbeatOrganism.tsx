import { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OrganismState } from '../types';
import { cn } from '../lib/utils';

interface HeartbeatOrganismProps {
  state: OrganismState;
  className?: string;
}

export function HeartbeatOrganism({ state, className }: HeartbeatOrganismProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Blob parameters
  const points = 12;
  const radius = 100;
  const blobPoints = useMemo(() => {
    return Array.from({ length: points }, (_, i) => {
      const angle = (i / points) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle,
      };
    });
  }, [points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (time: number) => {
      const deltaTime = (time - timeRef.current) / 1000;
      timeRef.current = time;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Pulse and Breath
      const pulse = Math.sin(time * 0.001 * state.pulseRate * Math.PI * 2) * 10;
      const breath = Math.sin(time * 0.0005 * Math.PI * 2) * 20 * state.breathDepth;
      const currentRadius = radius + pulse + breath;

      // Draw Glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, currentRadius * 1.5);
      gradient.addColorStop(0, `${state.color}44`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw Blob
      ctx.beginPath();
      ctx.moveTo(
        centerX + blobPoints[0].x * (currentRadius / radius),
        centerY + blobPoints[0].y * (currentRadius / radius)
      );

      for (let i = 0; i < points; i++) {
        const p1 = blobPoints[i];
        const p2 = blobPoints[(i + 1) % points];

        // Add noise/jitter based on tension and stability
        const noiseX = (Math.random() - 0.5) * 10 * state.tension;
        const noiseY = (Math.random() - 0.5) * 10 * state.tension;

        const x1 = centerX + p1.x * (currentRadius / radius) + noiseX;
        const y1 = centerY + p1.y * (currentRadius / radius) + noiseY;
        const x2 = centerX + p2.x * (currentRadius / radius) + noiseX;
        const y2 = centerY + p2.y * (currentRadius / radius) + noiseY;

        const xc = (x1 + x2) / 2;
        const yc = (y1 + y2) / 2;

        ctx.quadraticCurveTo(x1, y1, xc, yc);
      }

      ctx.closePath();
      ctx.fillStyle = state.color;
      ctx.fill();

      // Inner Core
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fill();

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [state, blobPoints]);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="max-w-full h-auto"
      />
      
      {/* Ambient aura */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl opacity-20"
        animate={{
          backgroundColor: state.color,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4 / state.pulseRate,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
