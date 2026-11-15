untold — Site do estúdio

HTML, CSS e JavaScript, com Three.js para a escultura original da marca.
As fontes, símbolos e cores vêm da identidade aprovada neste projeto.

RODAR
npm install
npm run build
npm run dev
Abra o endereço Local impresso pelo servidor.

ESTRUTURA
public/             HTML, estilos e arquivos próprios da marca
src/scene.js        Objeto 3D, luzes, rotação e fallback
src/experiments.js  Estudos interativos Campo, Forma e Ritmo
src/app.js          Navegação, diálogos, movimento e briefing
dist/               Site pronto para hospedar
.openai/hosting.json Identidade da publicação Sites

CONTATO
Contatos confirmados no site oficial https://untold.com.br/ em 15/11/2026:
WhatsApp: +55 28 92003-6176. E-mail: untold344@gmail.com.
O formulário prepara um briefing e abre a conversa no WhatsApp correto.
O visitante revisa e confirma o envio pelo próprio WhatsApp.
Há e-mail como alternativa e a opção de baixar o briefing.

Para trocar o contato comercial, atualize public/contact.json:
{"email":"seu endereço comercial real","whatsapp":null}
ou {"email":null,"whatsapp":"seu número comercial com país e DDD"}.
Depois execute npm run build e publique a nova versão.
O site abre um rascunho no aplicativo de e-mail ou a conversa no WhatsApp;
o visitante confirma o envio no serviço escolhido.

EXPERIMENTOS
São estudos originais do estúdio, não clientes ou trabalhos comerciais inventados.
As três experiências têm endereço compartilhável com ?experimento=campo,
?experimento=forma ou ?experimento=ritmo. ?contato=1 abre o briefing.

MOVIMENTO E ACESSO
Há controle de pausa, preferência de movimento reduzido e imagens vetoriais
de fallback. O objeto 3D usa uma única superfície WebGL, sem biblioteca de
rolagem. As animações são reduzidas em celulares e telas com toque.
Menu e experiências usam o elemento dialog com teclado e Escape.

FONTES E CÓDIGO DE APOIO
Outfit e IBM Plex Mono: licenças OFL em public/assets/fonts.
Three.js: dependência MIT. Camadas de microinteração e word-highlight
adaptadas ao sistema da marca a partir do taste-skill instalado no ambiente.
O catálogo 21st foi consultado; não havia autenticação para recuperar componentes.

As referências de direção foram Active Theory, Lusion, Raycast e Spline.
O código, a marca, o objeto e os experimentos são próprios deste projeto.
