# Direção de movimento — revisão 05

Seleção feita antes da implementação, a partir dos repositórios e documentação primária. O usuário confirmou: **retirar a aurora e usar luzes abstratas animadas em azul e violeta oficiais**. A menção à aurora no restante do briefing foi substituída por essa decisão explícita.

| Fonte | Inspeção | Seleção e aplicação |
| --- | --- | --- |
| [React Bits](https://github.com/DavidHDev/react-bits) | README, licença, componente TS completo ColorBends e documentação | Reutilizar o fragment shader real de Color Bends, adaptando-o à cena R3F existente para que o vidro enxergue o fundo. Uma única Canvas, cores oficiais e limites de qualidade existentes. Sem renderer adicional. |
| [Aceternity](https://github.com/aceternity/aceternity-ui) | O repositório indicado retorna 404 no GitHub e conector. Documentação pública de Card Hover / 3D Card consultada | Repertório de profundidade, sem copiar código cuja origem/licença não foi verificada. Não adicionar outra biblioteca de cards. |
| [Magic UI](https://github.com/magicuidesign/magicui) | README, MagicCard completo e BlurFade já instalado | Reutilizar o modo de iluminação radial do MagicCard, com tokens Untold e inclinação de no máximo 2 graus nos projetos. Desabilitar profundidade no toque / movimento reduzido. Sem instalar next-themes para um componente cujo tema já vem da Untold. |
| [Motion Primitives](https://github.com/ibelick/motion-primitives) | README, TextEffect completo; Magnetic, InfiniteSlider e MorphingDialog já inspecionados e usados | TextEffect no manifesto, uma entrada por visita, por palavras, sem blur caro. Preservar texto estático no SSR, mobile e reduced motion. Reaproveitar as microinterações existentes. |
| [GSAP](https://github.com/greensock/GSAP) | README, documentação oficial de context / ScrollTrigger / matchMedia e licença padrão | Substituir o driver Motion do processo por uma timeline GSAP/ScrollTrigger no desktop; nunca animar as mesmas propriedades pelas duas engines. Importar GSAP somente quando o capítulo se aproximar. Cleanup pelo contexto. Sem scroll hijacking. |

## Restrições de composição

Uma cena principal, uma sequência de scroll no processo, uma entrada tipográfica e iluminação dos cards. Header, botões e campos mantêm a linguagem mínima de liquid glass. Não acrescentar partículas, cursores customizados, backgrounds em todas as seções ou animações contínuas nos cards.

A geometria e o material de transmissão do GLB são preservados. Azul `#2563FF`, violeta `#8B5CF6`, Dobra `#6443CB`, Ink e Cloud permanecem a paleta. Manrope, spacing e raios continuam derivados do contrato oficial. Não haverá ciano, verde ou rosa na Hero desta revisão.

O portfólio continua sem clientes ou cases inventados. MagicCard será usado no estado vazio real e no componente que renderizará os cases aprovados quando forem inseridos. Efeitos de profundidade nunca serão necessários para ler ou acionar um card.

## Licenças

React Bits usa MIT + Commons Clause: permite usar e adaptar como parte deste website, sem redistribuir os componentes como produto próprio; texto preservado em `licenses/react-bits.txt`. Magic UI e Motion Primitives usam MIT, com avisos preservados nos arquivos já existentes em `licenses/`. GSAP mantém sua licença padrão própria, não é identificado como MIT: [Standard License](https://gsap.com/standard-license). O uso aqui é animação de website, sem editor visual concorrente. Os avisos do pacote npm são preservados.

As adaptações são identificadas nos fontes. Componentes pagos / Pro e código inacessível não serão usados. Limites físicos de performance e validação final serão registrados em `validation.md`.
