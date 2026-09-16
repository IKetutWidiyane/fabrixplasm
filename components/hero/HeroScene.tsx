"use client";

import { useRef, Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SteelPlate } from "./SteelPlate";
import { PlasmaNozzle } from "./PlasmaNozzle";
import { PlasmaArc } from "./PlasmaArc";
import { Sparks } from "./Sparks";
import { FPMark } from "./FPMark";
import { KerfTrail } from "./KerfTrail";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { sampleCutProgress, type CutSample } from "@/lib/fpCutPath";

gsap.registerPlugin(ScrollTrigger);

function SceneContent({ scrollProxyRef }: { scrollProxyRef: React.RefObject<HTMLDivElement | null> }) {
  const nozzleRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const cutDistanceRef = useRef(0);
  const cuttingRef = useRef(false);
  const tangentRef = useRef(new THREE.Vector2(0, 1));
  const smoothed = useRef(new THREE.Vector3(0, 1.05, 0));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  const desiredLook = useRef(new THREE.Vector3(0, 0, 0));
  const mouse = useRef({ x: 0, y: 0 });
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const clock = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const initialSample = useMemo(() => sampleCutProgress(0), []);

  useEffect(() => {
    if (!scrollProxyRef.current) return;
    const st = ScrollTrigger.create({
      trigger: scrollProxyRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        targetProgressRef.current = self.progress;
      },
    });
    return () => st.kill();
  }, [scrollProxyRef]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (!nozzleRef.current) return;
    nozzleRef.current.position.set(initialSample.x, initialSample.y, initialSample.z);
    smoothed.current.copy(nozzleRef.current.position);
  }, [initialSample]);

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);
    clock.current += dt;

    const target = prefersReducedMotion ? 1 : targetProgressRef.current;
    progressRef.current += (target - progressRef.current) * (1 - Math.exp(-6 * dt));

    const sample: CutSample = prefersReducedMotion
      ? sampleCutProgress(1)
      : sampleCutProgress(progressRef.current);

    cutDistanceRef.current = sample.cutDistance;
    cuttingRef.current = sample.cutting;
    tangentRef.current.set(sample.tangentX, sample.tangentZ);

    const follow = 1 - Math.exp(-14 * dt);
    smoothed.current.x += (sample.x - smoothed.current.x) * follow;
    smoothed.current.y += (sample.y - smoothed.current.y) * follow;
    smoothed.current.z += (sample.z - smoothed.current.z) * follow;

    if (nozzleRef.current) {
      nozzleRef.current.position.copy(smoothed.current);
    }

    if (lightRef.current) {
      lightRef.current.position.set(smoothed.current.x, 0.05, smoothed.current.z);
      // Intensitas dinaikkan & ditambah flickering acak khas pemotong plasma
      const flicker = (Math.random() - 0.5) * 4;
      const targetIntensity = sample.cutting ? 25 + Math.sin(clock.current * 60) * 6 + flicker : 0;
      const lightFollow = 1 - Math.exp(-18 * dt);
      lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * lightFollow;
    }

    const focus = Math.min(sample.progress, 1);
    // Kamera diperendah (Y disesuaikan) agar sudut pandang lebih sinematik
    const camX = mouse.current.x * 0.35 + 3.1 - focus * 0.35;
    const camY = mouse.current.y * 0.2 + 2.8 - focus * 0.15;
    const camZ = 3.8 - focus * 0.25;
    camera.position.x += (camX - camera.position.x) * (1 - Math.exp(-3 * dt));
    camera.position.y += (camY - camera.position.y) * (1 - Math.exp(-3 * dt));
    camera.position.z += (camZ - camera.position.z) * (1 - Math.exp(-3 * dt));

    desiredLook.current.set(
      smoothed.current.x * (0.15 + focus * 0.12),
      0,
      smoothed.current.z * (0.15 + focus * 0.12),
    );
    lookTarget.current.lerp(desiredLook.current, 1 - Math.exp(-2.4 * dt));
    camera.lookAt(lookTarget.current);
  });

  return (
    <>
      {/* Gelapkan lingkungan HDRI agar kontras dengan api plasma */}
      <Environment files="/hdri/empty_warehouse_01_1k.hdr" environmentIntensity={0.25} />
      
      {/* Ambient redup untuk suasana dark mode */}
      <ambientLight intensity={0.08} />
      
      {/* Key light dengan warna agak kebiruan khas lampu bengkel industri */}
      <spotLight
        position={[6, 12, 6]}
        angle={Math.PI / 6}
        penumbra={0.8}
        intensity={3.5}
        color="#D6E4FF"
        castShadow
        shadow-bias={-0.0001}
      />

      {/* PointLight plasma oranye di titik pemotongan */}
      <pointLight ref={lightRef} color="#FF5500" intensity={0} distance={7} decay={2} />

      <SteelPlate>
        <FPMark progressRef={cutDistanceRef} />
        <KerfTrail cutDistanceRef={cutDistanceRef} />
      </SteelPlate>

      <PlasmaNozzle ref={nozzleRef}>
        <PlasmaArc cuttingRef={cuttingRef} />
      </PlasmaNozzle>

      <Sparks
        nozzleRef={nozzleRef}
        cuttingRef={cuttingRef}
        tangentRef={tangentRef}
      />

      {/* --- EFEK KUNCI KINEMATIK: BLOOM & VIGNETTE --- */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.45} // Hanya warna terang (api/plasma) yang berpijar
          luminanceSmoothing={0.8}
          intensity={1.8}          // Kekuatan pijar api
          mipmapBlur
        />
        <Vignette offset={0.2} darkness={0.8} /> {/* Membingkai pinggiran layar jadi gelap */}
      </EffectComposer>
    </>
  );
}

export default function HeroScene({ scrollProxyRef }: { scrollProxyRef: React.RefObject<HTMLDivElement | null> }) {
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    if (!scrollProxyRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: scrollProxyRef.current,
      start: "top top",
      end: "bottom top",
      onEnter: () => setIsInView(true),
      onLeave: () => setIsInView(false),
      onEnterBack: () => setIsInView(true),
      onLeaveBack: () => setIsInView(false),
    });

    return () => trigger.kill();
  }, [scrollProxyRef]);

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none bg-[#070707]"
      style={{ visibility: isInView ? "visible" : "hidden" }}
    >
      <Canvas
        frameloop={isInView ? "always" : "never"}
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [3.1, 2.8, 3.8], fov: 38 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: "high-performance",
          stencil: false,
        }}
      >
        <Suspense fallback={null}>
          <SceneContent scrollProxyRef={scrollProxyRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}