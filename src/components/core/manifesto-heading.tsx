"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { TextEffect } from "./text-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCompactLayout } from "@/hooks/use-compact-layout";
export function ManifestoHeading() {
  const ref = useRef<HTMLHeadingElement>(null),
    visible = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion(),
    compact = useCompactLayout();
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => {
    if (visible && !reduced && !compact) setEnhanced(true);
  }, [visible, reduced, compact]);
  const animate = enhanced && !reduced && !compact;
  return (
    <h2 ref={ref} id="manifesto-title" className="manifesto-heading">
      {animate ? (
        <>
          <TextEffect
            per="word"
            as="span"
            className="headline-line"
            preset="slide"
            segmentWrapperClassName="word-mask"
            speedSegment={0.8}
          >
            A web tem espaço
          </TextEffect>
          <TextEffect
            per="word"
            as="span"
            className="headline-line"
            preset="slide"
            segmentWrapperClassName="word-mask"
            delay={0.1}
            speedSegment={0.8}
          >
            para o inesperado.
          </TextEffect>
        </>
      ) : (
        <>
          <span className="headline-line">A web tem espaço</span>
          <span className="headline-line">
            para o <span>inesperado.</span>
          </span>
        </>
      )}
    </h2>
  );
}
