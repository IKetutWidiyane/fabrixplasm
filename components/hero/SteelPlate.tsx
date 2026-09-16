"use client";

import { forwardRef, ReactNode } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface SteelPlateProps {
  children?: ReactNode;
}

export const SteelPlate = forwardRef<THREE.Group, SteelPlateProps>(
  ({ children }, ref) => {
    const textureProps = useTexture({
      map: "/textures/hero/color.webp",
      normalMap: "/textures/hero/normal.webp",
      roughnessMap: "/textures/hero/roughness.png",
      metalnessMap: "/textures/hero/metalness.png",
    });

    return (
      <group ref={ref} position={[0, -0.4, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[20, 0.4, 15]} />
          <meshStandardMaterial 
            {...textureProps}
            color="#1b1c20"         // Tone baja industri gelap
            metalness={1.0}         // Karakter murni logam
            roughness={0.35}        // Permukaan kusam berbobot
            envMapIntensity={2.5}   // Mempertegas pantulan lingkungan
          />
        </mesh>

        {children}
      </group>
    );
  }
);

SteelPlate.displayName = "SteelPlate";