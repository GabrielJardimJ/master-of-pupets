import { services } from "@/content/site";
import { MorphingDialog } from "../core/morphing-dialog";
export function Services() {
  return (
    <section
      id="servicos"
      className="services section-pad"
      aria-labelledby="services-title"
      tabIndex={-1}
    >
      <div className="section-label">
        <span>02 / O que fazemos</span>
        <span>Design e engenharia, lado a lado.</span>
      </div>
      <div className="section-heading">
        <h2 id="services-title">
          Uma ideia.
          <br />
          <span>Todos os detalhes.</span>
        </h2>
        <p>
          Do primeiro esboço à experiência no navegador, conectamos as partes
          que fazem um projeto ter identidade.
        </p>
      </div>
      <div className="service-list">
        {services.map((service) => (
          <div className="service-row" key={service.number}>
            <MorphingDialog {...service} />
          </div>
        ))}
      </div>
    </section>
  );
}
