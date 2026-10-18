import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef, type MutableRefObject } from "react";
import type { RunnerState } from "@/features/ngaji-ceria/pages/games/harakat-rush/hooks/use3DRunnerGame";

const LANE_X = [-2.2, 0, 2.2];
const POOL_SIZE = 30;

const laneToX = (lane: 0 | 1 | 2) => LANE_X[lane];

const textureCache = new Map<string, THREE.CanvasTexture>();

function createSymbolTexture(
  symbol: string,
  color: string,
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, size, size);
  ctx.font = "bold 340px 'Noto Naskh Arabic', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = color;
  ctx.shadowBlur = 50;
  ctx.fillStyle = color;
  ctx.fillText(symbol, size / 2, size / 2);
  ctx.fillText(symbol, size / 2, size / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function getSymbolTexture(symbol: string, isCorrect: boolean) {
  const key = `${symbol}-${isCorrect}`;
  if (!textureCache.has(key)) {
    textureCache.set(
      key,
      createSymbolTexture(symbol, isCorrect ? "#FBBF24" : "#FF5E6C"),
    );
  }
  return textureCache.get(key)!;
}

function Targets({ stateRef }: { stateRef: MutableRefObject<RunnerState> }) {
  const groupRef = useRef<THREE.Group>(null);
  const pool = useRef<THREE.Mesh[]>([]);

  const planeGeo = useMemo(() => new THREE.PlaneGeometry(1.6, 1.6), []);

  useFrame(({ camera }) => {
    if (!groupRef.current) return;
    const targets = stateRef.current.targets;

    while (pool.current.length < POOL_SIZE) {
      const mesh = new THREE.Mesh(
        planeGeo,
        new THREE.MeshBasicMaterial({
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      groupRef.current.add(mesh);
      pool.current.push(mesh);
    }

    for (let i = 0; i < pool.current.length; i++) {
      const mesh = pool.current[i];
      const t = targets[i];

      if (!t) {
        mesh.visible = false;
        continue;
      }

      mesh.visible = true;
      mesh.position.set(laneToX(t.lane), 1.3, t.z);
      mesh.lookAt(camera.position);

      const tex = getSymbolTexture(t.symbol, t.isCorrect);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mat.map !== tex) {
        mat.map = tex;
        mat.needsUpdate = true;
      }
    }
  });

  return <group ref={groupRef} />;
}

function Ticker({ onFrame }: { onFrame: (d: number) => void }) {
  useFrame((_, delta) => {
    onFrame(Math.min(delta, 0.05));
  });
  return null;
}

function Road() {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -30]}
        receiveShadow
      >
        <planeGeometry args={[20, 200]} />
        <meshStandardMaterial color="#0B3B33" roughness={0.9} />
      </mesh>

      {LANE_X.map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, -30]}>
          <planeGeometry args={[1.8, 200]} />
          <meshStandardMaterial color="#134E4A" opacity={0.65} transparent />
        </mesh>
      ))}

      {[-1.1, 1.1].map((x, i) => (
        <group key={i}>
          {Array.from({ length: 40 }).map((_, k) => (
            <mesh
              key={k}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[x, 0.02, -k * 3 - 2]}
            >
              <planeGeometry args={[0.08, 1.2]} />
              <meshStandardMaterial color="#5EEAD4" opacity={0.4} transparent />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export function Harakat3DScene({
  stateRef,
  onFrame,
}: {
  stateRef: MutableRefObject<RunnerState>;
  onFrame: (delta: number) => void;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 4, 9], fov: 55, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#071A16"]} />
      <fog attach="fog" args={["#071A16", 25, 75]} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

      <Road />
      <Targets stateRef={stateRef} />

      <Ticker onFrame={onFrame} />
    </Canvas>
  );
}
