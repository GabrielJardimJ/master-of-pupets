// Isolated Edge checks. Contact navigation is intercepted; no message is sent.
import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[],errors=[];
await mkdir('qa',{recursive:true});
try{
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await context.newPage();page.setDefaultTimeout(12000);
 const screenshot=async options=>{
  await page.locator('img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
  await page.evaluate(()=>Promise.all([...document.images].map(image=>image.decode().catch(()=>{}))));
  await page.screenshot(options);
 };
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.open=url=>{window.__testWhatsappTarget=url;return null;};});
 const origin='http://127.0.0.1:5173';
 await page.goto(origin,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>window.__untoldVisualReady===true,null,{timeout:45000});
 assert.ok(['static','poster'].includes(await page.locator('#hero-visual').getAttribute('data-scene-state')));
 assert.equal(await page.locator('[data-motion-toggle],#detail-pause,[data-study]').count(),0);
 assert.equal(await page.getByRole('button',{name:/pausar|pause|ativar movimento/i}).count(),0);
 assert.equal(await page.locator('#brand-canvas').getAttribute('tabindex'),null);
 if(await page.locator('#hero-visual').getAttribute('data-scene-state')==='static'){
  const canvas=page.locator('#brand-canvas');
  const before=await canvas.screenshot();
  const box=await canvas.boundingBox();
  await page.mouse.move(box.x+box.width*.4,box.y+box.height*.4);
  await page.mouse.down();await page.mouse.move(box.x+box.width*.7,box.y+box.height*.6,{steps:12});await page.mouse.up();
  await page.waitForTimeout(1200);
  assert.deepEqual(await canvas.screenshot(),before,'Sculpture must stay identical after time and pointer movement');
  results.push('The real 3D render stays identical over time and after pointer dragging.');
 }
 const aligned=await page.evaluate(()=>{
  const x=selector=>document.querySelector(selector).getBoundingClientRect().x;
  return {title:x('#studio-h'),service:x('.service-row h3'),intro:x('.studio-intro'),description:x('.service-row p')};
 });
 assert.ok(Math.abs(aligned.title-aligned.service)<1,JSON.stringify(aligned));
 assert.ok(Math.abs(aligned.intro-aligned.description)<1,JSON.stringify(aligned));
 results.push('Service titles align with the section title; descriptions align with the introduction.');
 assert.ok((await page.locator('.projects-empty').innerText()).includes('Ainda não temos projetos'));
 assert.ok((await page.locator('.projects-empty a').getAttribute('href')).startsWith('https://wa.me/5528920036176?text='));
 results.push('The project empty state and the configured WhatsApp destination are present.');
 await screenshot({path:'qa/desktop.png',fullPage:true});
 await page.locator('#estudio').screenshot({path:'qa/studio-aligned.png'});
 for(const path of ['/','/estudio.html','/projetos.html','/processo.html','/contato.html']){
  const response=await page.goto(origin+path,{waitUntil:'networkidle'});
  assert.equal(response.status(),200,path);
  await page.waitForFunction(()=>window.__untoldReady===true);
  assert.equal(await page.locator('main h1').count(),1,path);
  assert.equal(await page.locator('[id]').evaluateAll(elements=>new Set(elements.map(e=>e.id)).size===elements.length),true,path+' has duplicate IDs');
  if(path!=='/')assert.equal(await page.locator('.desktop-nav a[aria-current="page"]').count(),1);
  for(const width of [1440,1024,768,390,320]){
   await page.setViewportSize({width,height:width<640?844:900});
   const size=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth}));
   assert.ok(size.width<=size.viewport+1,JSON.stringify({path,...size}));
  }
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
  assert.ok(await page.locator('#menu-dialog').evaluate(d=>d.open));
  const menuLinks=await page.locator('#menu-dialog nav a').evaluateAll(links=>links.map(a=>new URL(a.href).pathname));
  assert.deepEqual(menuLinks,['/estudio.html','/projetos.html','/processo.html','/contato.html']);
  await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.getElementById('menu-dialog').contains(document.activeElement)));
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false');
  const imageName=path==='/'?'home':path.slice(1,-5);
  await screenshot({path:`qa/${imageName}-mobile.png`,fullPage:true});
  await page.setViewportSize({width:1440,height:900});
  if(path!=='/')await screenshot({path:`qa/${imageName}-desktop.png`,fullPage:true});
 }
 results.push('All five pages load directly, have one main heading, and fit widths from 320 to 1440 px. Mobile menus contain focus and close with Escape.');
 await page.goto(origin,{waitUntil:'networkidle'});
 await page.locator('.desktop-nav a[href="/estudio.html"]').click();await page.waitForURL('**/estudio.html');
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Abrir menu',exact:true}).click();
 await page.locator('#menu-dialog a[href="/projetos.html"]').click();await page.waitForURL('**/projetos.html');
 await page.locator('.nav .brand').click();await page.waitForURL(origin+'/');
 results.push('Desktop and mobile navigation open the new pages; the brand returns home.');
 await page.goto(origin+'/contato.html?contato=1',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.getElementById('contact-dialog').open);
 await page.locator('#contact-submit').click();
 assert.equal(await page.locator('#contact-name').getAttribute('aria-invalid'),'true');
 await page.locator('#contact-name').fill('Teste de integração');
 await page.locator('#contact-email').fill('qa@example.test');
 await page.locator('#contact-message').fill('Quero um site para apresentar a identidade da minha marca.');
 await page.locator('#contact-submit').click();
 const outgoing=await page.evaluate(()=>window.__testWhatsappTarget);
 assert.ok(outgoing.startsWith('https://wa.me/5528920036176?text='));
 assert.ok(new URL(outgoing).searchParams.get('text').includes('Teste de integração'));
 const brief=await page.locator('#brief-download').evaluate(async a=>(await fetch(a.href)).text());
 assert.ok(brief.includes('Teste de integração')&&brief.includes('qa@example.test'));
 await page.screenshot({path:'qa/contact-mobile.png'});
 await page.keyboard.press('Escape');
 results.push('The briefing validates fields, builds the correct WhatsApp message and downloads its text. Outgoing navigation was intercepted; nothing sent.');
 await page.setViewportSize({width:1440,height:900});
 await page.goto(origin,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>window.__untoldVisualReady===true);
 await page.locator('#brand-canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
 assert.equal(await page.locator('#hero-visual').getAttribute('data-scene-state'),'poster');
 assert.equal(await page.locator('#brand-canvas').isVisible(),false);
 results.push('WebGL context loss restores the static vector artwork.');
 await context.close();
 const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const rp=await reduced.newPage();rp.on('pageerror',e=>errors.push(e.message));
 await rp.goto(origin,{waitUntil:'networkidle'});await rp.waitForFunction(()=>window.__untoldVisualReady===true);
 assert.equal(await rp.locator('#hero-visual').getAttribute('data-scene-state'),'poster');
 await rp.screenshot({path:'qa/mobile-reduced.png',fullPage:true});await reduced.close();
 const nojs=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
 const np=await nojs.newPage();await np.goto(origin+'/projetos.html',{waitUntil:'load'});
 assert.equal(await np.locator('main h1').isVisible(),true);
 assert.equal(await np.locator('.projects-empty a').isVisible(),true);await nojs.close();
 results.push('Reduced motion uses static artwork. Project content and WhatsApp remain usable without JavaScript.');
 assert.deepEqual(errors,[]);
 await writeFile('qa/functional-report.json',JSON.stringify({passed:true,checks:results,pageErrors:errors},null,2));
 console.log(JSON.stringify({passed:true,checks:results,pageErrors:errors},null,2));
}finally{await browser.close();}
