import { forwardRef } from "react";
import * as THREE from "three";

export const PlasmaArc = forwardRef<THREE.Group>((_, ref) => {
  return (
    <group ref={ref}>
      {/* Sinar Plasma Core */}
      <mesh position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={1} />
      </mesh>
      {/* Cahaya PointLight (akan dikontrol intensitasnya di HeroScene) */}
    </group>
  );
});
PlasmaArc.displayName = "PlasmaArc";