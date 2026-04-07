import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { SystemMetrics } from '../types';

interface Heart3DProps {
  metrics: SystemMetrics;
}

export function Heart3D({ metrics }: Heart3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Physiology Mapping
  const pulseSpeed = useMemo(() => 0.5 + metrics.cpu * 4, [metrics.cpu]);
  const scale = useMemo(() => 1 + metrics.memory * 0.5, [metrics.memory]);
  
  const color = useMemo(() => {
    // Thermal 0 (Blue) -> 1 (Red)
    const r = metrics.thermal;
    const g = (1 - metrics.thermal) * 0.2;
    const b = (1 - metrics.thermal);
    return new THREE.Color(r, g, b);
  }, [metrics.thermal]);

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;

    const t = state.clock.getElapsedTime();
    
    // Pulse animation
    const pulse = Math.sin(t * pulseSpeed * Math.PI) * 0.1 + 1;
    groupRef.current.scale.setScalar(scale * pulse);

    // Subtle rotation
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    groupRef.current.rotation.z = Math.cos(t * 0.3) * 0.1;

    // Jitter based on disk
    if (metrics.disk > 0.1) {
      groupRef.current.position.x = (Math.random() - 0.5) * metrics.disk * 0.1;
      groupRef.current.position.y = (Math.random() - 0.5) * metrics.disk * 0.1;
    } else {
      groupRef.current.position.set(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* The "Heart" - using a distorted sphere as a base for an organic look */}
        <Sphere ref={meshRef} args={[1, 64, 64]}>
          <MeshDistortMaterial
            color={color}
            speed={pulseSpeed}
            distort={0.4 + metrics.cpu * 0.3}
            radius={1}
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>

        {/* Veins / Internal structure effect */}
        <Sphere args={[0.95, 32, 32]}>
          <meshStandardMaterial
            color="#000"
            wireframe
            transparent
            opacity={0.3}
          />
        </Sphere>
      </Float>

      {/* Ambient particles representing network flow */}
      {[...Array(20)].map((_, i) => (
        <NetworkParticle key={i} index={i} metrics={metrics} />
      ))}
    </group>
  );
}

function NetworkParticle({ index, metrics }: { index: number; metrics: SystemMetrics }) {
  const ref = useRef<THREE.Mesh>(null);
  const randomOffset = useMemo(() => Math.random() * 100, []);
  
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() + randomOffset;
    const speed = 0.5 + metrics.network * 2;
    
    const radius = 2 + Math.sin(t * 0.2) * 0.5;
    ref.current.position.x = Math.cos(t * speed + index) * radius;
    ref.current.position.y = Math.sin(t * speed * 1.2 + index) * radius;
    ref.current.position.z = Math.sin(t * speed * 0.8 + index) * radius;
    
    const s = 0.02 + metrics.network * 0.05;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#fff" transparent opacity={0.6} />
    </mesh>
  );
}
