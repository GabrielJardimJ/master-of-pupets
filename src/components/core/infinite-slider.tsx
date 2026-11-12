"use client";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
// Motion Primitives InfiniteSlider pattern, with native measurement and accessible copies.
import { motion, useMotionValue, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
export function InfiniteSlider({
  children,
  gap = 24,
  speed = 45,
  speedOnHover = 20,
  paused = false,
}: {
  children: ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  paused?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null),
    group = useRef<HTMLDivElement>(null);
  const width = useRef(0),
    current = useRef(speed),
    hover = useRef(false),
    position = useRef(0);
  const translation = useMotionValue(0),
    reduced = useReducedMotion(),
    inView = useInView(host, { margin: "80px" });
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (!group.current) return;
    const measure = () => {
      width.current = group.current!.getBoundingClientRect().width + gap;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(group.current);
    measure();
    return () => observer.disconnect();
  }, [gap]);
  useEffect(() => {
    if (reduced || paused || hidden || !inView) return;
    let frame = 0,
      last = 0;
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (!last) {
        last = time;
        return;
      }
      const elapsed = time - last;
      if (elapsed < 1000 / 30) return;
      last = time;
      if (!width.current) return;
      const delta = Math.min(elapsed, 50);
      const target = hover.current ? speedOnHover : speed;
      current.current += (target - current.current) * Math.min(delta / 180, 1);
      position.current =
        (position.current + (delta * current.current) / 1000) % width.current;
      translation.set(-position.current);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, paused, hidden, inView, speed, speedOnHover, translation]);
  return (
    <div
      className={`infinite-slider ${reduced ? "slider-static" : ""}`}
      ref={host}
      onPointerEnter={() => {
        hover.current = true;
      }}
      onPointerLeave={() => {
        hover.current = false;
      }}
    >
      <motion.div
        className="slider-track"
        style={{ x: reduced ? 0 : translation, gap }}
      >
        <div className="slider-group" ref={group} style={{ gap }}>
          {children}
        </div>
        {!reduced && (
          <div className="slider-group" style={{ gap }} aria-hidden="true">
            {children}
          </div>
        )}
      </motion.div>
    </div>
  );
}
