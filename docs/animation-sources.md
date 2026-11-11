# Interações — revisão 02

Fontes consultadas em 11/11/2026. O design system Untold continua sendo a autoridade para cor de interface, tipografia, raios, componentes e estados.

- [Web2Turn](https://web2turn.vercel.app/): seção `#nos`, função `initWWith` e estilos inspecionados no navegador e no JavaScript público. A referência faz uma roda de palavras durante o scroll e depois expande um fundo claro do centro. Esse princípio foi adaptado ao capítulo “Clareza em cada etapa”, com scroll nativo, estágio sticky, roda de palavras e expansão Cloud. Não foram importados preços, contatos ou conteúdo comercial da referência.
- [React Bits / introdução](https://reactbits.dev/get-started/introduction) e [Shape Magic](https://reactbits.dev/tools/shape-magic): ferramenta inspecionada no navegador, incluindo seus controles de materiais e o código público de `ShapeMagic.jsx`. É um editor, não um componente React pronto para ser importado como animação. O comportamento solicitado foi adaptado à cena R3F existente: luz real acompanha o ponteiro, com mudança de cor e amortecimento. A geometria GLB e as curvas originais não foram alteradas. Não foi copiado o editor nem seu motor de máscaras.
- [Motion Primitives / Infinite Slider](https://motion-primitives.com/docs/infinite-slider): padrão adaptado com `motion/react`, medição nativa por ResizeObserver, velocidade interpolada no hover, cópia visual com `aria-hidden`, pausa e respeito a movimento reduzido. Dispensa `react-use-measure` adicional.
- [Motion Primitives / Magnetic](https://motion-primitives.com/docs/magnetic): movimento por motion values e springs, limitado a 10 px, apenas com mouse. Aplicado às ações de contato; teclado e toque continuam diretos.
- [Motion Primitives / Morphing Dialog](https://motion-primitives.com/docs/morphing-dialog): expansão com `layoutId` e LayoutGroup, usando a primitiva Dialog Base UI da própria biblioteca Untold para foco, Escape, modal e retorno ao acionador. Não se adicionou outra biblioteca de dialogs.
- [Magic UI / Blur Fade](https://magicui.design/docs/components/blur-fade): código do componente reutilizado em `src/components/magicui/blur-fade.tsx`, com adaptação para `prefers-reduced-motion`. Aplicado ao conteúdo do estúdio, em vez de empilhar efeitos por toda a página.
- [Devicon](https://github.com/devicons/devicon): arquivos SVG originais baixados para `public/technologies/`. Logos mantêm suas cores e formatos, com nomes acessíveis; não representam clientes nem patrocínio. HTML, CSS, JavaScript, React, Node, Vite, Vue e Figma foram confirmados pelo usuário; TypeScript, Three.js, Next.js e Blender são usados neste projeto.

As páginas de Motion Primitives retornaram 403 no extrator HTTP. A consulta prosseguiu pela documentação primária no GitHub e Context7; os componentes foram inspecionados, não inferidos pela captura fornecida. Magic UI e Motion Primitives usam licença MIT, preservada em `docs/licenses/`. A resposta luminosa inspirada em Shape Magic é uma implementação própria sobre o GLB existente.

## Composição e acesso

A hero tem somente a aurora e a logo visíveis. O h1 semântico continua disponível para leitores de tela. Há um controle discreto de pausa e atalho de teclado para o conteúdo. O header é menor, translúcido, oculto e `inert` durante a abertura; aparece suavemente quando a segunda seção chega à região da navegação. O menu mantém foco e Escape.

Azul e violeta continuam dominantes. Ciano, verde suave e rosa são acentos atmosféricos autorizados nesta revisão para a aurora multicolorida; não substituem os tokens da interface.

O cursor padrão substitui o I-beam, inclusive sobre texto e campos. Não há `user-select:none`, bloqueio de eventos do mouse ou captura que impeça seleção, rolagem ou navegação.

Os posters responsivos da hero são capturados do Canvas real pelo script `scripts/capture-hero-fallbacks.mjs`, com os controles ocultos. Os previews e o `.blend` originais continuam preservados. O hook de movimento reduzido usa um snapshot de servidor estável e acompanha mudanças de preferência durante a visita, evitando divergências de hidratação.
