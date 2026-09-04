"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SparksProps {
  nozzleRef: React.RefObject<THREE.Group | null>;
}

export function Sparks({ nozzleRef }: SparksProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const particleCount = 400;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.08 + Math.random() * 0.15;
      
      // Taruh semua partikel di tengah saat pertama kali dimuat
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      vel.push(new THREE.Vector3(Math.cos(angle) * speed, (Math.random() - 0.5) * 0.02, Math.sin(angle) * speed));
    }
    return { positions: pos, velocities: vel };
  }, []);

  const sparkTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
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
    if (!nozzleRef.current || !pointsRef.current || !materialRef.current) return;

    // Logika menyala berdasarkan jarak fisik nozzle ke meja
    const isCutting = nozzleRef.current.position.y <= 0.15;
    
    // Animasi fade in & out percikan api
    materialRef.current.opacity = THREE.MathUtils.lerp(
      materialRef.current.opacity,
      isCutting ? 1 : 0,
      0.2
    );

    // Hanya gerakkan partikel jika sedang menyala atau sedang fade out
    if (materialRef.current.opacity > 0.01) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      
      // Ambil posisi ujung nozzle saat ini
      const originX = nozzleRef.current.position.x;
      const originY = 0; // Jatuh tepat di atas plat besi
      const originZ = nozzleRef.current.position.z;

      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        const dx = pos[i * 3] - originX;
        const dz = pos[i * 3 + 2] - originZ;
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Jika partikel terbang terlalu jauh, reset kembali ke ujung nozzle
        if (dist > 1.5 + Math.random() * 2) {
          pos[i * 3] = originX;
          pos[i * 3 + 1] = originY;
          pos[i * 3 + 2] = originZ;
          
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.08 + Math.random() * 0.15;
          velocities[i].set(Math.cos(angle) * speed, (Math.random() - 0.5) * 0.02, Math.sin(angle) * speed);
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        map={sparkTexture}
        size={0.3}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0} // Default mati saat pertama dimuat
      />
    </points>
  );
}