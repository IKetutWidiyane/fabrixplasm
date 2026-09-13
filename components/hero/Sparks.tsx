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

function createSparkTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,150,0,1)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export function Sparks({ nozzleRef, cuttingRef, tangentRef }: SparksProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const velocitiesRef = useRef<THREE.Vector3[]>([]);

  const particleCount = useMemo(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return 110;
    }
    return 240;
  }, []);

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = PLATE_SURFACE_Y;
      pos[i * 3 + 2] = 0;
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

  const sparkTexture = useMemo(() => createSparkTexture(), []);

  useEffect(() => {
    return () => {
      sparkTexture?.dispose();
    };
  }, [sparkTexture]);

  useFrame((_, delta) => {
    if (!nozzleRef.current || !pointsRef.current || !materialRef.current || velocitiesRef.current.length < particleCount) return;
    const dt = Math.min(delta, 0.05);
    const cutting = cuttingRef.current;
    const targetOpacity = cutting ? 1 : 0;
    materialRef.current.opacity += (targetOpacity - materialRef.current.opacity) * (1 - Math.exp(-12 * dt));

    if (materialRef.current.opacity <= 0.01) {
      if (pointsRef.current.visible) pointsRef.current.visible = false;
      return;
    }
    if (!pointsRef.current.visible) pointsRef.current.visible = true;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const originX = nozzleRef.current.position.x;
    const originY = PLATE_SURFACE_Y + 0.02;
    const originZ = nozzleRef.current.position.z;
    const tx = tangentRef.current.x;
    const tz = tangentRef.current.y;
    const velocities = velocitiesRef.current;

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
