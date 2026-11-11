# Pesquisa visual e direção

> A composição descrita abaixo registra a primeira versão. A revisão 02 substitui a hero split por abertura imersiva, acrescenta navegação progressiva, MorphingDialog, Magnetic, InfiniteSlider e capítulo de processo com transição clara. As fontes, componentes e decisões atuais estão em [animation-sources.md](animation-sources.md).

Consulta em 11/11/2026. Referências servem à composição e à narrativa; a identidade da Untold tem prioridade. Não foram copiados código, imagens, modelos ou textos externos.

## Fontes estudadas e limites

| Referência                                 | Evidência obtida / leitura                                                                            | Aplicação à Untold                                                                                |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [Lusion](https://lusion.co/)               | página, estrutura de projetos, Aeonik e três canvases detectados; foco explícito em narrativa 3D      | objeto como argumento visual, navegação leve; uma única cena na Untold                            |
| [Active Theory](https://activetheory.net/) | shell dependente de JS; navegação do browser redirecionou e interrompeu a extração                    | inspiração conceitual de imersão; nenhum detalhe de motion ou performance tratado como verificado |
| [Linear](https://linear.app/)              | conteúdo indexado: navegação, hierarquia, produto e casos de uso; browser excedeu timeout             | proposta clara junto do espetáculo visual; sem alegar análise de sua animação ao vivo             |
| [Unseen](https://unseen.co/)               | Neue Montreal, canvas único, entrada com/sem áudio, navegação Index/Projects/Contact                  | continuidade atmosférica; dispensar barreira de entrada e áudio                                   |
| [Apple](https://www.apple.com/)            | navegação, imagens protagonistas, SF Pro e estrutura em campanhas                                     | dar espaço ao objeto; reduzir ruído ao redor dos CTAs                                             |
| [Instrument](https://www.instrument.com/)  | Instrument Sans/Serif, navegação por prática, trabalho e propósito                                    | ritmo editorial e seções com estruturas distintas                                                 |
| [Awwwards](https://www.awwwards.com/)      | catálogo carregado no navegador, Inter Tight, prêmios/coleções/diretório; HTTP de busca havia falhado | repertório de composição, sem transformar o site em coleção de efeitos                            |
| [Hoverstat.es](https://www.hoverstat.es/)  | arquivo e descrições de tipografia/interações experimentais; Fakt                                     | uma interação forte e contida em lugar de vários truques                                          |
| [Rejouice](https://www.rejouice.com/)      | SuisseIntl, showreel, casos e navegação curta                                                         | escala editorial e espaço negativo; nenhum showreel fictício                                      |
| [Basement](https://basement.studio/)       | fundo preto, Geist, dois canvases, projetos/capacidades/contato                                       | coerência entre engenharia e identidade; personalidade sem importar sua linguagem                 |
| [Dogstudio](https://dogstudio.co/)         | fundo escuro, tipografia Heebo/Sectra/Gilroy, estrutura de projetos e contato                         | contraste de escalas e foco numa imagem principal                                                 |

A leitura combinou conteúdo, DOM e estilos computados. Não foi feito benchmark de performance, auditoria mobile completa ou inspeção interna do pipeline WebGL dessas referências. Técnicas de refração, qualidade adaptativa e suspensão de render são decisões próprias, fundamentadas na documentação do Drei, não inferências sobre as implementações externas.

## Composições consideradas

1. **Escultura central, título no rodapé**: maior impacto isolado, mas cria competição entre headline e silhueta em notebooks.
2. **Texto à esquerda, escultura à direita — escolhida**: hierarquia clara, objeto grande e independente dos CTAs; reorganiza naturalmente em coluna no mobile.
3. **Escultura sobre headline central**: boa leitura em retrato, porém comprime o visual em telas de pouca altura.

O split foi implementado e refinado no navegador. As demais opções foram estudos de composição, não protótipos completos. No mobile, texto e ações aparecem primeiro; o símbolo ocupa a metade inferior. A proporção real do SVG é preservada.

## Sistema da Home

- Hero Ink com azul/violeta na aurora, Manrope 600 e UI discreta. Copy: “Sites com presença. Por essência.”, acompanhada da explicação objetiva do serviço.
- Manifesto Cloud como respiro editorial; texto grande e símbolo original.
- Serviços como linhas expansíveis nativas, sem grid de cards.
- Portfólio com estrutura tipada e vazio explícito, sem clientes fictícios. A área negativa faz parte da composição.
- Processo horizontal em quatro passos; duas colunas no mobile, uma em telas muito pequenas.
- Estúdio com assinatura original em fundo claro e texto humano.
- Contato com briefing baixável localmente e envio indisponível sinalizado.

## Motion e render

Uma entrada curta na tipografia, reveals editoriais e hover de ações. Sem scroll hijacking, Lenis ou biblioteca de animação adicional. A escultura flutua e acompanha o cursor com amortecimento; o scroll ajusta escala e posição sem sumir abruptamente. O usuário pode pausar. Reduced motion recebe imagem estática, conteúdo completo e scroll nativo.

Aurora procedural em plano na mesma cena da logo. `MeshTransmissionMaterial` renderiza o fundo em um buffer sem a própria malha para refratá-lo. Resolução limitada a 512/256, amostras 5/3 e DPR até 1,5/1,25, com solicitação de frames limitada a 30 Hz. Ambiente feito com Lightformers, sem HDRI remoto. [Documentação primária do material](https://github.com/pmndrs/drei/blob/master/docs/shaders/mesh-transmission-material.mdx).

O catálogo 21st foi consultado via CLI; exigiu login. Nenhum resultado foi acessível. A implementação priorizou os componentes e tokens da própria Untold, sem bloquear o trabalho por autenticação externa.
