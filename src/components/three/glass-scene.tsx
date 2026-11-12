"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import { colorBendsVertex, colorBendsFragment } from "./color-bends-shader";
import tokens from "@/styles/tokens.json";
function FrameScheduler({
  active,
  compact,
}: {
  active: boolean;
  compact: boolean;
}) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return;
    invalidate();
    const timer = setInterval(invalidate, 1000 / (compact ? 20 : 30));
    return () => clearInterval(timer);
  }, [active, compact, invalidate]);
  return null;
}
function BrandLights({
  moving,
  compact,
}: {
  moving: boolean;
  compact: boolean;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size, gl } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 5 },
      uCanvas: { value: new THREE.Vector2(1, 1) },
      uSpeed: { value: 0.12 },
      uRot: { value: new THREE.Vector2(Math.cos(0.5), Math.sin(0.5)) },
      uColorCount: { value: 2 },
      uColors: {
        value: [
          tokens.primitive.electric,
          tokens.primitive.violet,
          ...Array(6).fill("#000000"),
        ].map(
          (hex) =>
            new THREE.Vector3(
              parseInt(hex.slice(1, 3), 16) / 255,
              parseInt(hex.slice(3, 5), 16) / 255,
              parseInt(hex.slice(5, 7), 16) / 255,
            ),
        ),
      },
      uInk: { value: new THREE.Vector3(16 / 255, 17 / 255, 26 / 255) },
      uTransparent: { value: 0 },
      uScale: { value: 1.2 },
      uFrequency: { value: 1.1 },
      uWarpStrength: { value: 0.75 },
      uPointer: { value: new THREE.Vector2() },
      uMouseInfluence: { value: 0 },
      uParallax: { value: 0 },
      uNoise: { value: 0 },
      uIterations: { value: compact ? 1 : 2 },
      uIntensity: { value: 1.05 },
      uBandWidth: { value: 5 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );
  useFrame((_, delta) => {
    if (material.current) {
      if (moving) uniforms.uTime.value += Math.min(delta, 0.05);
      uniforms.uIterations.value = compact ? 1 : 2;
      uniforms.uCanvas.value.set(size.width, size.height);
      uniforms.uResolution.value.set(
        size.width * gl.getPixelRatio(),
        size.height * gl.getPixelRatio(),
      );
    }
  });
  return (
    <mesh
      onBeforeRender={(renderer) => {
        const target = renderer.getRenderTarget();
        uniforms.uResolution.value.set(
          target?.width || size.width * renderer.getPixelRatio(),
          target?.height || size.height * renderer.getPixelRatio(),
        );
      }}
      position={[0, 0, -2.4]}
      scale={[viewport.width * 1.45, viewport.height * 1.45, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={colorBendsVertex}
        fragmentShader={colorBendsFragment}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}
function GlassLogo({
  moving,
  compact,
  onReady,
}: {
  moving: boolean;
  compact: boolean;
  onReady: () => void;
}) {
  const gltf = useGLTF("/models/untold-glass.glb");
  const group = useRef<THREE.Group>(null);
  const clock = useRef(0);
  const light = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();
  const targetPointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!moving || compact) return;
    const move = (event: PointerEvent) => {
      targetPointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: 1 - (event.clientY / window.innerHeight) * 2,
      };
    };
    const reset = () => {
      targetPointer.current = { x: 0, y: 0 };
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [moving, compact]);
  const meshes = useMemo(() => {
    const items: THREE.Mesh[] = [];
    gltf.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) items.push(obj);
    });
    return items;
  }, [gltf.scene]);
  const renderedFrames = useRef(0);
  useFrame((state, delta) => {
    if (!group.current) return;
    if (renderedFrames.current++ === 3) onReady();
    const d = Math.min(delta, 0.05);
    if (moving) clock.current += d;
    const t = clock.current;
    const pointer = moving && !compact ? targetPointer.current : { x: 0, y: 0 };
    const scroll = moving
      ? Math.min(window.scrollY / window.innerHeight, 1)
      : 0;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      -0.24 + pointer.x * 0.1 + Math.sin(t * 0.23) * 0.035,
      3,
      d,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      0.1 - pointer.y * 0.065,
      3,
      d,
    );
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      -0.055 + Math.sin(t * 0.18) * 0.018,
      3,
      d,
    );
    group.current.position.y = Math.sin(t * 0.5) * 0.065 + scroll * 0.1;
    const fitScale = Math.min(
      (viewport.width * 0.7) / 3.23,
      (viewport.height * 0.68) / 3.17,
    );
    group.current.scale.setScalar(fitScale * (1 - scroll * 0.055));
    if (light.current) {
      light.current.position.x = THREE.MathUtils.damp(
        light.current.position.x,
        pointer.x * 3,
        4,
        d,
      );
      light.current.position.y = THREE.MathUtils.damp(
        light.current.position.y,
        pointer.y * 2,
        4,
        d,
      );
      light.current.color.setHSL(0.64 + pointer.x * 0.1, 0.65, 0.76);
    }
  });
  return (
    <group ref={group} dispose={null}>
      <pointLight
        ref={light}
        position={[0, 1, 3]}
        intensity={18}
        distance={12}
        decay={2}
      />
      {meshes.map((mesh) => (
        <mesh
          key={mesh.uuid}
          geometry={mesh.geometry}
          position={mesh.position}
          rotation={mesh.rotation}
          scale={mesh.scale}
        >
          <MeshTransmissionMaterial
            transmission={1}
            thickness={0.62}
            roughness={0.12}
            ior={1.46}
            chromaticAberration={0.025}
            anisotropicBlur={0.12}
            distortion={0.07}
            distortionScale={0.16}
            temporalDistortion={0}
            samples={compact ? 2 : 5}
            resolution={compact ? 192 : 512}
            color={mesh.name.includes("Fold") ? "#b8a8ed" : "#e3ebff"}
            envMapIntensity={1.7}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>
      ))}
    </group>
  );
}
export default function GlassScene({
  active,
  moving,
  compact,
  onReady,
  onFailure,
}: {
  active: boolean;
  moving: boolean;
  compact: boolean;
  onReady: () => void;
  onFailure: () => void;
}) {
  return (
    <Canvas
      frameloop={active ? "demand" : "never"}
      dpr={[1, compact ? 1 : 1.5]}
      camera={{ position: [0, 0, 8.7], fov: 32 }}
      gl={{ antialias: !compact, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onFailure, {
          once: true,
        });
      }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <FrameScheduler active={active} compact={compact} />
      <color attach="background" args={["#10111A"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[-3, 4, 5]} intensity={3} color="#dce8ff" />
      <BrandLights moving={moving} compact={compact} />
      <Suspense fallback={null}>
        <Environment resolution={compact ? 64 : 128} frames={1}>
          <Lightformer
            intensity={0.35}
            position={[0, 0, 5]}
            scale={[8, 8, 1]}
            color="#e5ecff"
          />
          <Lightformer
            intensity={15}
            position={[-3, 2, 3]}
            scale={[1, 6, 1]}
            color="#dce7ff"
          />
          <Lightformer
            intensity={9}
            position={[3, 1, 2]}
            scale={[0.5, 5, 1]}
            color="#8B5CF6"
          />
          <Lightformer
            intensity={4}
            position={[0, 4, 2]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[6, 2, 1]}
          />
          <Lightformer
            intensity={2}
            position={[-1, -3, 3]}
            scale={[5, 0.3, 1]}
            color="#2563FF"
          />
        </Environment>
        <GlassLogo moving={moving} compact={compact} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
