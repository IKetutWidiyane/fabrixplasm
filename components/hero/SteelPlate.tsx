"use client";
import { forwardRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export const SteelPlate = forwardRef<THREE.Group>((_, ref) => {
  // Load tekstur dari folder public/textures/hero/
  const textureProps = useTexture({
    map: "/textures/hero/Metal061A_1K-PNG_Color.png",
    normalMap: "/textures/hero/Metal061A_1K-PNG_NormalGL.png",
    roughnessMap: "/textures/hero/Metal061A_1K-PNG_Roughness.png",
    metalnessMap: "/textures/hero/Metal061A_1K-PNG_Metalness.png",
  });

  return (
    <group ref={ref} position={[0, -1, 0]}>
      <mesh>
        {/* Plat besi */}
        <boxGeometry args={[20, 0.4, 15]} />
        
        {/* Sebarkan (spread) properti tekstur ke material */}
        <meshStandardMaterial 
          {...textureProps} 
          envMapIntensity={1} // Memperkuat pantulan cahaya pada area metalik
        />
      </mesh>
    </group>
  );
});

SteelPlate.displayName = "SteelPlate";