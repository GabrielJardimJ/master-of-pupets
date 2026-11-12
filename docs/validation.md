# Validação — revisão 05

Verificação feita no export de produção, servido por HTTP em `http://localhost:3000`, com Chromium. Os testes reproduzíveis estão em `tests/home.spec.ts`; capturas em `docs/screenshots/`. As decisões atuais estão em [motion-selection.md](motion-selection.md); o histórico em [animation-sources.md](animation-sources.md).

## Build e modelo

`npm run build` e TypeScript aprovados; saída estática em `out/`. GLB carregado de verdade no desktop e mobile, com resposta HTTP 200 e cabeçalho `glTF`. A fonte `.blend` continua fora do diretório público; o teste confirma 404 para uma tentativa de carregamento via navegador.

O modelo foi criado e verificado em Blender 5.2.2 LTS por Python, pois o MCP não encontrou uma instância conectada. O corpo tem 5.134 vértices exportados, 3.640 depois da soldagem de validação, e 7.276 triângulos. A dobra tem 2.008 / 1.400 vértices e 2.796 triângulos. Zero arestas abertas e zero normais inválidas na cópia de validação após reconciliar as divisões do glTF. Dimensões do corpo: aproximadamente 3,228 × 0,430 × 3,169. Valores exatos em `model-validation.json`. A geometria não mudou nesta revisão.

**Resultado atual: 9 testes aprovados.** Build de produção e TypeScript aprovados.

## Jornadas verificadas

1. Hero com altura de viewport, logo GLB centralizada, sem copy visível nem header; navegação aparece ao entrar na segunda seção. Console sem exceções na jornada e sem assets locais com erro.
2. MorphingDialog dos serviços: abertura, conteúdo, área de toque, ciclo de foco, Escape, retorno ao acionador e link para contato.
3. Layout sem overflow horizontal em 320×740, 390×844, 768×1024, 1024×768, 1440×900 e 2560×1080. Menu mobile, Escape e fechamento ao navegar. Logos das tecnologias carregadas localmente.
4. Processo: palavras mudam com o scroll; a camada Cloud expande até cobrir o estágio; texto termina Ink e conteúdo das etapas fica visível. Mudança de preferência para movimento reduzido funciona durante a visita.
5. InfiniteSlider em movimento, pausa estável e efeito magnético nas ações. Briefing baixado com conteúdo validado; envio continua desabilitado e explicado.
6. WebGL ao vivo no mobile e fallbacks úteis para movimento reduzido ou WebGL ausente. Posters responsivos capturados da própria cena, com controles ocultos, preservam composição e cores.
7. Axe na página e no diálogo aberto: zero violações nos conjuntos WCAG 2 A/AA, 2.1 AA e 2.2 AA analisados. Seleção de texto preservada e cursor padrão confirmado. Sem erros de hidratação na preferência reduzida.

O hook compartilhado de movimento reduzido usa `useSyncExternalStore`: seu snapshot de servidor evita divergência de HTML e o listener acompanha mudanças na preferência. A espera pelo retorno de foco considera o ciclo assíncrono da primitiva Base UI. O header considera a entrada real da segunda seção, inclusive quando ela é centralizada pelo navegador.

`21st review` foi executado: informou literais de cor em materiais/máscaras/metadata e os avisos existentes nas primitivas herdadas sobre `disabled:pointer-events-none`. Os valores do processo vêm dos tokens; a Hero atual usa apenas azul e violeta oficiais. O estado desabilitado tem explicação persistente, sem depender de tooltip. `npm audit` não apontou vulnerabilidades.

## Limites e pendências

Não foram medidos Core Web Vitals de campo nem desempenho em aparelhos físicos. Não se atribui nota Lighthouse sem auditoria. Axe não representa certificação nem substitui leitor de tela e revisão humana. Safari/iOS ainda precisam de verificação em dispositivos reais.

Domínio de produção, destino do formulário, política de privacidade e cases aprovados continuam pendentes. Não foram importados preços ou contatos do site usado como referência visual. Envio desabilitado; briefing local sem transmissão ou persistência. Canonical e sitemap dependem da variável do domínio. Copy e processo continuam editáveis para aprovação comercial.

O gate visual genérico da skill não é apresentado como aprovado: na primeira versão encerrou com código 2 sem sumário consolidado. Suas regras de fotografia obrigatória, proibição de violeta/WebGL para estúdios e altura idêntica de todas as seções conflitam com o briefing. O aceite desta revisão se apoia nas jornadas de produção, Axe e inspeção visual acima.

## Liquid glass — histórico da revisão 03

Material aplicado a 40 superfícies na Home: header, menu, serviços, tecnologias, projeto vazio, etapas, estúdio, campos, ações, formulário e diálogo. `src/styles/liquid-glass.css` concentra tintas, bordas, brilho e blur usando a paleta Untold. A seleção de texto e o foco permanecem disponíveis. Reflexos usam um listener delegado com cleanup; nenhum Canvas foi acrescentado. A faixa animada de tecnologias usa reflexo estático para evitar blur contínuo por tile.

Build aprovado; revisão visual em desktop e mobile, sem overflow. Capturas: `liquid-services-1440.png`, `liquid-dialog-1440.png` e `liquid-contact-390.png`. As mesmas sete jornadas funcionais e a auditoria Axe da página e do diálogo foram repetidas para verificar os controles e o contraste após a mudança. O material também prevê transparência reduzida, ausência de backdrop-filter e forced-colors; esses caminhos têm fallback CSS e não constituem teste em aparelho físico.

## Otimização e minimalismo — revisão 04

- Mobile: nenhum GLB, Canvas ou contexto WebGL inicial. O botão de ativação inicia a cena opcional. Desktop compatível recebe carregamento adiado, cancelado se a hero sair da tela. Economia de dados e dispositivos limitados também usam ativação manual.
- Cena manual mobile: DPR 1, limite de 20 fps, 2 amostras de transmissão, buffer 192, ambiente 64 e 3 camadas de aurora; desktop mantém 30 fps e qualidade superior. Pausa/offscreen continuam funcionando.
- Blur restrito a superfícies flutuantes. Foram removidos reflexos globais ao ponteiro e vidros aninhados. Um loop nativo de RAF do slider só existe enquanto estiver visível, ativo e sem movimento reduzido.
- Processo sem estágio de scroll ou hooks de scroll no mobile / reduced motion. A coreografia permanece no desktop.
- Escala de UI derivada dos tokens oficiais: corpo 16 px, labels 14 px, campos 44 px, raio de controle 12 px e de painel 20 px. Gerador reproduzível `scripts/sync-ui-tokens.mjs`. Ações mantêm os estados Elétrico / hover / pressed e foco de 2 px.
- Layout, oito jornadas Playwright e Axe na página e no diálogo aprovados. Novo teste garante ausência de carregamento 3D antes da ativação e confere controles de 44 px / labels de 14 px.

Medição comparável do export local (Chromium, contexto novo, 390×844, toque, DPR 2, espera de 3,5 s, sem compressão no servidor): JavaScript inicial de **1.767.126 para 714.704 bytes, redução de 59,6%**; requisições GLB de 1 para 0; Canvas de 1 para 0; elementos com backdrop-filter computado de 53 para 1 (contagem no DOM sem dialog aberto, incluindo header inicialmente oculto). É uma medida de recursos e não de FPS ou de desempenho real em todos os aparelhos. Dados em `mobile-performance.json`, reprodução em `scripts/measure-mobile.mjs`.

## Luz e movimento — revisão 05

Aurora retirada por decisão explícita do usuário. Shader real Color Bends adaptado à mesma cena R3F do vidro, com azul/violeta oficiais e conversão de cor para o pipeline de transmissão. Posters desktop/mobile regenerados da cena final (aproximadamente 25/10 KB). O shader antigo foi retirado.

TextEffect por palavras no manifesto desktop; texto estático no mobile e com movimento reduzido. MagicCard recebe luz e inclinação de até 2 graus; toque e movimento reduzido desativam o efeito. Nenhum case foi inventado: o estado vazio e o contrato dos futuros cards usam a mesma primitiva.

O processo desktop usa uma única timeline GSAP/ScrollTrigger importada ao aproximar a seção, com cleanup de contexto. Mobile continua sem esse estágio. O teste verifica também o alinhamento da última palavra, a mudança para Cloud e a preferência reduzida durante a visita. A nona jornada confirma iluminação, teclado e desativação dos efeitos nos cards. Capturas revisadas: `process-white.png`, `project-lighting-1440.png` e os novos posters `public/models/untold-lights-*.webp`.

Medição inicial mobile desta revisão: **712.547 bytes de JavaScript**, seis requisições JS, zero GLB, zero Canvas, uma superfície com blur e nenhum overflow. Medida local comparável, sem compressão e sem representar CWV de campo. O 3D continua opcional no celular. Fontes/licenças e indisponibilidade do repositório Aceternity estão documentadas em `motion-selection.md`.

Revisão final: build de produção com TypeScript aprovado; `npm audit --omit=dev` sem vulnerabilidades. `21st review` encontrou oito avisos informativos de cores de iluminação/material 3D e dois avisos herdados sobre ponteiro em controles desabilitados, sem bloqueios novos. Inspeção de console da Home: zero erros. Capturas finais adicionais: `hero-lights-1440.png` e `hero-lights-390.png`.
