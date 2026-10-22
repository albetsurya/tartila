import { useCallback, useEffect, useRef, useState } from "react";

export type FPSPhase =
  | "idle"
  | "playing"
  | "paused"
  | "completed"
  | "gameover";

export type FPSCamera = {
  x: number;
  y: number;
  z: number;
  yaw: number; // horizontal rotation in radians
  pitch: number; // vertical rotation in radians (limited to avoid flipping)
};

export type FPSState = {
  phase: FPSPhase;
  health: number; // 0-100
  position: { x: number; y: number; z: number };
  rotation: { yaw: number; pitch: number };
  camera: FPSCamera;
  score: number;
  maxHealth: number;
  isJumping: boolean;
  jumpProgress: number;
};

export type FPSControls = {
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  lookHorizontal: number; // -1 to 1
  lookVertical: number; // -1 to 1
  jump: boolean;
  shoot: boolean;
};

const INITIAL_HEALTH = 100;
const INITIAL_POSITION = { x: 0, y: 1.6, z: 0 };
const CAMERA_DISTANCE = 5; // jarak kamera di belakang player
const PITCH_LIMIT = Math.PI / 3; // 60 degree limit

export function use3DFPSGame() {
  const [phase, setPhase] = useState<FPSPhase>("idle");
  const [health, setHealth] = useState(INITIAL_HEALTH);
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [rotation, setRotation] = useState({ yaw: 0, pitch: 0 });
  const [camera, setCamera] = useState<FPSCamera>({
    x: INITIAL_POSITION.x - CAMERA_DISTANCE,
    y: INITIAL_POSITION.y + 1,
    z: INITIAL_POSITION.z,
    yaw: 0,
    pitch: 0,
  });
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpProgress, setJumpProgress] = useState(0);

  // ✅ REFS UNTUK INPUT & ANIMASI
  const inputRef = useRef<FPSControls>({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    lookHorizontal: 0,
    lookVertical: 0,
    jump: false,
    shoot: false,
  });

  const jumpRef = useRef<number>(0);

  // ✅ UPDATE INPUT STATE
  const updateInput = useCallback(
    (partial: Partial<FPSControls>) => {
      inputRef.current = { ...inputRef.current, ...partial };
    },
    []
  );

  // ✅ KEYBOARD/MOUSE HANDLER
  const setupInputListeners = useCallback(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "playing") return;

      switch (e.key) {
        case "ArrowUp":
        case "W":
          updateInput({ moveForward: true });
          break;
        case "ArrowDown":
        case "S":
          updateInput({ moveBackward: true });
          break;
        case "ArrowLeft":
        case "A":
          updateInput({ moveLeft: true });
          break;
        case "ArrowRight":
        case "D":
          updateInput({ moveRight: true });
          break;
        case " ":
          updateInput({ jump: true });
          break;
        case "ShiftLeft":
        case "Enter":
          updateInput({ shoot: true });
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "W":
          updateInput({ moveForward: false });
          break;
        case "ArrowDown":
        case "S":
          updateInput({ moveBackward: false });
          break;
        case "ArrowLeft":
        case "A":
          updateInput({ moveLeft: false });
          break;
        case "ArrowRight":
        case "D":
          updateInput({ moveRight: false });
          break;
        case " ":
          updateInput({ jump: false });
          break;
        case "ShiftLeft":
        case "Enter":
          updateInput({ shoot: false });
          break;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (phase !== "playing") return;
      updateInput({
        lookHorizontal: e.movementX,
        lookVertical: e.movementY,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (phase !== "playing") return;
      // Touch drag untuk nihat
      const touch = e.touches[0];
      updateInput({
        lookHorizontal: touch.clientX,
        lookVertical: touch.clientY,
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [phase]);

  // ✅ JUMP MECHANIC
  const handleJump = useCallback(() => {
    if (isJumping) return;
    setIsJumping(true);
    jumpRef.current = 0;
  }, [isJumping]);

  useEffect(() => {
    if (isJumping && jumpRef.current < 100) {
      jumpRef.current += 1;
      setJumpProgress(prev => prev + 0.1);
    }

    if (isJumping && jumpRef.current >= 100) {
      setIsJumping(false);
      setJumpProgress(0);
      // Kembali ke posisii ground
      setPosition(prev => ({
        ...prev,
        y: INITIAL_POSITION.y,
      }));
      jumpRef.current = 0;
    }
  }, [isJumping]);

  // ✅ GAME LOOP UPDATE
  useEffect(() => {
    if (phase !== "playing") return;

    const interval = setInterval(() => {
      // Update posisi berdasarkan input
      const speed = 0.1;
      const { moveForward, moveBackward, moveLeft, moveRight } = inputRef.current;

      // Hitung arah baru berdasarkan rotasi saat ini
      const yaw = rotation.yaw;

      // Forward/Backward
      const forwardX = Math.sin(yaw) * (moveForward ? speed : 0);
      const forwardZ = Math.cos(yaw) * (moveForward ? speed : 0);
      const backwardX = -Math.sin(yaw) * (moveBackward ? speed : 0);
      const backwardZ = -Math.cos(yaw) * (moveBackward ? speed : 0);

      // Left/Right (strafe)
      const leftX = Math.cos(yaw) * (moveLeft ? speed : 0);
      const leftZ = -Math.sin(yaw) * (moveLeft ? speed : 0);
      const rightX = -Math.cos(yaw) * (moveRight ? speed : 0);
      const rightZ = Math.sin(yaw) * (moveRight ? speed : 0);

      // Update posisi
      setPosition(prev => ({
        ...prev,
        x: prev.x + forwardX + leftX + rightX,
        z: prev.z + forwardZ + backwardZ + leftZ,
      }));

      // Update rotasi berdasarkan mouse look
      const { lookHorizontal, lookVertical } = inputRef.current;
      setRotation(prev => {
        let newYaw = prev.yaw + lookHorizontal * 0.01;
        let newPitch = prev.pitch - lookVertical * 0.01;

        // Limit pitch supaya tidak flip
        newPitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, newPitch));

        return { yaw: newYaw, pitch: newPitch };
      });

      // Update posisi kamera di belakang player
      setCamera(prev => ({
        ...prev,
        x: position.x - CAMERA_DISTANCE * Math.sin(prev.yaw),
        y: position.y + 2,
        z: position.z - CAMERA_DISTANCE * Math.cos(prev.yaw),
      }));

      // Jump physics
      if (isJumping) {
        setJumpProgress(prev => prev + 0.1);
        // Sederhana: naik lalu turun
        if (jumpRef.current >= 50) {
          setPosition(prev => ({
            ...prev,
            y: Math.max(INITIAL_POSITION.y, INITIAL_POSITION.y - (50 - jumpRef.current) * 0.03),
          }));
        }
      }

      // Kurangi health sekejika saat bertahan waktu (optional)
      // setHealth(prev => Math.max(0, prev - 0.01));

      jumpRef.current += 1;
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [phase, isJumping, position, rotation, camera]);

  // ✅ SHOOT MECHANIC
  const handleShoot = useCallback(() => {
    if (phase !== "playing") return;
    // Logika shoot: hit target, kurangi health musuh, dll
    setScore(prev => prev + 10);
    // Kurangi health musuh atau trigger effect
  }, []);

  useEffect(() => {
    let shootInterval: ReturnType<typeof setInterval>;
    if (inputRef.current.shoot) {
      shootInterval = setInterval(() => {
        handleShoot();
      }, 200); // shoot setiap 200ms (rate of fire)
    }
    return () => clearInterval(shootInterval);
  }, [inputRef.current.shoot, handleShoot]);

  // ✅ GAME OVER CHECK
  useEffect(() => {
    if (health <= 0) {
      setPhase("gameover");
    }
  }, [health]);

  // ✅ RESET GAME
  const resetGame = useCallback(() => {
    setPhase("idle");
    setHealth(INITIAL_HEALTH);
    setPosition(INITIAL_POSITION);
    setRotation({ yaw: 0, pitch: 0 });
    setCamera({
      x: INITIAL_POSITION.x - CAMERA_DISTANCE,
      y: INITIAL_POSITION.y + 1,
      z: INITIAL_POSITION.z,
      yaw: 0,
      pitch: 0,
    });
    setScore(0);
    setIsJumping(false);
    setJumpProgress(0);
    updateInput({
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      lookHorizontal: 0,
      lookVertical: 0,
      jump: false,
      shoot: false,
    });
  }, []);

  return {
    // State
    phase,
    health,
    position,
    rotation,
    camera,
    score,
    isJumping,
    jumpProgress,
    // Actions
    setPhase,
    updateInput,
    resetGame,
    handleJump,
    handleShoot,
    setScore,
    // Utils
    FIRST_TARGET: 1, // placeholder
  };
}
