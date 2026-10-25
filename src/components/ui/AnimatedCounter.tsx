// src/components/ui/AnimatedCounter.tsx
import { useEffect, useRef } from "react";
import { animate, useMotionValue } from "framer-motion";

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  formatFn?: (n: number) => string;
}

export function AnimatedCounter({
  value,
  duration = 0.8,
  className = "",
  formatFn,
}: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: "easeOut",
      onUpdate(latest) {
        if (nodeRef.current) {
          const rounded = Math.round(latest);
          nodeRef.current.textContent = formatFn
            ? formatFn(rounded)
            : rounded.toLocaleString("id-ID");
        }
      },
    });

    return () => controls.stop();
  }, [value, duration, formatFn, count]);

  return (
    <span ref={nodeRef} className={className}>
      {formatFn ? formatFn(value) : value.toLocaleString("id-ID")}
    </span>
  );
}
