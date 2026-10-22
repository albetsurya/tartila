import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { TajwidFPSState } from "../hooks/use3DTajwidFPS";

const ARENA_SIZE = 60;

function Ground() {
  const mesh = useMemo(() => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(ARENA_SIZE, ARENA_SIZE),
      new THREE.MeshStandardMaterial({ color: "#1e2a36" })
    );
    m.rotation.x = -Math.PI / 2;
    return m;
  }, []);
  return <primitive object={mesh} />;
}

function Walls() {
  const wallHeight = 4;
  const thickness = 1;

  const meshes = useMemo(() => {
    const geometryA = new THREE.BoxGeometry(ARENA_SIZE, wallHeight, thickness);
    const geometryB = new THREE.BoxGeometry(thickness, wallHeight, ARENA_SIZE);
    const material = new THREE.MeshStandardMaterial({ color: 0x2f4048 });
    const positions: [number, number, number][] = [
      [0, wallHeight / 2, -ARENA_SIZE / 2 + thickness / 2],
      [0, wallHeight / 2, ARENA_SIZE / 2 - thickness / 2],
      [-ARENA_SIZE / 2 + thickness / 2, wallHeight / 2, 0],
      [ARENA_SIZE / 2 - thickness / 2, wallHeight / 2, 0],
    ];
    return positions.map(([x, y, z]) => {
      const m = new THREE.Mesh(geometryA, material);
      if (x !== 0) {
        m.geometry = geometryB;
      }
      m.position.set(x, y, z);
      return m;
    });
  }, []);

  return (
    <>
      {meshes.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
    </>
  );
}

function Mascot({ stateRef }: { stateRef: React.MutableRefObject<TajwidFPSState> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3498db",
        metalness: 0.1,
        roughness: 0.7,
      }),
    []
  );

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const { x, z } = stateRef.current.position;
    mesh.position.set(x, 0.7, z);
  });

  return (
    <mesh ref={meshRef} material={material} castShadow>
      <sphereGeometry args={[0.7, 16, 16]} />
    </mesh>
  );
}

function CardTargets({ stateRef }: { stateRef: React.MutableRefObject<TajwidFPSState> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    const group = groupRef.current;
    if (!group) return;
    const state = stateRef.current;

    camera.rotation.order = "YXZ";
    camera.rotation.y = state.rotation.yaw;
    camera.rotation.x = Math.max(
      -Math.PI / 3,
      Math.min(Math.PI / 3, state.rotation.pitch)
    );

    for (let i = 0; i < group.children.length; i += 1) {
      const child = group.children[i] as THREE.Mesh;
      child.rotation.y += 0.015;

      if (child.visible && child.position.distanceTo(camera.position) < 3) {
        child.visible = false;
        window.dispatchEvent(
          new CustomEvent("tajwid-card-collected", {
            detail: { index: i, score: state.score },
          })
        );
      }
    }
  });

  const cardPositions = useMemo(
    () =>
      Array.from({ length: 10 }).map(() => ({
        x: (Math.random() - 0.5) * (ARENA_SIZE - 4),
        y: 1.5,
        z: (Math.random() - 0.5) * (ARENA_SIZE - 4),
      })),
    []
  );

  return (
    <group ref={groupRef}>
      {cardPositions.map((p, i) => (
        <mesh
          key={i}
          position={[p.x, p.y, p.z]}
          material={
            new THREE.MeshBasicMaterial({
              color: i % 2 === 0 ? "#f1c40f" : "#9b59b6",
              transparent: true,
              opacity: 0.85,
            })
          }
        >
          <boxGeometry args={[1, 1.5, 0.1]} />
        </mesh>
      ))}
    </group>
  );
}

export default function TajwidFPS3DScene({ state }: { state: TajwidFPSState }) {
  const stateRef = useRef(state);
  stateRef.current = state;

  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{ position: [0, 1.6, 0], fov: 60 }}
      style={{ width: "100%", height: "100%", background: "#16213e" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 10, 4]} intensity={0.6} castShadow />
      <Ground />
      <Walls />
      <Mascot stateRef={stateRef} />
      <CardTargets stateRef={stateRef} />
    </Canvas>
  );
}
