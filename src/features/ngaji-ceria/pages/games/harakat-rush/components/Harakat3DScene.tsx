import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RunnerState } from "../hooks/use3DRunnerGame";

const LANE_X = [-2.2, 0, 2.2];

const HARAKAT_COLOR = "#FBBF24"; // benar
const WRONG_COLOR = "#FF5E6C";

function createSymbolTexture(symbol: string, color: string): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.font = "bold 340px 'Noto Naskh Arabic', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(symbol, size / 2, size / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const textureCache = new Map<string, THREE.CanvasTexture>();
function getSymbolTexture(symbol: string, isCorrect: boolean) {
  const key = `${symbol}-${isCorrect}`;
  if (!textureCache.has(key)) {
    textureCache.set(key, createSymbolTexture(symbol, isCorrect ? HARAKAT_COLOR : WRONG_COLOR));
  }
  return textureCache.get(key)!;
}

function Ground() {
  const mesh = useMemo(() => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: "#2C3E50" })
    );
    m.rotation.x = -Math.PI / 2;
    return m;
  }, []);
  return <primitive object={mesh} />;
}

function Mascot({ stateRef }: { stateRef: React.MutableRefObject<RunnerState> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#FF6B6B",
        metalness: 0.1,
        roughness: 0.8,
      }),
    []
  );

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.position.set(LANE_X[stateRef.current.lane] ?? 0, 0.6, 0);
    const jumpProgress = stateRef.current.jumpProgress ?? 0;
    if (jumpProgress > 0) {
      mesh.position.y = 0.6 + Math.sin(jumpProgress * Math.PI) * 1.4;
    }
  });

  return (
    <mesh ref={meshRef} material={material} castShadow>
      <sphereGeometry args={[0.6, 16, 16]} />
    </mesh>
  );
}

function Targets({ stateRef }: { stateRef: React.MutableRefObject<RunnerState> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const targets = stateRef.current.targets ?? [];

    targets.forEach((target, idx) => {
      const child = group.children[idx];
      if (!child) return;

      child.visible = !target.hit;
      if (target.hit) return;

      child.position.set(LANE_X[target.lane] ?? 0, 1.4, -target.z);
      child.rotation.y = Math.PI / 2;

      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      const tex = getSymbolTexture(target.symbol, target.isCorrect);
      if (material.map !== tex) {
        material.map = tex;
        material.needsUpdate = true;
      }

      const distanceToPlayer = Math.hypot(child.position.x, child.position.z - stateRef.current.lane * 0);
      if (distanceToPlayer < 3) {
        child.visible = false;
        window.dispatchEvent(
          new CustomEvent("harakat-hit", {
            detail: { symbol: target.symbol, lane: target.lane, correct: target.isCorrect },
          })
        );
      }
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} visible={false} material={new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false })}>
          <planeGeometry args={[1.6, 1.6]} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({ stateRef }: { stateRef: React.MutableRefObject<RunnerState> }) {
  useFrame(({ camera }) => {
    camera.position.x = LANE_X[stateRef.current.lane] ?? 0;
    camera.position.y = 2;
    camera.lookAt(LANE_X[stateRef.current.lane] ?? 0, 1.4, -6);
  });
  return null;
}

export default function Harakat3DScene({ state }: { state: RunnerState }) {
  const stateRef = useRef(state);
  stateRef.current = state;

  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{ position: [0, 2, 8], fov: 60 }}
      style={{ width: "100%", height: "100%", background: "#1a1a2e" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 4]} intensity={0.6} castShadow />
      <Ground />
      <Targets stateRef={stateRef} />
      <Mascot stateRef={stateRef} />
      <CameraRig stateRef={stateRef} />
    </Canvas>
  );
}
