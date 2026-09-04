"use client";
import { forwardRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export const SteelPlate = forwardRef<THREE.Group>((_, ref) => {
  const textureProps = useTexture({
    map: "/textures/hero/color.png",
    normalMap: "/textures/hero/normal.png",
    roughnessMap: "/textures/hero/roughness.png",
    metalnessMap: "/textures/hero/metalness.png",
  });

  return (
    <group ref={ref} position={[0, -0.4, 0]}>
      {/* Tambahkan receiveShadow disini */}
      <mesh receiveShadow>
        <boxGeometry args={[20, 0.4, 15]} />
        <meshStandardMaterial 
          {...textureProps} 
          envMapIntensity={1.5} // Memperkuat refleksi dari Environment warehouse
        />
      </mesh>
    </group>
  );
});

SteelPlate.displayName = "SteelPlate";