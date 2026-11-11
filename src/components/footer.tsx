import { navigation } from "@/content/site";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top liquid-glass">
        <a
          className="brand-link"
          href="#inicio"
          aria-label="Untold — voltar ao início"
        >
          <img
            src="/brand/logo-horizontal-dark.svg"
            width="184"
            height="82"
            alt="Untold"
            loading="lazy"
          />
        </a>
        <p>
          Design com intenção.
          <br />
          Código com identidade.
        </p>
        <nav aria-label="Navegação do rodapé">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="#contato">Contato</a>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Untold</span>
        <span>Creative digital studio</span>
        <a href="#inicio">Voltar ao topo ↑</a>
      </div>
    </footer>
  );
}
