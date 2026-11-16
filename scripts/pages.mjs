import {readFile,writeFile} from 'node:fs/promises';

// Internal pages share the home page's navigation, footer and contact dialog.
// Edit their content in src/pages; edit shared sections in public/index.html.
export async function buildPages(){
 const home=await readFile('public/index.html','utf8');
 const section=id=>{
  const match=home.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`));
  if(!match)throw new Error(`Shared section missing: ${id}`);
  return match[0];
 };
 const pages=[
  {slug:'estudio',title:'O estúdio',description:'Conheça a untold. Design e desenvolvimento de sites com a assinatura da sua marca.'},
  {slug:'projetos',title:'Nossos projetos',description:'O espaço dos projetos da untold. Ainda não temos projetos para mostrar. O primeiro pode começar com a sua ideia.'},
  {slug:'processo',title:'Nosso processo',description:'Da primeira conversa à publicação: conheça as etapas de direção, design e desenvolvimento da untold.'},
  {slug:'contato',title:'Vamos conversar',description:'Conte sua ideia para a untold. Converse pelo WhatsApp, envie um e-mail ou prepare o briefing do seu site.'},
 ];
 for(const page of pages){
  let content=await readFile(`src/pages/${page.slug}.html`,'utf8');
  for(const id of ['estudio','projetos','processo']){
   content=content.replace(`{{${id}}}`,()=>section(id).replace(/<h2 id=/,'<h1 id=').replace(/<\/h2>/,'</h1>'));
  }
  // A page must contain its own main content, even when opened directly.
  let html=home.replace(/<main[\s\S]*?<\/main>/,`<main id="inicio" class="inner-page inner-page--${page.slug}" tabindex="-1">\n${content}\n</main>`);
  html=html.replace(/<title>.*?<\/title>/,`<title>${page.title} — untold</title>`)
   .replace(/(<meta name="description" content=")[^"]*/,`$1${page.description}`)
   .replace(/(<meta property="og:title" content=")[^"]*/,`$1${page.title} — untold`)
   .replace(/(<meta property="og:description" content=")[^"]*/,`$1${page.description}`)
   .replaceAll(`href="/${page.slug}.html"`,`href="/${page.slug}.html" aria-current="page"`);
  // The shared footer is a compact sign-off on internal pages.
  html=html.replace('class="closing footer--dark"','class="closing closing--compact footer--dark"');
  await writeFile(`dist/${page.slug}.html`,html);
 }
}
