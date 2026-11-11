export const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Projetos", href: "#projetos" },
  { label: "Estúdio", href: "#estudio" },
];
export const services = [
  {
    number: "01",
    title: "Desenvolvimento web",
    description:
      "Sites que traduzem a identidade da sua marca em uma presença digital. Da estrutura à última interação.",
    tags: [
      "Sites institucionais",
      "Landing pages",
      "Desenvolvimento sob medida",
    ],
  },
  {
    number: "02",
    title: "Design de interfaces",
    description:
      "Hierarquia, forma e função em uma mesma direção. Interfaces pensadas para quem está do outro lado da tela.",
    tags: ["UI / UX", "Interfaces responsivas", "Sistemas de componentes"],
  },
  {
    number: "03",
    title: "Experiências digitais",
    description:
      "Movimento e tecnologia como parte da narrativa. Interações que dão uma expressão própria à sua marca.",
    tags: ["Creative development", "WebGL & 3D", "Motion & interação"],
  },
];
// Add only approved, real work. Empty in the absence of client case studies.
export type Project = {
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  year?: number;
  url: string;
};
export const projects: Project[] = [];
// Proposed editable process, not a claim about an established commercial workflow.
export const process = [
  {
    title: "Entender",
    text: "A marca, as pessoas e o que o projeto precisa resolver. O ponto de partida é uma conversa.",
  },
  {
    title: "Dar forma",
    text: "Organizar conteúdo, explorar a direção visual e desenhar as interações.",
  },
  {
    title: "Construir",
    text: "Transformar a direção em código, com atenção a desempenho, acesso e detalhe.",
  },
  {
    title: "Refinar",
    text: "Testar em telas reais, ajustar a experiência e preparar o projeto para publicação.",
  },
];
