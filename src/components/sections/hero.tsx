import { HeroVisual } from "../three/hero-visual";
export function Hero() {
  return (
    <section
      id="inicio"
      className="hero hero-immersive"
      aria-label="Untold — Glass meets Aurora"
      tabIndex={-1}
    >
      <h1 className="sr-only">Untold — Design e desenvolvimento web</h1>
      <HeroVisual />
      <a href="#manifesto" className="hero-skip sr-only">
        Conhecer a Untold
      </a>
    </section>
  );
}
