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

    return (
      <group ref={ref}>
        <group position={[0, 0.02, 0]}>{model && <primitive object={model} />}</group>
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.065, 0.32, 20]} />
          <meshStandardMaterial color="#161616" metalness={0.88} roughness={0.32} />
        </mesh>
        {children}
      </group>
    );
  },
);

PlasmaNozzle.displayName = "PlasmaNozzle";
useGLTF.preload("/models/hero/nozzle.glb");
