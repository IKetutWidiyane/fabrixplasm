import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Sparks({ active, origin }: { active: boolean; origin: THREE.Vector3 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 400;

  // Persiapkan geometri dan kecepatan partikel
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.08 + Math.random() * 0.15;
      pos[i * 3] = origin.x;
      pos[i * 3 + 1] = origin.y;
      pos[i * 3 + 2] = origin.z;
      vel.push(new THREE.Vector3(Math.cos(angle) * speed, (Math.random() - 0.5) * 0.02, Math.sin(angle) * speed));
    }
    return { positions: pos, velocities: vel };
  }, [origin]);

  const sparkTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(255,150,0,1)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    if (!active || !pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      const dx = pos[i * 3] - origin.x;
      const dz = pos[i * 3 + 2] - origin.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      // Reset jika terlalu jauh
      if (dist > 1.5 + Math.random() * 2) {
        pos[i * 3] = origin.x;
        pos[i * 3 + 1] = origin.y;
        pos[i * 3 + 2] = origin.z;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.08 + Math.random() * 0.15;
        velocities[i].set(Math.cos(angle) * speed, (Math.random() - 0.5) * 0.02, Math.sin(angle) * speed);
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial map={sparkTexture} size={0.3} transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={active ? 1 : 0} />
    </points>
  );
}