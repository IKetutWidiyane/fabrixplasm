"use client";
import { forwardRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export const SteelPlate = forwardRef<THREE.Group>((_, ref) => {
  const textureProps = useTexture({
    map: "/textures/hero/Metal061A_1K-PNG_Color.png",
    normalMap: "/textures/hero/Metal061A_1K-PNG_NormalGL.png",
    roughnessMap: "/textures/hero/Metal061A_1K-PNG_Roughness.png",
    metalnessMap: "/textures/hero/Metal061A_1K-PNG_Metalness.png",
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