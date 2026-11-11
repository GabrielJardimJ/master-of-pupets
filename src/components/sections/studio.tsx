import { Magnetic } from "../core/magnetic";
import { BlurFade } from "../magicui/blur-fade";
export function Studio() {
  return (
    <>
      <section
        id="estudio"
        className="studio section-pad"
        data-theme="light"
        aria-labelledby="studio-title"
        tabIndex={-1}
      >
        <div className="section-label">
          <span>05 / O estúdio</span>
          <span>Untold. Histórias por construir.</span>
        </div>
        <div className="studio-layout">
          <div className="studio-brand liquid-glass">
            <img
              src="/brand/logo-vertical-light.svg"
              width="264"
              height="350"
              alt="Untold — símbolo e assinatura originais"
              loading="lazy"
            />
            <div className="studio-brand-caption">
              <span>Fluida. Inventiva. Clara.</span>
              <span>Próxima. Precisa.</span>
            </div>
          </div>
          <BlurFade className="studio-copy" inView blur="3px" offset={10}>
            <h2 id="studio-title">
              O encontro entre
              <br />o olhar criativo
              <br />
              <span>e o pensar técnico.</span>
            </h2>
            <p>
              Somos a Untold, um estúdio de desenvolvimento web. Criamos sites,
              interfaces e experiências digitais para marcas que querem se
              expressar de um jeito próprio.
            </p>
            <p>
              Design e engenharia participam da mesma conversa. Assim, o que é
              imaginado encontra cuidado em cada detalhe da construção.
            </p>
            <Magnetic>
              <a href="#contato" className="text-link liquid-glass">
                Conte sua ideia <span aria-hidden="true">↗</span>
              </a>
            </Magnetic>
          </BlurFade>
        </div>
      </section>
    </>
  );
}
