export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="manifesto section-pad"
      data-theme="light"
      aria-labelledby="manifesto-title"
      tabIndex={-1}
    >
      <div className="section-label">
        <span>01 / Nossa essência</span>
        <span>Ideias merecem uma forma própria.</span>
      </div>
      <h2 id="manifesto-title">
        A web tem espaço
        <br />
        para o <span>inesperado.</span>
      </h2>
      <div className="manifesto-bottom liquid-glass">
        <div className="manifesto-symbol">
          <img
            src="/brand/symbol.svg"
            alt=""
            width="72"
            height="72"
            loading="lazy"
          />
        </div>
        <p>
          Acreditamos em sites que expressam quem está por trás da marca. Em
          design que orienta. Em código que sustenta. E nos detalhes que fazem
          uma experiência ser lembrada.
        </p>
        <p>
          É nessa conexão entre sensibilidade e engenharia que a Untold
          trabalha. Da primeira ideia ao que acontece na tela.
        </p>
      </div>
    </section>
  );
}
