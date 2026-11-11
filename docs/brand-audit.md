# Auditoria da identidade — 11/11/2026

## Evidências

Fonte prioritária: https://design-system-untold.vercel.app/. O HTML foi recuperado via HTTP; o catálogo foi aberto em Chromium e todas as rotas de documentação foram visitadas: overview, brand, getting-started, colors, typography, geometry, actions, forms, selection, navigation, data, feedback, overlays, conversation, recipes e guidelines. A ferramenta de busca não conseguia acessar o endereço; o navegador funcionou.

Também foi localizada a biblioteca em `/home/dev/untold/design-system`. Seu `DESIGN.md`, tokens, catálogo e componentes foram inspecionados. Os tokens publicados diferem em alguns detalhes dos locais: `src/styles/tokens.json` preserva **o download do site oficial**, que tem prioridade. O CSS semântico deriva desse contrato.

## Regras efetivamente encontradas

- Manrope variável: títulos 600, corpo 400, controles 600. Manual: títulos 48–72 px; corpo 16–18 px; controles 14–16 px. O catálogo acrescenta escalas menores para interfaces densas.
- Elétrico `#2563FF`, Violeta `#8B5CF6`, Dobra `#6443CB`, Ink `#10111A`, Cloud `#F7F8FC`. Secundários Slate `#595D70` / dark `#B4B8C9`.
- Gradiente pertence ao símbolo e elementos gráficos; não aplicar em texto pequeno.
- Proteção x = ¼ da largura visível do símbolo. Mínimos: horizontal 120 px, vertical 96 px, símbolo 24 px. O catálogo cita simplificação monocromática em 16 px, mas não fornece esse desenho específico.
- Não redigitar, esticar, alterar gradiente ou reorganizar a assinatura. A rotação da marca institucional permanece proibida; a pequena orientação espacial da escultura é uma exploração expressamente solicitada pelo briefing, não uma nova regra da identidade.
- Espaçamento base 4 px, escala 4/8/12/16/24/32/48/64/96; raios 4/8/12/20/24/32/pill. Botões 44 px, destaque 52 px. Controles com foco visível e labels.
- Movimento de interface 120/180/240 ms, easing `cubic-bezier(.2,0,0,1)`. A cena orgânica e os reveals mais longos são uma extensão específica deste site, autorizada pelo briefing.
- Tom direto, próximo, claro e preciso; sem promessas de vendas, prazo ou resultado.

Raios, espaçamento, estados, semânticos de status e API de componentes são extensões do design system, não regras originais do manual. Essa distinção é expressa pelo próprio catálogo.

## Inventário local e uso

| Original                             | Conteúdo observado                          | Destino                                              |
| ------------------------------------ | ------------------------------------------- | ---------------------------------------------------- |
| `logos/ Vetor editável.svg`          | símbolo isolado, duas curvas: corpo e dobra | geometria Blender, reprodução exata dos comandos SVG |
| `logos/ Horizontal.svg`              | símbolo em gradiente e lettering branco     | assinatura para fundo escuro                         |
| `logos/ Dark.svg`                    | assinatura vertical clara sobre dark        | `public/brand/logo-vertical-dark.svg`                |
| `logos/ Principal clara.svg`         | assinatura vertical para fundo claro        | seção Estúdio                                        |
| `logos/ Monocromática positiva.svg`  | assinatura preta                            | disponível em `public/brand`                         |
| `logos/ Monocromática negativa.svg`  | assinatura branca                           | disponível em `public/brand`                         |
| PNGs homônimos                       | versões raster da marca                     | preservados na origem                                |
| `logos/logo.blend`, `logos/logo.glb` | modelos recebidos                           | preservados, não sobrescritos                        |
| biblioteca `/public/brand`           | símbolo, horizontal para claro e dark       | SVGs reutilizados em header, footer e ícones         |

A horizontal clara da biblioteca troca apenas a cor das letras para Ink, conforme explicado no catálogo. A área de proteção dos SVGs foi mantida. O `.blend` novo fica em `source/3d/`, fora da pasta publicada, conforme a ressalva do pedido. Não foi criada uma nova silhueta para a marca.

## Lacunas e decisões editoriais

Não foram fornecidos cases aprovados, clientes, resultados, equipe, endereço, domínio de produção, redes ou e-mail oficial. Não se extraiu dados comerciais de diretórios vizinhos. O portfólio fica vazio; o envio fica desabilitado. Os serviços principais vêm do briefing; os desdobramentos e o processo são proposta editorial editável em `src/content/site.ts`, sujeitos à validação comercial. A headline é copy exploratória para esta versão, não slogan oficial. Não se usa símbolo de marca registrada.

O hero Glass + Aurora é uma aplicação especial pedida pelo usuário. As regras genéricas da skill visual que vetam violeta, WebGL para estúdios ou exigem fotos são inaplicáveis diante deste briefing e da identidade oficial.
