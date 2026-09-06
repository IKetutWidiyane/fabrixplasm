"use client";
import { useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FP_LAYOUT, getTotalCutLength } from "@/lib/fpCutPath";

type FPMarkProps = {
  progressRef: React.RefObject<number>;
};

export function FPMark({ progressRef }: FPMarkProps) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const total = getTotalCutLength();

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    const amount = total > 0 ? THREE.MathUtils.clamp(progressRef.current / total, 0, 1) : 0;
    const target = amount > 0.92 ? (amount - 0.92) / 0.08 : 0;
    const follow = 1 - Math.exp(-5 * delta);
    materialRef.current.opacity += (target - materialRef.current.opacity) * follow;
  });

  return (
    <group position={[FP_LAYOUT.x, 0.201, FP_LAYOUT.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <Text
        fontSize={FP_LAYOUT.height * 0.92}
        letterSpacing={-0.06}
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        FP
        <meshBasicMaterial
          ref={materialRef}
          color="#FF6A00"
          toneMapped={false}
          transparent
          opacity={0}
        />
      </Text>
    </group>
  );
}
