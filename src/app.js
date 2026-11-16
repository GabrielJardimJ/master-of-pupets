const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const controllers=[];
// Native dialogs provide focus containment, Escape handling and inert background content.
const menu=document.getElementById('menu-dialog'),menuToggle=document.querySelector('.menu-toggle');
menuToggle.addEventListener('click',()=>{menu.showModal();menuToggle.setAttribute('aria-expanded','true');});
document.querySelector('.close-menu').addEventListener('click',()=>menu.close());
menu.addEventListener('close',()=>menuToggle.setAttribute('aria-expanded','false'));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));

const contactDialog=document.getElementById('contact-dialog');let contactOrigin=null,downloadURL='';
document.querySelectorAll('[data-contact]').forEach(button=>button.addEventListener('click',()=>{contactOrigin=menu.contains(button)?menuToggle:button;if(menu.open)menu.close();const url=new URL(location.href);url.searchParams.set('contato','1');history.replaceState(null,'',url);contactDialog.showModal();}));
document.querySelector('[data-close-contact]').addEventListener('click',()=>contactDialog.close());
contactDialog.addEventListener('close',()=>{const url=new URL(location.href);url.searchParams.delete('contato');history.replaceState(null,'',url);contactOrigin?.focus({preventScroll:true});});
for(const dialog of [contactDialog])dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});

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
const stage=document.getElementById('hero-visual');
window.__untoldReady=true;
const initialParams=new URLSearchParams(location.search);
if(initialParams.get('contato')==='1')document.querySelector('[data-contact]').click();
if(stage){
 stage.dataset.sceneState='poster';
 try{
  const {mountBrandScene}=await import('./scene.js');
  controllers.push(await mountBrandScene(document.getElementById('brand-canvas'),stage,{reduced}));
 }catch(error){console.warn('untold: visual estático ativado.',error.message);}
}
window.__untoldVisualReady=true;
window.addEventListener('pagehide',event=>{if(event.persisted)return;controllers.forEach(c=>c.destroy?.());if(downloadURL)URL.revokeObjectURL(downloadURL);});
