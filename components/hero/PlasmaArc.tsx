"use client";
import { forwardRef, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface PlasmaArcProps {
  cuttingRef: React.RefObject<boolean>;
}

export const PlasmaArc = forwardRef<THREE.Group, PlasmaArcProps>(({ cuttingRef }, ref) => {
  const coreRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);
  const impactRef = useRef<THREE.MeshBasicMaterial>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const pulse = useRef(0);

  useFrame((_, delta) => {
    if (!coreRef.current || !glowRef.current || !impactRef.current || !beamRef.current) return;
    const cutting = cuttingRef.current;
    const dt = Math.min(delta, 0.05);
    const follow = 1 - Math.exp(-18 * dt);
    pulse.current += dt * (cutting ? 62 : 8);
    const flicker = cutting ? 0.88 + Math.sin(pulse.current) * 0.1 + Math.sin(pulse.current * 2.4) * 0.05 : 0;

    coreRef.current.opacity += (flicker - coreRef.current.opacity) * follow;
    glowRef.current.opacity += (flicker * 0.5 - glowRef.current.opacity) * follow;
    impactRef.current.opacity += (flicker - impactRef.current.opacity) * follow;

    const scale = cutting ? 1 + Math.sin(pulse.current * 1.6) * 0.1 : 0.35;
    beamRef.current.scale.set(scale, 1, scale);
  });

  return (
    <group ref={ref}>
      <mesh ref={beamRef} position={[0, -0.055, 0]}>
        <cylinderGeometry args={[0.012, 0.028, 0.1, 10]} />
        <meshBasicMaterial ref={coreRef} color="#FFF6D8" transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.055, 0]}>
        <cylinderGeometry args={[0.03, 0.055, 0.1, 10]} />
        <meshBasicMaterial ref={glowRef} color="#FF6A00" transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial ref={impactRef} color="#FFFFFF" transparent opacity={0} toneMapped={false} />
      </mesh>
    </group>
  );
});

PlasmaArc.displayName = "PlasmaArc";
