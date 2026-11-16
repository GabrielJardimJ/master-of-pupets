untold — Site do estúdio

RODAR
npm install
npm run build
npm run dev
Abra http://127.0.0.1:5173/.

PÁGINAS
/                Início
/estudio.html    Estúdio e serviços
/projetos.html   Área de projetos, ainda sem projetos publicados
/processo.html   Direção, design, código e publicação
/contato.html    WhatsApp, e-mail e convite para preparar um briefing

EDIÇÃO
public/index.html       Início, navegação, rodapé e diálogo de contato
src/pages/*.html        Conteúdo das páginas internas
scripts/pages.mjs       Montagem das páginas e metadados
public/styles.css       Estilos compartilhados e responsivos
src/scene.js            Escultura 3D estática, renderizada ao carregar e redimensionar
src/app.js              Menu, contato e carregamento da escultura
public/contact.json     Configuração do formulário de contato

As páginas internas reutilizam as seções correspondentes do início, além de
seu conteúdo próprio. Altere os trechos {{estudio}}, {{projetos}} e {{processo}}
em public/index.html. Execute npm run build após editar qualquer fonte.
O servidor local serve dist/, que contém o site pronto para hospedar.

VERCEL
vercel.json define o build como npm run build e a saída como dist/.
As páginas internas e assets/app.js são gerados durante o build e não
existem na pasta public/. Publicar public/ causa erro 404 nesses arquivos.
As URLs mantêm a extensão .html, conforme os links da navegação.
O push para a main do repositório conectado dispara a publicação automática.

CONTATO
WhatsApp configurado: +55 28 92003-6176.
E-mail: untold344@gmail.com. Instagram: untold_wd.
O formulário prepara um briefing e abre o WhatsApp. O visitante revisa e
confirma o envio no próprio serviço. O briefing também pode ser baixado.
Ao trocar o contato comercial, atualize public/contact.json e os links
comerciais em public/index.html e src/pages/contato.html.

VISUAL E ACESSO
Identidade original da pasta ../untold: Ink #0B0D0C, Paper #F3F2EC,
Volt #D7FF3F, Outfit e IBM Plex Mono. Serviços seguem as mesmas colunas
do título e da introdução. A escultura não gira, não reage ao mouse e não
tem controles de pausa. Celulares, movimento reduzido e falhas de WebGL
usam a arte vetorial estática. Menu e briefing usam dialog nativo.
A área de projetos apresenta um estado vazio e um link real para o WhatsApp.

VERIFICAR
npm run check
npm test (com o servidor local em execução)
O teste usa Edge isolado e intercepta o contato: nenhuma mensagem é enviada.
Capturas e resultados são gravados em qa/.

CRÉDITOS
Outfit e IBM Plex Mono: licenças OFL em public/assets/fonts.
Three.js: MIT. Microinterações e word-highlight adaptados do taste-skill.
O catálogo 21st foi consultado, mas o CLI não conseguiu acessar o registro
de pacotes. Os componentes e recursos originais do projeto foram reutilizados.
