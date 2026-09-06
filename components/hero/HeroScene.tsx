"use client";

import { useRef, Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { SteelPlate } from "./SteelPlate";
import { PlasmaNozzle } from "./PlasmaNozzle";
import { PlasmaArc } from "./PlasmaArc";
import { Sparks } from "./Sparks";
import { FPMark } from "./FPMark";
import { KerfTrail } from "./KerfTrail";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { sampleCutPath, type CutSample } from "@/lib/fpCutPath";

function SceneContent() {
  const nozzleRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const cutDistanceRef = useRef(0);
  const cuttingRef = useRef(false);
  const tangentRef = useRef(new THREE.Vector2(0, 1));
  const smoothed = useRef(new THREE.Vector3(0, 1.75, 0));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  const desiredLook = useRef(new THREE.Vector3(0, 0, 0));
  const mouse = useRef({ x: 0, y: 0 });
  const clock = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const initialSample = useMemo(() => sampleCutPath(0), []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (!nozzleRef.current) return;
    nozzleRef.current.position.set(initialSample.x, initialSample.y, initialSample.z);
    smoothed.current.copy(nozzleRef.current.position);
  }, [initialSample]);

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!prefersReducedMotion) clock.current += dt;

    const sample: CutSample = prefersReducedMotion
      ? { ...initialSample, cutting: false, progress: 1, cutDistance: initialSample.totalCutLength }
      : sampleCutPath(clock.current);

    cutDistanceRef.current = prefersReducedMotion ? sample.totalCutLength : sample.cutDistance;
    cuttingRef.current = sample.cutting;
    tangentRef.current.set(sample.tangentX, sample.tangentZ);

    const follow = prefersReducedMotion ? 1 : 1 - Math.exp(-14 * dt);
    smoothed.current.x += (sample.x - smoothed.current.x) * follow;
    smoothed.current.y += (sample.y - smoothed.current.y) * follow;
    smoothed.current.z += (sample.z - smoothed.current.z) * follow;

    if (nozzleRef.current) {
      nozzleRef.current.position.copy(smoothed.current);
    }

    if (lightRef.current) {
      lightRef.current.position.set(smoothed.current.x, -0.12, smoothed.current.z);
      const targetIntensity = sample.cutting ? 12 + Math.sin(clock.current * 48) * 3 : 0;
      const lightFollow = 1 - Math.exp(-14 * dt);
      lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * lightFollow;
    }

    const camX = mouse.current.x * 0.35 + 3.35;
    const camY = mouse.current.y * 0.28 + 3.85;
    const camZ = 4.35;
    camera.position.x += (camX - camera.position.x) * (1 - Math.exp(-3 * dt));
    camera.position.y += (camY - camera.position.y) * (1 - Math.exp(-3 * dt));
    camera.position.z += (camZ - camera.position.z) * (1 - Math.exp(-3 * dt));

    desiredLook.current.set(smoothed.current.x * 0.12, 0, smoothed.current.z * 0.12);
    lookTarget.current.lerp(desiredLook.current, 1 - Math.exp(-2.4 * dt));
    camera.lookAt(lookTarget.current);
  });

  return (
    <>
      <Environment preset="warehouse" environmentIntensity={0.55} />
      <ambientLight intensity={0.18} />
      <spotLight
        position={[5, 10, 5]}
        angle={Math.PI / 5}
        penumbra={0.5}
        intensity={5}
        castShadow
        shadow-bias={-0.0001}
      />

      <pointLight ref={lightRef} color="#FF6A00" intensity={0} distance={9} />

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
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0B0B0A]">
      <Canvas
        shadows
        camera={{ position: [3.35, 3.85, 4.35], fov: 35 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
