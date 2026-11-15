import {mountExperiment,studyInfo} from './experiments.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=false;
try{motionPaused=localStorage.getItem('untold-motion')==='paused';}catch{}
const controllers=[];
const motionButtons=[...document.querySelectorAll('[data-motion-toggle]')];
function updateMotion(){
 document.documentElement.dataset.animation=motionPaused||reduced.matches?'paused':'running';
 motionButtons.forEach(button=>{
  button.setAttribute('aria-pressed',String(motionPaused));button.setAttribute('aria-label',motionPaused?'Ativar movimento':'Pausar movimento');
  if(button.classList.contains('text-button'))button.innerHTML=`${motionPaused?'Ativar movimento':'Pausar movimento'} <span aria-hidden="true">${motionPaused?'▷':'Ⅱ'}</span>`;
  else button.innerHTML=motionPaused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 9 6-9 6Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>';
 });
 controllers.forEach(c=>c.pause?.());
}
motionButtons.forEach(button=>button.addEventListener('click',()=>{motionPaused=!motionPaused;try{localStorage.setItem('untold-motion',motionPaused?'paused':'running');}catch{}updateMotion();}));
reduced.addEventListener('change',updateMotion);updateMotion();
const isPaused=()=>motionPaused||reduced.matches||!!document.querySelector('dialog[open]');

// Native dialogs provide focus containment, Escape handling and inert background content.
const menu=document.getElementById('menu-dialog'),menuToggle=document.querySelector('.menu-toggle');
menuToggle.addEventListener('click',()=>{menu.showModal();menuToggle.setAttribute('aria-expanded','true');});
document.querySelector('.close-menu').addEventListener('click',()=>menu.close());
menu.addEventListener('close',()=>menuToggle.setAttribute('aria-expanded','false'));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));

const studyDialog=document.getElementById('study-dialog');let detail=null,detailPaused=false,studyOrigin=null;
document.querySelectorAll('[data-study]').forEach(button=>button.addEventListener('click',()=>{
 const type=button.dataset.study,info=studyInfo[type];studyOrigin=button;
 const url=new URL(location.href);url.searchParams.set('experimento',type);history.replaceState(null,'',url);
 document.getElementById('study-dialog-title').textContent=info.name;
 document.getElementById('study-dialog-description').textContent=info.description;
 const canvas=document.getElementById('detail-canvas');canvas.setAttribute('aria-label',info.description);
 document.getElementById('intensity').value='55';detailPaused=false;setDetailPause();studyDialog.showModal();
 detail?.destroy();detail=mountExperiment(canvas,type,{isPaused,reduced,detail:true});
}));
document.querySelector('[data-close-study]').addEventListener('click',()=>studyDialog.close());
studyDialog.addEventListener('close',()=>{detail?.destroy();detail=null;const url=new URL(location.href);url.searchParams.delete('experimento');history.replaceState(null,'',url);studyOrigin?.focus();});
document.getElementById('intensity').addEventListener('input',event=>detail?.setIntensity(Number(event.target.value)));
document.getElementById('reset-experiment').addEventListener('click',()=>{document.getElementById('intensity').value='55';detail?.reset();});
function setDetailPause(){const button=document.getElementById('detail-pause');button.setAttribute('aria-pressed',String(detailPaused));button.setAttribute('aria-label',detailPaused?'Ativar experimento':'Pausar experimento');button.innerHTML=detailPaused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 9 6-9 6Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>';}
document.getElementById('detail-pause').addEventListener('click',()=>{detailPaused=!detailPaused;detail?.pause(detailPaused);setDetailPause();});

const contactDialog=document.getElementById('contact-dialog');let contactOrigin=null,downloadURL='';
document.querySelectorAll('[data-contact]').forEach(button=>button.addEventListener('click',()=>{contactOrigin=menu.contains(button)?menuToggle:button;if(menu.open)menu.close();const url=new URL(location.href);url.searchParams.set('contato','1');history.replaceState(null,'',url);contactDialog.showModal();}));
document.querySelector('[data-close-contact]').addEventListener('click',()=>contactDialog.close());
contactDialog.addEventListener('close',()=>{const url=new URL(location.href);url.searchParams.delete('contato');history.replaceState(null,'',url);contactOrigin?.focus({preventScroll:true});});
for(const dialog of [contactDialog,studyDialog])dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});

// A destination is only enabled when supplied by the owner. No invented email address or fake send.
const contactConfig=await fetch('/contact.json').then(r=>r.ok?r.json():{}).catch(()=>({}));
const form=document.getElementById('contact-form'),status=document.getElementById('form-status');
const useWhatsapp=!!contactConfig.whatsapp&&contactConfig.primary!=='email';
if(useWhatsapp){document.getElementById('contact-submit').firstChild.textContent='Continuar no WhatsApp ';document.getElementById('contact-method').textContent='Revise seu briefing e confirme o envio no WhatsApp.';}
else if(contactConfig.email){document.getElementById('contact-submit').firstChild.textContent='Preparar e-mail ';document.getElementById('contact-method').textContent='A mensagem será aberta no seu aplicativo de e-mail.';}
else{document.getElementById('contact-submit').firstChild.textContent='Preparar briefing ';document.getElementById('contact-method').textContent='Você pode preparar e salvar seu briefing.';}
form.addEventListener('submit',async event=>{
 event.preventDefault();status.textContent='';
 const name=form.elements.name.value.trim(),email=form.elements.email.value.trim(),message=form.elements.message.value.trim(),kind=form.elements.kind.value;
 const errors={name:name.length<2?'Escreva seu nome.':'',email:!/^\S+@\S+\.\S+$/.test(email)?'Escreva um e-mail válido.':'',message:message.length<12?'Conte um pouco mais sobre o projeto.':''};
 for(const [key,error]of Object.entries(errors)){const input=form.elements[key];document.getElementById(key+'-error').textContent=error;input.setAttribute('aria-invalid',String(!!error));input.setAttribute('aria-describedby',key+'-error');}
 const first=Object.keys(errors).find(key=>errors[key]);if(first){form.elements[first].focus();return;}
 const brief=`Olá, untold!\n\nMeu nome é ${name}.\nE-mail: ${email}\nProjeto: ${kind}\n\n${message}\n`;
 if(useWhatsapp){const target=`https://wa.me/${contactConfig.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(brief)}`;window.open(target,'_blank','noopener,noreferrer');status.textContent='Revise seu briefing no WhatsApp e confirme o envio por lá.';const channel=document.getElementById('contact-channel-link');channel.href=target;channel.hidden=false;}
 else if(contactConfig.email){location.href=`mailto:${encodeURIComponent(contactConfig.email)}?subject=${encodeURIComponent('Um próximo capítulo — '+kind)}&body=${encodeURIComponent(brief)}`;status.textContent='Seu aplicativo de e-mail foi acionado. Revise e envie a mensagem por ele.';}
 else{
  let copied=false;try{await navigator.clipboard.writeText(brief);copied=true;}catch{}
  status.textContent=copied?'Seu briefing foi copiado. Você também pode salvar uma versão em texto.':'Seu briefing está pronto para baixar.';
 }
 if(downloadURL)URL.revokeObjectURL(downloadURL);downloadURL=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'}));
 const download=document.getElementById('brief-download');download.href=downloadURL;download.download='meu-projeto-untold.txt';download.hidden=false;
});
await Promise.allSettled([document.fonts.ready,document.fonts.load('700 64px Outfit')]);
document.querySelectorAll('[data-experiment]').forEach(canvas=>controllers.push(mountExperiment(canvas,canvas.dataset.experiment,{isPaused,reduced})));
document.getElementById('hero-visual').dataset.sceneState='poster';
window.__untoldReady=true;
const initialParams=new URLSearchParams(location.search);
if(initialParams.get('contato')==='1')document.querySelector('[data-contact]').click();
else if(studyInfo[initialParams.get('experimento')])document.querySelector(`[data-study="${initialParams.get('experimento')}"]`).click();
let brandPromise;
function startBrand(){
 if(brandPromise)return brandPromise;
 brandPromise=(async()=>{
  if(reduced.matches||matchMedia('(max-width: 639px), (pointer: coarse)').matches){const canvas=document.getElementById('brand-canvas');canvas.tabIndex=-1;canvas.setAttribute('aria-hidden','true');}
  else try{const {mountBrandScene}=await import('./scene.js');controllers.push(await mountBrandScene(document.getElementById('brand-canvas'),document.getElementById('hero-visual'),{isPaused,reduced}));}catch(error){document.getElementById('hero-visual').dataset.sceneState='poster';console.warn('untold: visual estático ativado.',error.message);}
  window.__untoldVisualReady=true;
 })();return brandPromise;
}
if(contactDialog.open||studyDialog.open){
 const resumeBrand=()=>{if(!contactDialog.open&&!studyDialog.open)startBrand();};
 contactDialog.addEventListener('close',resumeBrand,{once:true});studyDialog.addEventListener('close',resumeBrand,{once:true});
}else startBrand();
window.addEventListener('pagehide',event=>{if(event.persisted)return;controllers.forEach(c=>c.destroy?.());detail?.destroy();if(downloadURL)URL.revokeObjectURL(downloadURL);});
