"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCompactLayout } from "@/hooks/use-compact-layout";
import tokens from "@/styles/tokens.json";
import { process } from "@/content/site";
const words = ["cada ideia.", "cada escolha.", "cada detalhe.", "cada etapa."];
function Steps() {
  return (
    <ol className="process-list">
      {process.map((step, i) => (
        <li key={step.title}>
          <span className="process-number">0{i + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
function AnimatedProcess() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let disposed = false,
      started = false,
      cleanup: undefined | (() => void);
    const setup = async () => {
      if (started) return;
      started = true;
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
          const track = root.querySelector(".process-word-track");
          const white = root.querySelector(".process-white");
          const inner = root.querySelector(".process-inner");
          const details = root.querySelector(".process-details");
          gsap.set(track, { y: 0, yPercent: 0 });
          gsap.set(white, { clipPath: "circle(0% at 50% 50%)" });
          gsap.set(inner, { color: tokens.primitive.cloud });
          gsap.set(details, { opacity: 0, y: 24 });
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .to(track, { yPercent: -75, duration: 0.62 }, 0)
            .to(
              white,
              { clipPath: "circle(150% at 50% 50%)", duration: 0.24 },
              0.62,
            )
            .to(inner, { color: tokens.primitive.ink, duration: 0.16 }, 0.67)
            .to(details, { opacity: 1, y: 0, duration: 0.14 }, 0.8)
            .to({}, { duration: 0.06 }, 0.94);
          timeline.scrollTrigger?.refresh();
          timeline.scrollTrigger?.update();
        }, root);
        root.dataset.scrollDriver = "gsap";
        cleanup = () => {
          context.revert();
          delete root.dataset.scrollDriver;
        };
      } catch {
        root.dataset.scrollDriver = "static";
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void setup();
        }
      },
      { rootMargin: "500px" },
    );
    observer.observe(root);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanup?.();
    };
  }, []);
  return (
    <section
      ref={ref}
      id="processo"
      className="process-chapter"
      aria-labelledby="process-title"
      tabIndex={-1}
    >
      <div className="process-stage">
        <div className="process-white" aria-hidden="true" />
        <div className="process-inner">
          <div className="section-label">
            <span>04 / Da ideia à experiência</span>
            <span>Uma construção em conjunto.</span>
          </div>
          <h2 id="process-title" className="process-wheel-title">
            <span>Clareza em</span>
            <span className="sr-only">cada etapa.</span>
            <span className="process-wheel" aria-hidden="true">
              <span className="process-word-track">
                {words.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </span>
            </span>
          </h2>
          <div className="process-details">
            <p className="process-intro">
              Uma direção para tirar ideias do papel. O caminho de cada projeto
              é definido junto com você.
            </p>
            <Steps />
          </div>
        </div>
      </div>
    </section>
  );
}
function StaticProcess() {
  return (
    <section
      id="processo"
      className="process-chapter process-reduced"
      data-theme="light"
      aria-labelledby="process-title"
      tabIndex={-1}
    >
      <div className="process-stage">
        <div className="process-inner">
          <div className="section-label">
            <span>04 / Da ideia à experiência</span>
          </div>
          <h2 id="process-title" className="process-wheel-title">
            Clareza em cada etapa.
          </h2>
          <div className="process-details">
            <Steps />
          </div>
        </div>
      </div>
    </section>
  );
}
export function Process() {
  const compact = useCompactLayout(),
    reduced = useReducedMotion();
  return compact || reduced ? <StaticProcess /> : <AnimatedProcess />;
}
