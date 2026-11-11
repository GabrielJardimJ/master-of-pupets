"use client";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import tokens from "@/styles/tokens.json";
import { process } from "@/content/site";
const words = ["cada ideia.", "cada escolha.", "cada detalhe.", "cada etapa."];
function ProcessWord({
  word,
  index,
  progress,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (p) =>
    Math.max(0.12, 1 - Math.abs(Math.min(p / 0.62, 1) * 3 - index) * 0.8),
  );
  return <motion.span style={{ opacity }}>{word}</motion.span>;
}
export function Process() {
  const ref = useRef<HTMLElement>(null),
    reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 0.62, 1],
    ["0em", "-3.6em", "-3.6em"],
  );
  const circle = useTransform(
    scrollYProgress,
    [0.62, 0.86],
    ["circle(0% at 50% 50%)", "circle(150% at 50% 50%)"],
  );
  const ink = useTransform(
    scrollYProgress,
    [0.67, 0.83],
    [tokens.primitive.cloud, tokens.primitive.ink],
  );
  const stepsOpacity = useTransform(scrollYProgress, [0.8, 0.94], [0, 1]);
  const stepsY = useTransform(scrollYProgress, [0.8, 0.94], [24, 0]);
  return (
    <section
      ref={ref}
      id="processo"
      className={`process-chapter ${reduced ? "process-reduced" : ""}`}
      aria-labelledby="process-title"
      tabIndex={-1}
    >
      <div className="process-stage">
        <motion.div
          className="process-white"
          style={{ clipPath: reduced ? "none" : circle }}
          aria-hidden="true"
        />
        <motion.div
          className="process-inner"
          style={{ color: reduced ? tokens.primitive.ink : ink }}
        >
          <div className="section-label">
            <span>04 / Da ideia à experiência</span>
            <span>Uma construção em conjunto.</span>
          </div>
          <h2 id="process-title" className="process-wheel-title">
            <span>Clareza em</span>
            <span className="sr-only">cada etapa.</span>
            <span className="process-wheel" aria-hidden="true">
              {reduced ? (
                <span>cada etapa.</span>
              ) : (
                <motion.span className="process-word-track" style={{ y }}>
                  {words.map((word, index) => (
                    <ProcessWord
                      word={word}
                      index={index}
                      progress={scrollYProgress}
                      key={word}
                    />
                  ))}
                </motion.span>
              )}
            </span>
          </h2>
          <motion.div
            className="process-details"
            style={{
              opacity: reduced ? 1 : stepsOpacity,
              y: reduced ? 0 : stepsY,
            }}
          >
            <p className="process-intro">
              Uma direção para tirar ideias do papel. O caminho de cada projeto
              é definido junto com você.
            </p>
            <ol className="process-list">
              {process.map((step, i) => (
                <li className="liquid-glass" key={step.title}>
                  <span className="process-number">
                    0{i + 1}
                    <span aria-hidden="true">↗</span>
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
