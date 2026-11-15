import {readFile,writeFile} from 'node:fs/promises';
let html=await readFile('public/index.html','utf8');
const replacements=[
 ['<span class="footer-discipline">Design + desenvolvimento de sites</span>','<nav class="footer-socials" aria-label="Redes e contato"><a href="mailto:untold344@gmail.com">E-mail</a><a href="https://www.instagram.com/untold_wd/" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://wa.me/5528920036176" target="_blank" rel="noopener noreferrer">WhatsApp</a></nav>'],
 ['</svg></button></div></div>\n    <a class="footer-wordmark"','</svg></button><a class="contact-direct" href="https://wa.me/5528920036176?text=Ol%C3%A1%2C%20untold!%20Quero%20conversar%20sobre%20um%20site." target="_blank" rel="noopener noreferrer">Conversar direto no WhatsApp ↗</a></div></div>\n    <a class="footer-wordmark"'],
 ['<a id="brief-download" class="link" hidden>','<div class="contact-links"><a id="contact-channel-link" class="link" hidden target="_blank" rel="noopener noreferrer">Abrir conversa no WhatsApp</a><a id="brief-download" class="link" hidden>'],
 ['Baixar briefing em texto</a></form>','Baixar briefing em texto</a></div></form>'],
 ['Você pode preparar e salvar seu briefing.','Revise seu briefing e confirme o envio no WhatsApp.'],
 ['id="contact-submit">Preparar briefing ','id="contact-submit">Continuar no WhatsApp ']
];
for(const [from,to]of replacements){if(html.includes(from))html=html.replace(from,to);else if(!html.includes(to))throw new Error('Contact template changed: '+from);}
await writeFile('public/index.html',html);
console.log('Official WhatsApp, email and Instagram connected from untold.com.br.');
