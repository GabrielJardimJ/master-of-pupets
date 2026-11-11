"use client";
import { useEffect } from "react";
export function EditorialMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const running: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (!reduced.matches)
            running.push(
              entry.target.animate(
                [
                  { opacity: 0.65, transform: "translateY(14px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                { duration: 600, easing: "cubic-bezier(.2,0,0,1)" },
              ),
            );
          observer.unobserve(entry.target);
        }),
      { threshold: 0.15 },
    );
    document
      .querySelectorAll(
        ".manifesto h2,.section-heading,.process-list li,.studio-copy",
      )
      .forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      running.forEach((animation) => animation.cancel());
    };
  }, []);
  return null;
}
