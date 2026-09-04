"use client";
import { forwardRef, ReactNode, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface PlasmaNozzleProps {
  children?: ReactNode;
}

export const PlasmaNozzle = forwardRef<THREE.Group, PlasmaNozzleProps>(
  ({ children }, ref) => {
    // Pastikan path ke nozzle.glb sudah benar
    const { scene } = useGLTF("/models/hero/nozzle.glb");

    // Membuat jalur melengkung untuk selang/kabel (Hose)
    const hoseCurve = useMemo(() => {
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.5, 0),    // Pangkal di kepala mesin
        new THREE.Vector3(0.5, 3, -1),   // Melengkung ke belakang
        new THREE.Vector3(1, 6, -2),     // Menjulur ke atas luar layar
      ]);
    }, []);

    return (
      <group ref={ref}>
        
        {/* 1. MODEL NOZZLE ASLI (Ujungnya saja) */}
        {/* Sesuaikan scale jika masih kebesaran, misal 0.05 atau 0.02 */}
        <primitive
          object={scene}
          scale={0.03} 
          position={[0, -0.2, 0]} 
          rotation={[0, 0, 0]}
        />

        {/* 2. DUDUKAN MESIN (CNC HEAD) - Menghubungkan nozzle ke selang */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 0.8, 32]} />
          <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.4} />
        </mesh>
        
        <mesh position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 32]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 3. SELANG / KABEL (HOSE) */}
        <mesh castShadow>
          <tubeGeometry args={[hoseCurve, 64, 0.12, 16, false]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* Cahaya Plasma / Children */}
        {children}
      </group>
    );
  }
);

PlasmaNozzle.displayName = "PlasmaNozzle";
useGLTF.preload("/models/hero/nozzle.glb");