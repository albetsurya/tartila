import { useCallback, useEffect, useRef, useState } from "react";

export type AyatHunterFPSPhase =
  | "idle"
  | "playing"
  | "paused"
  | "completed"
  | "gameover";

export type AyatHunterFPSCamera = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
};

export type AyatHunterFPSState = {
  phase: AyatHunterFPSPhase;
  health: number;
  position: { x: number; y: number; z: number };
  rotation: { yaw: number; pitch: number };
  camera: AyatHunterFPSCamera;
  score: number;
  lives: number;
  foundCount: number;
  totalTargets: number;
  combo: number;
  maxCombo: number;
  isSearching: boolean;
};

const INITIAL_HEALTH = 100;
const INITIAL_LIVES = 3;
const TOTAL_TARGETS = 10;
const CAMERA_DISTANCE = 5;
const PITCH_LIMIT = Math.PI / 3;

export function use3DAyatHunterFPS() {
  const [phase, setPhase] = useState<AyatHunterFPSPhase>("idle");
  const [health, setHealth] = useState(INITIAL_HEALTH);
  const [position, setPosition] = useState({ x: 0, y: 1.6, z: 0 });
  const [rotation, setRotation] = useState({ yaw: 0, pitch: 0 });
  const [camera, setCamera] = useState<AyatHunterFPSCamera>({
    x: -CAMERA_DISTANCE,
    y: 2.6,
    z: 0,
    yaw: 0,
    pitch: 0,
  });
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [foundCount, setFoundCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    lookHorizontal: 0,
    lookVertical: 0,
    search: false,
  });

  const searchRef = useRef<number>(0);

  const updateInput = useCallback((partial: Partial<typeof inputRef.current>) => {
    inputRef.current = { ...inputRef.current, ...partial };
  }, []);

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
          updateInput({ search: true });
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

  const handleSearch = useCallback(() => {
    if (isSearching) return;
    setIsSearching(true);
    searchRef.current = 0;
  }, [isSearching]);

  useEffect(() => {
    if (isSearching && searchRef.current < 100) {
      searchRef.current += 1;
      setTimeout(() => {
        // Simulate finding a target
        setFoundCount(prev => Math.min(prev + 1, TOTAL_TARGETS));
        setScore(prev => prev + 10);
        setCombo(prev => Math.min(prev + 1, 10));
        setMaxCombo(Math.max(maxCombo, combo + 1));
        setIsSearching(false);
      }, 500);
    }

    if (isSearching && searchRef.current >= 100) {
      setIsSearching(false);
      if (foundCount < TOTAL_TARGETS) {
        setLives(prev => Math.max(0, prev - 1));
        setCombo(0);
      }
      searchRef.current = 0;
    }
  }, [isSearching, foundCount, score, combo, maxCombo, lives]);

  useEffect(() => {
    if (health <= 0) setPhase("gameover");
    if (foundCount >= TOTAL_TARGETS) setPhase("completed");
  }, [health, foundCount]);

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
    setLives(INITIAL_LIVES);
    setFoundCount(0);
    setCombo(0);
    setMaxCombo(0);
    setIsSearching(false);
    updateInput({
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      lookHorizontal: 0,
      lookVertical: 0,
      search: false,
    });
  }, []);

  return {
    phase,
    health,
    position,
    rotation,
    camera,
    score,
    lives,
    foundCount,
    totalTargets: TOTAL_TARGETS,
    combo,
    maxCombo,
    isSearching,
    setPhase,
    setupInputListeners,
    updateInput,
    resetGame,
    handleSearch,
  };
}
