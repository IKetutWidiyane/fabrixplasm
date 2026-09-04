"use client";
import { forwardRef, ReactNode } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

// 1. Tambahkan tipe props agar TypeScript mengizinkan 'children'
interface SteelPlateProps {
  children?: ReactNode;
}

export const SteelPlate = forwardRef<THREE.Group, SteelPlateProps>(
  ({ children }, ref) => {
    const textureProps = useTexture({
      map: "/textures/hero/color.png",
      normalMap: "/textures/hero/normal.png",
      roughnessMap: "/textures/hero/roughness.png",
      metalnessMap: "/textures/hero/metalness.png",
    });

    return (
      <group ref={ref} position={[0, -0.4, 0]}>
        <mesh receiveShadow>
          {/* Ketebalan box adalah 0.4 (Y). Artinya permukaannya ada di Y = 0.2 */}
          <boxGeometry args={[20, 0.4, 15]} />
          <meshStandardMaterial 
            {...textureProps} 
            envMapIntensity={1.5} 
          />
        </mesh>

        {/* 2. Letakkan ukiran FP (children) di sini agar ikut bergerak */}
        {children}
      </group>
    );
  }
);

SteelPlate.displayName = "SteelPlate";