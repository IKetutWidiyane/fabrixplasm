"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLATE_SURFACE_Y } from "@/lib/fpCutPath";

interface SparksProps {
  nozzleRef: React.RefObject<THREE.Group | null>;
  cuttingRef: React.RefObject<boolean>;
  tangentRef: React.RefObject<THREE.Vector2>;
}

export function Sparks({ nozzleRef, cuttingRef, tangentRef }: SparksProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const velocitiesRef = useRef<THREE.Vector3[]>([]);

  const particleCount = useMemo(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return 150;
    }
    return 320;
  }, []);

  // Tiap percikan memiliki 2 titik (Head & Tail) -> 6 float per particle
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 6);
    for (let i = 0; i < particleCount; i++) {
      // Head
      pos[i * 6] = 0;
      pos[i * 6 + 1] = PLATE_SURFACE_Y;
      pos[i * 6 + 2] = 0;
      // Tail
      pos[i * 6 + 3] = 0;
      pos[i * 6 + 4] = PLATE_SURFACE_Y;
      pos[i * 6 + 5] = 0;
    }
    return pos;
  }, [particleCount]);

  useEffect(() => {
    const vel: THREE.Vector3[] = [];
    for (let i = 0; i < particleCount; i++) {
      vel.push(new THREE.Vector3());
    }
    velocitiesRef.current = vel;
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!nozzleRef.current || !linesRef.current || !materialRef.current || velocitiesRef.current.length < particleCount) return;
    const dt = Math.min(delta, 0.05);
    const cutting = cuttingRef.current;
    const targetOpacity = cutting ? 0.95 : 0;
    materialRef.current.opacity += (targetOpacity - materialRef.current.opacity) * (1 - Math.exp(-14 * dt));

    if (materialRef.current.opacity <= 0.01) {
      if (linesRef.current.visible) linesRef.current.visible = false;
      return;
    }
    if (!linesRef.current.visible) linesRef.current.visible = true;

    const posAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const originX = nozzleRef.current.position.x;
    const originY = PLATE_SURFACE_Y + 0.015;
    const originZ = nozzleRef.current.position.z;
    const tx = tangentRef.current.x;
    const tz = tangentRef.current.y;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < particleCount; i++) {
      const idxHead = i * 6;
      const idxTail = i * 6 + 3;

      // Perbarui posisi Ujung (Head)
      pos[idxHead] += velocities[i].x;
      pos[idxHead + 1] += velocities[i].y;
      pos[idxHead + 2] += velocities[i].z;

      // Ekor (Tail) ditarik ke belakang berdasarkan kecepatan (efek motion blur)
      const stretch = 0.08;
      pos[idxTail] = pos[idxHead] - velocities[i].x * stretch;
      pos[idxTail + 1] = pos[idxHead + 1] - velocities[i].y * stretch;
      pos[idxTail + 2] = pos[idxHead + 2] - velocities[i].z * stretch;

      // Gravitasi tarik api ke bawah
      velocities[i].y -= 0.018;

      const dx = pos[idxHead] - originX;
      const dy = pos[idxHead + 1] - originY;
      const dz = pos[idxHead + 2] - originZ;
      const dist = Math.hypot(dx, dy, dz);

      // Respawn percikan api baru di titik pemotongan
      if (dist > 1.3 + Math.random() * 1.2 || pos[idxHead + 1] < PLATE_SURFACE_Y - 0.06) {
        pos[idxHead] = originX + (Math.random() - 0.5) * 0.02;
        pos[idxHead + 1] = originY;
        pos[idxHead + 2] = originZ + (Math.random() - 0.5) * 0.02;

        pos[idxTail] = pos[idxHead];
        pos[idxTail + 1] = pos[idxHead + 1];
        pos[idxTail + 2] = pos[idxHead + 2];

        const side = (Math.random() - 0.5) * 1.2;
        const back = 0.12 + Math.random() * 0.22;
        const up = 0.04 + Math.random() * 0.12;

        velocities[i].set(
          -tx * back + -tz * side * 0.45,
          up,
          -tz * back + tx * side * 0.45
        );
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        color="#FF5500"
        transparent
        opacity={0}
        linewidth={2}
        toneMapped={false} // Agar menyala silau saat mengenai efek Bloom
      />
    </lineSegments>
  );
}