import { useCallback, useEffect, useRef, useState } from "react";

export type TajwidFPSPhase =
  | "idle"
  | "playing"
  | "paused"
  | "levelcomplete"
  | "gameover";

export type TajwidFPSCamera = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
};

export type TajwidFPSState = {
  phase: TajwidFPSPhase;
  health: number;
  position: { x: number; y: number; z: number };
  rotation: { yaw: number; pitch: number };
  camera: TajwidFPSCamera;
  score: number;
  levelId: number;
  currentCard: string | null;
  combo: number;
  maxCombo: number;
  isJumping: boolean;
  jumpProgress: number;
};

const INITIAL_HEALTH = 100;
const CAMERA_DISTANCE = 5;
const PITCH_LIMIT = Math.PI / 3;

export function use3DTajwidFPS() {
  const [phase, setPhase] = useState<TajwidFPSPhase>("idle");
  const [health, setHealth] = useState(INITIAL_HEALTH);
  const [position, setPosition] = useState({ x: 0, y: 1.6, z: 0 });
  const [rotation, setRotation] = useState({ yaw: 0, pitch: 0 });
  const [camera, setCamera] = useState<TajwidFPSCamera>({
    x: -CAMERA_DISTANCE,
    y: 2.6,
    z: 0,
    yaw: 0,
    pitch: 0,
  });
  const [score, setScore] = useState(0);
  const [levelId, setLevelId] = useState(1);
  const [currentCard, setCurrentCard] = useState<string | null>(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpProgress, setJumpProgress] = useState(0);

  const inputRef = useRef({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    lookHorizontal: 0,
    lookVertical: 0,
    jump: false,
    select: false,
  });

  const jumpRef = useRef<number>(0);

  // Update input
  const updateInput = useCallback((partial: Partial<typeof inputRef.current>) => {
    inputRef.current = { ...inputRef.current, ...partial };
  }, []);

  // Setup listeners
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
        case "Enter":
          updateInput({ select: true });
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
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (phase !== "playing") return;
      updateInput({
        lookHorizontal: e.movementX,
        lookVertical: e.movementY,
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [phase]);

  // Jump mechanic
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
      setPosition(prev => ({ ...prev, y: 1.6 }));
      jumpRef.current = 0;
    }
  }, [isJumping]);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;
    
    const interval = setInterval(() => {
      const speed = 0.08;
      const { moveForward, moveBackward, moveLeft, moveRight } = inputRef.current;
      const yaw = rotation.yaw;

      // Calculate movement based on yaw
      const forwardX = Math.sin(yaw) * speed * (moveForward ? 1 : 0);
      const forwardZ = Math.cos(yaw) * speed * (moveForward ? 1 : 0);
      const backwardX = -Math.sin(yaw) * speed * (moveBackward ? 1 : 0);
      const backwardZ = -Math.cos(yaw) * speed * (moveBackward ? 1 : 0);
      const leftX = Math.cos(yaw) * speed * (moveLeft ? 1 : 0);
      const leftZ = -Math.sin(yaw) * speed * (moveLeft ? 1 : 0);
      const rightX = -Math.cos(yaw) * speed * (moveRight ? 1 : 0);
      const rightZ = Math.sin(yaw) * speed * (moveRight ? 1 : 0);

      setPosition(prev => ({
        ...prev,
        x: prev.x + forwardX + backwardX + leftX + rightX,
        z: prev.z + forwardZ + backwardZ + leftZ + rightZ,
      }));

      // Update rotasi
      const { lookHorizontal, lookVertical } = inputRef.current;
      setRotation(prev => {
        const newYaw = (prev.yaw + lookHorizontal * 0.01) % (Math.PI * 2);
        const newPitch = Math.max(
          -PITCH_LIMIT,
          Math.min(PITCH_LIMIT, prev.pitch - lookVertical * 0.01)
        );
        return { yaw: newYaw, pitch: newPitch };
      });

      // Update kamera
      setCamera(prev => ({
        ...prev,
        x: position.x - CAMERA_DISTANCE * Math.sin(prev.yaw),
        y: position.y + 2,
        z: position.z - CAMERA_DISTANCE * Math.cos(prev.yaw),
      }));

      // Jump physics
      if (isJumping) {
        setJumpProgress(prev => prev + 0.1);
        if (jumpRef.current >= 50) {
          setPosition(prev => ({ ...prev, y: Math.max(1.6, 1.6 - (50 - jumpRef.current) * 0.02) }));
        }
      }
      jumpRef.current += 1;
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [phase, isJumping, position, rotation, camera]);

  // Handle select (pilih kartu)
  const handleSelect = useCallback(() => {
    if (phase !== "playing") return;
    // Logika select kartu - bisa show detail card, next level, dll
    setScore(prev => prev + 5);
    setCombo(prev => Math.min(prev + 1, 10));
    setMaxCombo(Math.max(maxCombo, combo + 1));
  }, [combo, maxCombo]);

  useEffect(() => {
    let selectInterval: ReturnType<typeof setInterval>;
    if (inputRef.current.select) {
      selectInterval = setInterval(() => {
        handleSelect();
      }, 300);
    }
    return () => clearInterval(selectInterval);
  }, [inputRef.current.select, handleSelect]);

  // Game over check
  useEffect(() => {
    if (health <= 0) setPhase("gameover");
  }, [health]);

  // Progress tracking (sederhana)
  const progress = score * 10;

  // Level progression
  useEffect(() => {
    if (progress > 300 && levelId < 5) {
      setLevelId(prev => prev + 1);
      setCurrentCard(`Kartu Tajwid Level ${levelId + 1}`);
    }
  }, [progress, levelId]);

  // Reset game
  const resetGame = useCallback(() => {
    setPhase("idle");
    setHealth(INITIAL_HEALTH);
    setPosition({ x: 0, y: 1.6, z: 0 });
    setRotation({ yaw: 0, pitch: 0 });
    setCamera({
      x: -CAMERA_DISTANCE,
      y: 2.6,
      z: 0,
      yaw: 0,
      pitch: 0,
    });
    setScore(0);
    setLevelId(1);
    setCurrentCard(null);
    setCombo(0);
    setMaxCombo(0);
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
      select: false,
    });
  }, []);

  return {
    phase,
    health,
    position,
    rotation,
    camera,
    score,
    levelId,
    currentCard,
    combo,
    maxCombo,
    isJumping,
    jumpProgress,
    setPhase,
    setScore,
    updateInput,
    resetGame,
    handleJump,
    handleSelect,
    progress,
  };
}
