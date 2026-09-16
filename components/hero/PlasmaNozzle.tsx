"use client";

import { forwardRef, ReactNode, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface PlasmaNozzleProps {
  children?: ReactNode;
}

export const PlasmaNozzle = forwardRef<THREE.Group, PlasmaNozzleProps>(
  ({ children }, ref) => {
    const { scene } = useGLTF("/models/hero/nozzle.glb");

    // 1. Setup Model 3D Nozzle
    const model = useMemo(() => {
      const root = scene.clone(true);
      root.traverse((obj) => {
        obj.castShadow = true;
      });

      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z, 0.0001);
      root.scale.setScalar(0.58 / maxDim);

      const scaled = new THREE.Box3().setFromObject(root);
      const center = scaled.getCenter(new THREE.Vector3());
      root.position.set(-center.x, -scaled.min.y, -center.z);
      return root;
    }, [scene]);

    // 2. Setup Lengkungan Selang (Lokal terhadap Nozzle)
    const hoseCurve = useMemo(() => {
      return new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0.54, 0),      // Ujung atas silinder nozzle
        new THREE.Vector3(0, 1.8, -0.2),    // Lengkungan naik
        new THREE.Vector3(0, 3.2, -0.8),    // Lengkungan mengarah ke belakang
        new THREE.Vector3(0, 4.5, -1.8)     // Ujung atas selang
      );
    }, []);

    return (
      <group ref={ref}>
        {/* Model GLTF Nozzle */}
        <group position={[0, 0.02, 0]}>{model && <primitive object={model} />}</group>
        
        {/* Silinder Sambungan Atas Nozzle */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.065, 0.32, 20]} />
          <meshStandardMaterial color="#161616" metalness={0.88} roughness={0.32} />
        </mesh>

        {/* Selang Industri (Statis menempel pada grup Nozzle) */}
        <mesh castShadow receiveShadow>
          <tubeGeometry args={[hoseCurve, 32, 0.038, 12, false]} />
          <meshStandardMaterial 
            color="#111215" 
            metalness={0.85} 
            roughness={0.25} 
            envMapIntensity={2.0} 
          />
        </mesh>

        {children}
      </group>
    );
  },
);

PlasmaNozzle.displayName = "PlasmaNozzle";
useGLTF.preload("/models/hero/nozzle.glb");