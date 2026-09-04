"use client";
import { forwardRef, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface PlasmaArcProps {
  nozzleRef: React.RefObject<THREE.Group | null>;
}

export const PlasmaArc = forwardRef<THREE.Group, PlasmaArcProps>(({ nozzleRef }, ref) => {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (!nozzleRef.current || !materialRef.current) return;
    
    // Jika Nozzle turun hingga Y <= 0.15, opacity menjadi 1 (Menyala). Jika tidak, 0 (Mati).
    const isCutting = nozzleRef.current.position.y <= 0.15;
    
    materialRef.current.opacity = THREE.MathUtils.lerp(
      materialRef.current.opacity,
      isCutting ? 1 : 0,
      0.2
    );
  });

  return (
    <group ref={ref}>
      <mesh position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial ref={materialRef} color="#FFFFFF" transparent opacity={0} />
      </mesh>
    </group>
  );
});

PlasmaArc.displayName = "PlasmaArc";