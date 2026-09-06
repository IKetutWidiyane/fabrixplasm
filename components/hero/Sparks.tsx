"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLATE_SURFACE_Y } from "@/lib/fpCutPath";

interface SparksProps {
  nozzleRef: React.RefObject<THREE.Group | null>;
  cuttingRef: React.RefObject<boolean>;
  tangentRef: React.RefObject<THREE.Vector2>;
}

export function Sparks({ nozzleRef, cuttingRef, tangentRef }: SparksProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const particleCount = 280;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel: THREE.Vector3[] = [];
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = PLATE_SURFACE_Y;
      pos[i * 3 + 2] = 0;
      vel.push(new THREE.Vector3());
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

  useFrame((_, delta) => {
    if (!nozzleRef.current || !pointsRef.current || !materialRef.current) return;
    const dt = Math.min(delta, 0.05);
    const cutting = cuttingRef.current;
    const targetOpacity = cutting ? 1 : 0;
    materialRef.current.opacity += (targetOpacity - materialRef.current.opacity) * (1 - Math.exp(-12 * dt));

    if (materialRef.current.opacity <= 0.01) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const originX = nozzleRef.current.position.x;
    const originY = PLATE_SURFACE_Y + 0.02;
    const originZ = nozzleRef.current.position.z;
    const tx = tangentRef.current.x;
    const tz = tangentRef.current.y;

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;
      velocities[i].y -= 0.012;

      const dx = pos[i * 3] - originX;
      const dy = pos[i * 3 + 1] - originY;
      const dz = pos[i * 3 + 2] - originZ;
      const dist = Math.hypot(dx, dy, dz);

      if (dist > 1.1 + Math.random() * 1.4 || pos[i * 3 + 1] < PLATE_SURFACE_Y - 0.05) {
        pos[i * 3] = originX + (Math.random() - 0.5) * 0.04;
        pos[i * 3 + 1] = originY;
        pos[i * 3 + 2] = originZ + (Math.random() - 0.5) * 0.04;

        const side = (Math.random() - 0.5) * 0.9;
        const back = 0.08 + Math.random() * 0.16;
        const up = 0.02 + Math.random() * 0.08;
        velocities[i].set(
          -tx * back + -tz * side * 0.35,
          up,
          -tz * back + tx * side * 0.35,
        );
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        map={sparkTexture}
        size={0.22}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0}
      />
    </points>
  );
}
