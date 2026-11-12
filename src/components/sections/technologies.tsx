"use client";
import { useState } from "react";
import { InfiniteSlider } from "../core/infinite-slider";
const technologies = [
  ["html5", "HTML"],
  ["css3", "CSS"],
  ["javascript", "JavaScript"],
  ["typescript", "TypeScript"],
  ["react", "React"],
  ["nodejs", "Node.js"],
  ["vitejs", "Vite"],
  ["vuejs", "Vue"],
  ["figma", "Figma"],
  ["threejs", "Three.js"],
  ["nextjs", "Next.js"],
  ["blender", "Blender"],
];
export function Technologies() {
  const [paused, setPaused] = useState(false);
  return (
    <section
      id="tecnologias"
      className="technologies"
      aria-labelledby="tech-title"
    >
      <div className="tech-heading">
        <h2 id="tech-title">
          Tecnologias
        </h2>
        <button
          className="tech-pause liquid-glass"
          aria-label={paused ? "Retomar tecnologias" : "Pausar tecnologias"}
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? "▶" : "Ⅱ"}
        </button>
      </div>
      <InfiniteSlider speed={45} speedOnHover={20} gap={64} paused={paused}>
        {technologies.map(([slug, name]) => (
          <div className="technology-logo" key={slug}>
            <img
              src={`/technologies/${slug}.svg`}
              alt={name}
              title={name}
              width="56"
              height="56"
              loading="lazy"
            />
          </div>
        ))}
      </InfiniteSlider>
    </section>
  );
}
