# Untold — Creative digital studio

Site institucional em português, com Next.js App Router, React, TypeScript e abertura imersiva Glass + Aurora feita com React Three Fiber. Na revisão 02, a hero mostra apenas a aurora multicolorida e a logo centralizada; o header compacto e translúcido surge na segunda seção. A marca e os tokens vêm do design system oficial.

## Executar

```bash
npm ci
npm run dev
```

Abra http://localhost:3000. Node 22+ recomendado. Em máquinas com libvips global, instale com `SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm ci` para usar o binário compatível de Sharp.

```bash
npm run typecheck
npm run build
```

O build produz `out/`, pronto para hospedagem estática. Para conferir a versão de produção: `python -m http.server 3000 --directory out`. `npm start` abre o export em um servidor estático local com Python. Na hospedagem, publique apenas o conteúdo de `out/`.

Antes de publicar, defina `NEXT_PUBLIC_SITE_URL` com o domínio oficial e gere novamente o build. Sem domínio configurado, canonical é omitido, sitemap fica vazio e indexação permanece desabilitada, evitando publicar um domínio inventado. Open Graph local usa localhost como base até essa configuração.

## Organização

- `src/app`: layout, metadata, Home, robots e sitemap.
- `src/styles`: tokens oficiais publicados, CSS semântico e material compartilhado `liquid-glass.css`.
- `src/components/ui`: Button, Input e Textarea da biblioteca Untold; variantes de Button extraídas para uso em links no servidor.
- `src/components/sections`: conteúdo e composições independentes, incluindo capítulo de processo com scroll e tecnologias.
- `src/components/core`: InfiniteSlider, Magnetic e MorphingDialog adaptados de Motion Primitives.
- `src/components/magicui`: BlurFade reutilizado do Magic UI.
- `src/components/three`: cena, material, shader da aurora, qualidade, fallback e limite de erro.
- `src/content/site.ts`: serviços, processo, navegação e contratos dos cases.
- `public/brand`: arquivos oficiais com nomes normalizados.
- `public/models`: GLB e previews WebP destinados ao navegador.
- `source/3d/untold-glass.blend`: fonte editável, **não publicada**.
- `scripts`: reprodução de modelagem e derivação de ícones/OG.
- `tests`: jornadas e proteções essenciais no navegador.

## Modelo e assets

```bash
npm run model
node scripts/prepare-brand.mjs
# Com o preview aberto, atualize os posters da hero após alterar a cena:
node scripts/capture-hero-fallbacks.mjs
```

Requer Blender com `bpy` (validado em 5.2.2 LTS). O script lê os dois paths do SVG original, reconstrói seus Beziers sem aproximação poligonal manual, extruda, aplica bevel e materiais, exporta só a geometria selecionada e reimporta o GLB em cena separada. O relatório confere dimensões, normais e topologia, soldando apenas uma cópia de validação dos vértices separados pelo formato glTF. Luzes e câmera de prévia ficam no `.blend`. Os arquivos recebidos em `logos/` permanecem preservados.

O detalhe de dobra é uma segunda malha, seguindo o segundo path oficial. O corpo tem silhueta contínua; não é um booleano de letras genéricas. O material Blender é exportável, mas o navegador substitui o material por transmissão avançada que enxerga a aurora no buffer da cena.

## Decisões técnicas

Server Components para estrutura e seções estáticas; ilhas client para menu, briefing, motion e WebGL. A cena pesada é carregada dinamicamente após verificar suporte. Uma única Canvas, sem vídeo, HDRI externo ou engine de scroll. DPR, samples e resolução menores no mobile. A renderização é limitada a 30 quadros por segundo e para quando a hero sai da área visível, a aba está oculta ou o usuário pausa. Falha de contexto, erro de carregamento, economia de dados e movimento reduzido preservam o poster e a navegação.

Os recursos declarativos Three são geridos pelo R3F. Geometrias do cache `useGLTF` permanecem compartilhadas (`dispose={null}`); não são destruídas enquanto o cache as referencia. Observers e listeners de UI possuem cleanup.

## Conteúdo e integrações pendentes

Não há cases reais publicados, e-mail comercial ou backend fornecidos. O formulário prepara um arquivo `.txt` por download local; não envia nem persiste dados, e não simula sucesso. O botão de envio está desabilitado. Conectar um destino real, revisar privacidade e substituir esse estado antes do lançamento comercial.

A copy e o processo são proposta editável, não slogan ou processo oficial aprovado. Adicione cases reais em `projects` somente com autorização e imagens fornecidas. Domínio, contatos e perfis sociais precisam de confirmação. Não há publicação, commits nem alteração dos arquivos originais da marca nesta entrega.

## Verificação

```bash
CHROMIUM_PATH=/usr/bin/chromium npm test
```

Com o servidor aberto na porta 3000. Os testes verificam GLB, console, navegação, serviços, download local, tamanhos de tela, menu/teclado, reduced motion, ausência de WebGL, assets, labels e proteção do `.blend`. Resultados e limites em [docs/validation.md](docs/validation.md); capturas em `docs/screenshots`.

As referências e adaptações da revisão 02 estão em [docs/animation-sources.md](docs/animation-sources.md). Motion é compartilhado entre os efeitos; o Dialog continua usando Base UI da Untold.

Veja também [auditoria da marca](docs/brand-audit.md) e [pesquisa visual](docs/visual-research.md).

A revisão 03 aplica liquid glass aos painéis e controles com `liquid-glass`, sem nova biblioteca. O material tem tokens claros/escuros, brilho ao ponteiro, blur menor no mobile e fallback para `prefers-reduced-transparency` / alto contraste. Logos e tipografia permanecem originais.
