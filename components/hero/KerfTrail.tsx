"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getKerfSegments } from "@/lib/fpCutPath";

type KerfTrailProps = {
  cutDistanceRef: React.RefObject<number>;
};

export function KerfTrail({ cutDistanceRef }: KerfTrailProps) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const segments = useMemo(() => getKerfSegments(), []);
  
  const { positions, prefixLengths, totalLength } = useMemo(() => {
    const pos = new Float32Array(segments.length * 6);
    const prefix: number[] = [];
    let acc = 0;
    for (let i = 0; i < segments.length; i++) {
      const s = segments[i];
      // Naikkan posisi Y sedikit (+0.002) agar tidak z-fighting dengan lantai
      pos[i * 6] = s.start.x;
      pos[i * 6 + 1] = s.start.y + 0.002;
      pos[i * 6 + 2] = s.start.z;
      pos[i * 6 + 3] = s.end.x;
      pos[i * 6 + 4] = s.end.y + 0.002;
      pos[i * 6 + 5] = s.end.z;
      acc += s.length;
      prefix.push(acc);
    }
    return { positions: pos, prefixLengths: prefix, totalLength: acc };
  }, [segments]);

  useFrame(() => {
    const line = lineRef.current;
    if (!line) return;
    const cut = cutDistanceRef.current;
    let count = 0;
    if (cut > 0) {
      for (let i = 0; i < prefixLengths.length; i++) {
        if (prefixLengths[i] <= cut + 0.002) count = i + 1;
        else break;
      }
    }
    if (cut >= totalLength - 0.02) count = prefixLengths.length;
    line.geometry.setDrawRange(0, count * 2);
  });

  return (
    <lineSegments ref={lineRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      {/* Warna super terang + toneMapped={false} agar garis membara menyala terang di Bloom */}
      <lineBasicMaterial 
        color="#FF3300" 
        linewidth={3}
        toneMapped={false} 
      />
    </lineSegments>
  );
}