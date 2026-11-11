"use client";
import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
const GlassScene = dynamic(() => import("./glass-scene"), { ssr: false });
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function HeroVisual() {
  const host = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => {
    setFailed(true);
    setEnabled(false);
  }, []);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2");
    const canRender =
      !!gl && !connection?.saveData && (navigator.hardwareConcurrency || 4) > 2;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    const update = () => {
      setEnabled(canRender && !query.matches);
      setCompact(window.innerWidth < 768);
    };
    update();
    query.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  useEffect(() => {
    let inView = true;
    const update = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        update();
      },
      { rootMargin: "80px" },
    );
    if (host.current) observer.observe(host.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div
      className="hero-visual"
      ref={host}
      data-ready={enabled && ready && !failed}
    >
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet="/models/untold-aurora-mobile.webp"
        />
        <img
          className="glass-fallback"
          src="/models/untold-aurora-desktop.webp"
          width="1440"
          height="900"
          alt="Símbolo original da Untold esculpido em vidro óptico, no centro de uma aurora multicolorida"
          fetchPriority="high"
        />
      </picture>
      {enabled && !failed && (
        <SceneBoundary onFailure={onFailure}>
          <GlassScene
            active={visible && (!paused || !ready)}
            moving={!paused}
            compact={compact}
            onReady={onReady}
            onFailure={onFailure}
          />
        </SceneBoundary>
      )}
      <div className="scene-controls">
        {enabled && ready && !failed && (
          <button
            className="motion-toggle liquid-glass"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Retomar animação" : "Pausar animação"}
            aria-pressed={paused}
          >
            {paused ? "▶" : "Ⅱ"}
          </button>
        )}
      </div>
    </div>
  );
}
