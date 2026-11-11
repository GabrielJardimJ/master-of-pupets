"use client";
import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
/** One delegated pointer listener; no component state or extra WebGL surfaces. */
export function GlassLighting() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    let active: HTMLElement | null = null,
      frame = 0,
      clientX = 0,
      clientY = 0;
    const reset = () => {
      active?.style.removeProperty("--glass-x");
      active?.style.removeProperty("--glass-y");
      active = null;
    };
    const move = (event: PointerEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(".liquid-glass")
          : null;
      if (target !== active) {
        reset();
        active = target;
      }
      clientX = event.clientX;
      clientY = event.clientY;
      if (!active || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!active || document.hidden) return;
        const r = active.getBoundingClientRect();
        active.style.setProperty(
          "--glass-x",
          `${((clientX - r.left) / r.width) * 100}%`,
        );
        active.style.setProperty(
          "--glass-y",
          `${((clientY - r.top) / r.height) * 100}%`,
        );
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(frame);
      reset();
    };
  }, [reduced]);
  return null;
}
