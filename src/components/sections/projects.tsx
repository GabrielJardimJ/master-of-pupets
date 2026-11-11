import { projects } from "@/content/site";
import { Arrow } from "../ui/arrow";
export function Projects() {
  return (
    <section
      id="projetos"
      className="projects section-pad"
      aria-labelledby="projects-title"
      tabIndex={-1}
    >
      <div className="section-label">
        <span>03 / Projetos selecionados</span>
        <span>Um espaço para histórias reais.</span>
      </div>
      <div className="section-heading">
        <h2 id="projects-title">
          O trabalho
          <br />
          <span>ganha forma aqui.</span>
        </h2>
      </div>
      {projects.length ? (
        <div className="project-grid">
          {projects.map((project) => (
            <a
              className="project-item liquid-glass"
              key={project.slug}
              href={project.url}
            >
              <div className="project-image">
                <img
                  src={project.image}
                  width="1200"
                  height="800"
                  alt={project.description}
                  loading="lazy"
                />
              </div>
              <div className="project-info">
                <h3>{project.name}</h3>
                <span>
                  {project.category}
                  {project.year ? ` / ${project.year}` : ""}
                </span>
                <Arrow diagonal />
              </div>
              <p>{project.description}</p>
            </a>
          ))}
        </div>
      ) : (
        <div className="projects-empty liquid-glass">
          <span className="empty-marker" aria-hidden="true">
            [ U / 001 ]
          </span>
          <div>
            <span className="eyebrow">Cada projeto, uma história.</span>
            <h3>
              O próximo capítulo
              <br />
              ainda está em branco.
            </h3>
            <p>
              Ainda não há cases publicados.
              <br />
              Enquanto isso, este site apresenta um pouco do que gostamos de
              construir.
            </p>
            <a href="#contato" className="text-link liquid-glass">
              Vamos criar o próximo? <Arrow diagonal />
            </a>
          </div>
          <span className="empty-drawing" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </div>
      )}
    </section>
  );
}
