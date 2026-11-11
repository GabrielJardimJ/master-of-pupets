"use client";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
// Adapted from Motion Primitives / Magnetic (source and license in docs/animation-sources.md).
import { motion, useMotionValue, useSpring } from "motion/react";
import type { ReactNode, PointerEvent } from "react";
export function Magnetic({
  children,
  intensity = 0.18,
  className = "",
}: {
  children: ReactNode;
  intensity?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 20, mass: 0.4 });
  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(
      Math.max(
        -10,
        Math.min(
          10,
          (event.clientX - bounds.left - bounds.width / 2) * intensity,
        ),
      ),
    );
    y.set(
      Math.max(
        -8,
        Math.min(
          8,
          (event.clientY - bounds.top - bounds.height / 2) * intensity,
        ),
      ),
    );
  }
  return (
    <motion.div
      className={`magnetic ${className}`}
      style={{ x: springX, y: springY }}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onBlur={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
