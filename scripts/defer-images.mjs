import {readFile,writeFile} from 'node:fs/promises';
let firstLogo=true;
const path='public/index.html';
const html=await readFile(path,'utf8');
await writeFile(path,html.replace(/<img\b[^>]*>/g,tag=>{
 if(tag.includes('class="mark-poster"'))return tag;
 if(tag.includes('src="/assets/logo-paper.svg"')&&firstLogo){firstLogo=false;return tag;}
 return tag.includes('loading=')?tag:tag.replace(/>$/,' loading="lazy" decoding="async">');
}));
console.log('Deferred offscreen and dialog images; initial navigation and hero remain eager.');
