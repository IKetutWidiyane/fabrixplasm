"use client";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export function FPMark() {
  return (
    <group position={[-2, 0.201, 1]} rotation={[-Math.PI / 2, 0, 0]}>
      <Text
        fontSize={3}
        letterSpacing={-0.1}
        fontWeight="bold"
        // HAPUS ATAU COMMENT BARIS 'font' DI BAWAH INI SEMENTARA:
        // font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Nd-_cjA.woff"
      >
        FP
        <meshBasicMaterial 
          color="#FF6A00" 
          toneMapped={false} 
        />
      </Text>
    </group>
  );
}