"use client";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/content/site";
import { Arrow } from "./ui/arrow";
import { Magnetic } from "./core/magnetic";
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("inicio");
      setScrolled(
        window.scrollY >=
          (hero?.offsetHeight || window.innerHeight) -
            window.innerHeight * 0.55,
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = menu.current?.querySelectorAll<HTMLAnchorElement>("a");
    links?.[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab" && links?.length) {
        if (e.shiftKey && document.activeElement === links[0]) {
          e.preventDefault();
          toggle.current?.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === links[links.length - 1]
        ) {
          e.preventDefault();
          toggle.current?.focus();
        } else if (document.activeElement === toggle.current) {
          e.preventDefault();
          (e.shiftKey ? links[links.length - 1] : links[0]).focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  return (
    <header
      inert={!scrolled}
      aria-hidden={!scrolled}
      className={`site-header liquid-glass is-scrolled ${scrolled ? "header-visible" : "header-hidden"} ${open ? "menu-open" : ""}`}
    >
      <a
        href="#inicio"
        className="brand-link"
        aria-label="Untold — início"
        onClick={() => setOpen(false)}
      >
        <img
          src="/brand/logo-horizontal-dark.svg"
          width="138"
          height="62"
          alt="Untold"
        />
      </a>
      <nav className="desktop-nav" aria-label="Navegação principal">
        {navigation.slice(1).map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <Magnetic className="nav-magnetic">
        <a className="nav-contact liquid-glass" href="#contato">
          Iniciar um projeto <Arrow diagonal />
        </a>
      </Magnetic>
      <button
        ref={toggle}
        className="menu-toggle liquid-glass"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
      </button>
      {open && (
        <div id="mobile-menu" className="mobile-menu liquid-glass" ref={menu}>
          <nav aria-label="Navegação mobile">
            {[
              ...navigation,
              { label: "Iniciar um projeto", href: "#contato" },
            ].map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  setOpen(false);
                  requestAnimationFrame(() =>
                    document
                      .querySelector<HTMLElement>(item.href)
                      ?.focus({ preventScroll: true }),
                  );
                }}
              >
                <span className="menu-index">0{i + 1}</span>
                {item.label}
                <Arrow diagonal />
              </a>
            ))}
          </nav>
          <p>
            Design e engenharia.
            <br />
            Uma mesma direção.
          </p>
        </div>
      )}
    </header>
  );
}
