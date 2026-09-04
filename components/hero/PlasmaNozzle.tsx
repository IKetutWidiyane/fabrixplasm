import { forwardRef } from "react";
import * as THREE from "three";

export const PlasmaNozzle = forwardRef<THREE.Group, { children?: React.ReactNode }>(({ children }, ref) => {
  return (
    <group ref={ref}>
      {/* Body Nozzle */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.35, 0.2, 2, 32]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Tip Tembaga */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.05, 0.4, 32]} />
        <meshStandardMaterial color="#b87333" metalness={1} roughness={0.3} />
      </mesh>
      {children}
    </group>
  );
});
PlasmaNozzle.displayName = "PlasmaNozzle";