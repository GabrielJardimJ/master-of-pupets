import { MagicCard } from "../magicui/magic-card";
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
        <h2 id="projects-title">Projetos selecionados.</h2>
      </div>
      {projects.length ? (
        <div className="project-grid">
          {projects.map((project) => (
            <MagicCard key={project.slug} className="project-card">
              <a className="project-item" href={project.url}>
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
            </MagicCard>
          ))}
        </div>
      ) : (
        <MagicCard className="projects-empty-card">
          <div className="projects-empty">
            <div>
              <span className="eyebrow">Cada projeto, uma história.</span>
              <h3>Espaço para o próximo projeto.</h3>
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
          </div>
        </MagicCard>
      )}
    </section>
  );
}
