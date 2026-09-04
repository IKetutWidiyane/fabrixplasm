"use client";
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SteelPlate } from "./SteelPlate";
import { PlasmaNozzle } from "./PlasmaNozzle";
import { PlasmaArc } from "./PlasmaArc";
import { Sparks } from "./Sparks";
import { FPMark } from "./FPMark";
import { useMousePosition } from "@/hooks/useMousePosition";

function SceneContent({ scrollProxyRef }: { scrollProxyRef: React.RefObject<HTMLDivElement | null> }) {
  const nozzleRef = useRef<THREE.Group>(null);
  const arcRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const [isCutting, setIsCutting] = useState(false);
  const nozzlePos = useRef(new THREE.Vector3(2, 3, 0)); // Posisi awal

  const { normalizedX, normalizedY } = useMousePosition();

  useEffect(() => {
    if (!scrollProxyRef.current || !nozzleRef.current) return;
    
    // Inisialisasi posisi
    nozzleRef.current.position.copy(nozzlePos.current);
    
    const tl = gsap.timeline({
      scrollTrigger: { trigger: scrollProxyRef.current, start: "top top", end: "bottom bottom", scrub: 1.5 }
    });

    // 0% -> 20%: Nozzle Turun
    tl.to(nozzleRef.current.position, { y: -0.5, ease: "power2.in" }, 0);
    tl.call(() => setIsCutting(true), undefined, 0.2);
    tl.call(() => setIsCutting(false), undefined, 0.19);
    
    // 20% -> 70%: Nozzle Bergerak Memotong
    tl.to(nozzleRef.current.position, { x: -2, z: 2, ease: "power1.inOut" }, 0.2);
    tl.to(nozzleRef.current.position, { x: -4, z: -1, ease: "power1.inOut" }, 0.45);
  }, [scrollProxyRef]);

  useFrame(({ camera }) => {
    // Sync cahaya dengan nozzle
    if (nozzleRef.current && lightRef.current) {
      lightRef.current.position.set(nozzleRef.current.position.x, -0.6, nozzleRef.current.position.z);
      nozzlePos.current.copy(nozzleRef.current.position);
    }
    // Flicker effect
    if (isCutting && lightRef.current) {
      lightRef.current.intensity = 10 + Math.random() * 10;
    } else if (lightRef.current) {
      lightRef.current.intensity = 0;
    }

    // Parallax Lembut Kamera (Top-Down)
    camera.position.x += (normalizedX * 0.3 + 0.5 - camera.position.x) * 0.05;
    camera.position.z += (normalizedY * 0.3 + 2.5 - camera.position.z) * 0.05;
    camera.lookAt(0.5, -1, 0);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight position={[5, 10, 5]} angle={Math.PI / 4} intensity={4} />
      <pointLight ref={lightRef} color="#FF6A00" intensity={0} distance={8} />

      <SteelPlate />
      <FPMark />
      <PlasmaNozzle ref={nozzleRef}>
         {isCutting && <PlasmaArc ref={arcRef} />}
      </PlasmaNozzle>
      <Sparks active={isCutting} origin={new THREE.Vector3(nozzlePos.current.x, -0.8, nozzlePos.current.z)} />
    </>
  );
}

export default function HeroScene({ scrollProxyRef }: { scrollProxyRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0B0B0A]">
      <Canvas camera={{ position: [0.5, 7, 2.5], fov: 45 }} gl={{ antialias: true }}>
        <SceneContent scrollProxyRef={scrollProxyRef} />
      </Canvas>
    </div>
  );
}