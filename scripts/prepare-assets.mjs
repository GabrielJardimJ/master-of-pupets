import {mkdir,cp,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const brand=resolve('../untold'),out=resolve('public/assets');
const kit='C:/Users/dev/.agents/skills/taste-skill/assets';
await mkdir(out+'/fonts',{recursive:true});
await cp(brand+'/fonts',out+'/fonts',{recursive:true});
for(const [source,dest]of [['horizontal-paper','logo-paper'],['symbol-ink','symbol-ink'],['symbol-volt','symbol-volt'],['wordmark-paper','wordmark-paper']])await cp(`${brand}/logos/untold-${source}.svg`,`${out}/${dest}.svg`);
await cp(brand+'/logos/favicon.svg',out+'/favicon.svg');
await cp(brand+'/preview/pages/01.png',out+'/share.png');
const data=JSON.parse(await readFile(brand+'/scene-data.json','utf8'));
await writeFile(out+'/mark-sculpture.svg',data.boards[0].children.find(n=>n.type==='svg').svg);
const word=await readFile(out+'/wordmark-paper.svg','utf8');
await writeFile(out+'/wordmark-paper.svg',word.replace('height="190"','height="158"').replace('0 0 548.40 190','0 12 548.40 158'));
await cp(kit+'/motion',out+'/motion',{recursive:true});
await mkdir(out+'/moments/word-highlight',{recursive:true});
for(const file of ['moments.js','lib.js'])await cp(kit+'/moments/'+file,out+'/moments/'+file);
for(const file of ['moment.css','moment.js'])await cp(kit+'/moments/word-highlight/'+file,out+'/moments/word-highlight/'+file);
let paths='';
for(let i=0;i<92;i++){
 const x=120+i*10,dx=Math.sin(i*.045)*165;
 paths+=`<path d="M${x} -30C${x-200} 170 ${x+200+dx} 350 ${x+dx} 620" stroke="${i%18===0?'#D7FF3F':'url(#light)'}" stroke-width="${i%18===0?1.4:4}" fill="none"/>`;
}
await writeFile(out+'/campo.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600"><defs><linearGradient id="light"><stop stop-color="#3C5034"/><stop offset=".45" stop-color="#D7DEC8"/><stop offset="1" stop-color="#4C6341"/></linearGradient></defs><rect width="1200" height="600" fill="#172019"/>${paths}</svg>`);
let bars='';for(let i=0;i<8;i++){const len=300+60*Math.cos(i*.48);bars+=`<rect x="${300-len/2}" y="${120+i*47}" width="${len}" height="32" rx="16" fill="#0B0D0C"/><rect x="267" y="${120+i*47}" width="66" height="32" fill="#D7FF3F"/>`;}
await writeFile(out+'/forma.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="540" viewBox="0 0 600 540"><rect width="600" height="540" fill="#D7FF3F"/><g transform="rotate(-17 300 310)">${bars}</g></svg>`);
const ink=await readFile(brand+'/logos/untold-wordmark-ink.svg','utf8');let rows='';
for(let i=0;i<5;i++){let v=ink;if(i!==2)v=v.replace(/fill="#0B0D0C"/g,`fill="none" stroke="${i%2?'#8D9686':'#B8BFB1'}" stroke-width="2.2"`);v=v.replace('<svg ',`<svg x="66" y="${72+i*83}" `).replace('width="548.40" height="190"','width="468" height="162"');rows+=v;}
await writeFile(out+'/ritmo.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="540" viewBox="0 0 600 540"><rect width="600" height="540" fill="#F3F2EC"/>${rows}</svg>`);
console.log('Brand, fonts, poster fallbacks and motion assets prepared.');
