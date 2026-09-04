"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei"; // <- PENTING UNTUK REALISME
import * as THREE from "three";
import gsap from "gsap";
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
  const [isCutting, setIsCutting] = useState(false);
  
  // Posisi awal nozzle (Sedikit digeser agar enak dilihat dari sudut baru)
  const nozzlePos = useRef(new THREE.Vector3(1.5, 3, 1));

  const { normalizedX, normalizedY } = useMousePosition();

  useEffect(() => {
    if (!scrollProxyRef.current || !nozzleRef.current) return;
    nozzleRef.current.position.copy(nozzlePos.current);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollProxyRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    // 0% -> 20%: Nozzle Turun mendekati plat
    tl.to(nozzleRef.current.position, { y: 0.1, ease: "power2.in" }, 0); // 0.1 agar pas menyentuh
    tl.call(() => setIsCutting(true), undefined, 0.2);
    tl.call(() => setIsCutting(false), undefined, 0.19);

    // 20% -> 70%: Nozzle Bergerak Memotong (Membentuk garis)
    tl.to(nozzleRef.current.position, { x: -2, z: -1, ease: "power1.inOut" }, 0.2);
    tl.to(nozzleRef.current.position, { x: -3.5, z: 1.5, ease: "power1.inOut" }, 0.45);
  }, [scrollProxyRef]);

  useFrame(({ camera }) => {
    if (nozzleRef.current && lightRef.current) {
      // Posisi cahaya selalu mengikuti ujung nozzle
      lightRef.current.position.set(nozzleRef.current.position.x, -0.1, nozzleRef.current.position.z);
      nozzlePos.current.copy(nozzleRef.current.position);
    }

    if (isCutting && lightRef.current) {
      lightRef.current.intensity = 15 + Math.random() * 10; // Flicker lebih dramatis
    } else if (lightRef.current) {
      lightRef.current.intensity = 0;
    }

    // Parallax Kamera yang lebih subtle
    camera.position.x += (normalizedX * 0.4 + 3.5 - camera.position.x) * 0.05;
    camera.position.y += (normalizedY * 0.4 + 4 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0); // Fokus kamera selalu ke tengah meja
  });

  return (
    <>
      {/* Refleksi Ruangan (Membuat metal terlihat sangat realistis) */}
      <Environment preset="warehouse" environmentIntensity={0.6} />

      <ambientLight intensity={0.2} />
      
      {/* Lampu Sorot Studio dengan Bayangan */}
      <spotLight 
        position={[5, 10, 5]} 
        angle={Math.PI / 5} 
        penumbra={0.5} 
        intensity={5} 
        castShadow 
        shadow-bias={-0.0001}
      />
      
      {/* Lampu Plasma */}
      <pointLight ref={lightRef} color="#FF6A00" intensity={0} distance={10} />

      <SteelPlate />
      <FPMark />
      <PlasmaNozzle ref={nozzleRef}>
        {isCutting && <PlasmaArc ref={arcRef} />}
      </PlasmaNozzle>
      
      {/* Titik api sedikit dinaikkan agar tidak tembus lantai */}
      <Sparks active={isCutting} origin={new THREE.Vector3(nozzlePos.current.x, 0, nozzlePos.current.z)} />
    </>
  );
}

export default function HeroScene({ scrollProxyRef }: { scrollProxyRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0B0B0A]">
      {/* POV BARU: Lensa Macro (FOV 35), Posisi menyerong (Isometrik) */}
      {/* Mengaktifkan shadows pada Canvas */}
      <Canvas shadows camera={{ position: [3.5, 4, 4.5], fov: 35 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <Suspense fallback={null}>
          <SceneContent scrollProxyRef={scrollProxyRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}