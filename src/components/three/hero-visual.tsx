"use client";
import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
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
  const [automatic, setAutomatic] = useState(false);
  const reduced = useReducedMotion();
  const supported = useRef<boolean | null>(null);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => {
    setFailed(true);
    setEnabled(false);
  }, []);
  const startScene = useCallback(() => {
    if (supported.current === null) {
      const probe = document.createElement("canvas");
      const gl = probe.getContext("webgl2");
      supported.current = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    }
    if (supported.current) {
      setEnabled(true);
      setPaused(false);
    } else onFailure();
  }, [onFailure]);
  useEffect(() => {
    const small = matchMedia("(max-width: 767px)");
    const touch = matchMedia("(pointer: coarse)");
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const update = () => {
      setCompact(small.matches || touch.matches);
      const limited =
        !!device.connection?.saveData ||
        ["slow-2g", "2g"].includes(device.connection?.effectiveType || "") ||
        (device.deviceMemory !== undefined && device.deviceMemory <= 4) ||
        (device.hardwareConcurrency || 8) <= 4;
      setAutomatic(!small.matches && !touch.matches && !limited);
    };
    update();
    small.addEventListener("change", update);
    touch.addEventListener("change", update);
    return () => {
      small.removeEventListener("change", update);
      touch.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    if (reduced) {
      setEnabled(false);
      setReady(false);
      return;
    }
    if (!automatic || !visible || enabled || failed) return;
    let idle: number | undefined;
    const timer = setTimeout(() => {
      if ("requestIdleCallback" in window)
        idle = window.requestIdleCallback(startScene, { timeout: 1500 });
      else startScene();
    }, 300);
    return () => {
      clearTimeout(timer);
      if (idle !== undefined) window.cancelIdleCallback(idle);
    };
  }, [automatic, visible, enabled, failed, reduced, startScene]);
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
      data-activation={automatic ? "auto" : "manual"}
    >
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet="/models/untold-lights-mobile.webp"
        />
        <img
          className="glass-fallback"
          src="/models/untold-lights-desktop.webp"
          width="1440"
          height="900"
          alt="Símbolo original da Untold esculpido em vidro óptico, entre luzes abstratas em azul e violeta oficiais"
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
        {!enabled && !reduced && !automatic && !failed && (
          <button className="scene-activate liquid-glass" onClick={startScene}>
            Ativar experiência 3D <span aria-hidden="true">↗</span>
          </button>
        )}
        {enabled && !ready && !automatic && (
          <span className="scene-loading" role="status">
            Carregando experiência…
          </span>
        )}
        {failed && (
          <span className="scene-loading" role="status">
            A prévia estática está disponível.
          </span>
        )}
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
