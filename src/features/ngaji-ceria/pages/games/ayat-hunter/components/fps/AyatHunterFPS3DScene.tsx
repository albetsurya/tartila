import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SEARCH_AREA = 10;

function CameraRig({ stateRef }: { stateRef: { current: any } }) {
  useFrame(({ camera }) => {
    const rotation = stateRef.current?.rotation;
    if (!rotation) return;
    camera.rotation.order = "YXZ";
    camera.rotation.y = rotation.yaw;
    camera.rotation.x = Math.max(
      -Math.PI / 3,
      Math.min(Math.PI / 3, rotation.pitch)
    );
  });
  return null;
}

export default function AyatHunterFPS3DScene({ state }: { state?: any }) {
  const stateRef = useRef(state ?? { rotation: { yaw: 0, pitch: 0 } });
  stateRef.current = state;
  const gridHelper = useMemoGrid();

  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{ position: [0, 2, 8], fov: 60 }}
      style={{ width: "100%", height: "100%", background: "#1a1a2e" }}
    >
      <CameraRig stateRef={stateRef} />
      <primitive object={gridHelper} />
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
    </Canvas>
  );
}

function useMemoGrid() {
  const grid = new THREE.GridHelper(SEARCH_AREA, 10);
  grid.position.y = -0.1;
  return grid;
}
