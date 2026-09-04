import { forwardRef } from "react";
import * as THREE from "three";

export const SteelPlate = forwardRef<THREE.Group>((_, ref) => {
  return (
    <group ref={ref} position={[0, -1, 0]}>
      <mesh>
        {/* Diperbesar agar sesuai sudut Top-Down */}
        <boxGeometry args={[20, 0.4, 15]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.7} metalness={0.8} />
      </mesh>
    </group>
  );
});
SteelPlate.displayName = "SteelPlate";