"use client";
// Adapted from Magic UI MagicCard's gradient mode. MIT — see docs/licenses/magic-ui.txt.
// Source: github.com/magicuidesign/magicui/apps/www/registry/magicui/magic-card.tsx
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import type { ReactNode, PointerEvent, FocusEvent } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCompactLayout } from "@/hooks/use-compact-layout";
export function MagicCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion(),
    compact = useCompactLayout();
  const mouseX = useMotionValue(-300),
    mouseY = useMotionValue(-300);
  const visible = useMotionValue(0),
    rotateX = useMotionValue(0),
    rotateY = useMotionValue(0);
  const tiltX = useSpring(rotateX, { stiffness: 180, damping: 24 }),
    tiltY = useSpring(rotateY, { stiffness: 180, damping: 24 }),
    opacity = useSpring(visible, { stiffness: 180, damping: 24 });
  const interactive = !reduced && !compact;
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 4);
    rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 4);
    visible.set(0.16);
  }
  function reset() {
    mouseX.set(-300);
    mouseY.set(-300);
    visible.set(0);
    rotateX.set(0);
    rotateY.set(0);
  }
  function focus(event: FocusEvent<HTMLDivElement>) {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(rect.width / 2);
    mouseY.set(rect.height / 2);
    visible.set(0.08);
  }
  return (
    <motion.div
      className={`magic-card ${className}`}
      data-interactive={interactive}
      onPointerMove={move}
      onPointerLeave={reset}
      onFocus={focus}
      onBlur={reset}
      style={{
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1200,
        background: useMotionTemplate`linear-gradient(var(--card) 0 0) padding-box,radial-gradient(260px circle at ${mouseX}px ${mouseY}px,var(--primary),var(--brand-violet),var(--border) 100%) border-box`,
      }}
    >
      <div className="magic-card-base" aria-hidden="true" />
      <motion.div
        className="magic-card-light"
        aria-hidden="true"
        style={{
          opacity,
          background: useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px,var(--primary),transparent 100%)`,
        }}
      />
      <div className="magic-card-content">{children}</div>
    </motion.div>
  );
}
