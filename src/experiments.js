const TAU=Math.PI*2;
export const studyInfo={
  campo:{name:'Campo',description:'Luz e profundidade em um campo de linhas. Mova o cursor e ajuste a intensidade para mudar a composição.'},
  forma:{name:'Forma',description:'Uma composição de formas que responde à sua presença. Mova o cursor para reorganizar o ritmo.'},
  ritmo:{name:'Ritmo',description:'O mesmo nome, em diferentes frequências. A tipografia vira uma superfície para experimentar.'}
};
export function mountExperiment(canvas,type,{isPaused=()=>false,reduced,detail=false}={}){
 const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return {destroy(){},reset(){},setIntensity(){},pause(){}};
 let w=1,h=1,dpr=1,raf=0,dead=false,visible=true,hover=false,localPaused=false,intensity=.55;
 let px=.5,py=.5,tx=.5,ty=.5,phase=0,last=performance.now();
 const parent=canvas.parentElement;
 const draw=()=>{
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  if(type==='campo')drawCampo(ctx,w,h,px,py,phase,intensity);
  if(type==='forma')drawForma(ctx,w,h,px,py,phase,intensity);
  if(type==='ritmo')drawRitmo(ctx,w,h,px,py,phase,intensity);
 };
 const resize=()=>{const r=parent.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);draw();parent.classList.add('is-ready');};
 function tick(now){
  if(dead)return;const dt=Math.min((now-last)/1000,.05);last=now;
  const running=!isPaused()&&!reduced?.matches&&!localPaused&&visible&&!document.hidden;
  if(running){px+=(tx-px)*.06;py+=(ty-py)*.06;if(hover||detail)phase+=dt*.28;}
  if(visible&&(running&&(hover||detail||Math.abs(px-tx)>.001)||!canvas.dataset.drawn)){draw();canvas.dataset.drawn='1';}
  raf=requestAnimationFrame(tick);
 }
 const move=event=>{if(reduced?.matches)return;const r=canvas.getBoundingClientRect();tx=Math.max(0,Math.min(1,(event.clientX-r.left)/r.width));ty=Math.max(0,Math.min(1,(event.clientY-r.top)/r.height));};
 const card=canvas.closest('.study-card')||parent;
 const enter=()=>hover=true,leave=()=>{hover=false;tx=.5;ty=.5;};
 card.addEventListener('pointermove',move);card.addEventListener('pointerenter',enter);card.addEventListener('pointerleave',leave);
 const ro=new ResizeObserver(resize);ro.observe(parent);
 const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)draw();},{rootMargin:'80px'});io.observe(canvas);
 resize();raf=requestAnimationFrame(tick);
 return {destroy(){dead=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();card.removeEventListener('pointermove',move);card.removeEventListener('pointerenter',enter);card.removeEventListener('pointerleave',leave);},setIntensity(value){intensity=value/100;draw();},reset(){phase=0;px=tx=.5;py=ty=.5;intensity=.55;draw();},pause(value){localPaused=value;draw();}};
}
function drawCampo(ctx,w,h,px,py,time,intensity){
 ctx.fillStyle='#172019';ctx.fillRect(0,0,w,h);
 const glow=ctx.createRadialGradient(w*.55,h*.5,0,w*.55,h*.5,w*.6);glow.addColorStop(0,'#2B3925');glow.addColorStop(1,'#121A15');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 const count=92,spread=w*.88,amp=(.35+intensity*.65)*h*.34;
 const light=ctx.createLinearGradient(0,h*.15,w*.5,h*.9);light.addColorStop(0,'#53614A');light.addColorStop(.30,'#C9D3BB');light.addColorStop(.47,'#748766');light.addColorStop(.65,'#E4E9D9');light.addColorStop(1,'#34472F');
 ctx.save();ctx.translate(w*.5,h*.53);ctx.rotate(-.12);
 for(let i=0;i<count;i++){
  const t=i/(count-1)-.5,x=t*spread,edge=Math.sin((t+.5)*Math.PI);
  ctx.beginPath();
  for(let j=0;j<=72;j++){
   const v=j/72;
   const wave=Math.sin(v*TAU*.80+t*4+time+(px-.5)*1.4)*amp*Math.sin(v*Math.PI);
   const xx=x+wave,yy=(v-.5)*h*.98+Math.sin(t*4+time)*h*.08+(py-.5)*edge*45;
   if(j===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);
  }
  ctx.strokeStyle=i%18===0?'#D7FF3F':light;ctx.lineWidth=i%18===0?1.3:Math.max(1,spread/count*.46);ctx.stroke();
 }
 ctx.restore();
}
function drawForma(ctx,w,h,px,py,time,intensity){
 ctx.fillStyle='#D7FF3F';ctx.fillRect(0,0,w,h);
 const s=Math.min(w,h)*.72,cx=w*.5+(px-.5)*s*.13,cy=h*.53+(py-.5)*s*.1;
 ctx.save();ctx.translate(cx,cy);ctx.rotate(-.30+(px-.5)*.18);
 const n=8,gap=s*.123;
 for(let i=0;i<n;i++){
  const y=(i-(n-1)/2)*gap,shift=Math.sin(i*.73+time)*s*.045*intensity;
  const len=s*(.62+.30*Math.cos(i*.48));
  ctx.fillStyle='#0B0D0C';ctx.beginPath();ctx.roundRect(-len/2+shift,y-gap*.34,len,gap*.66,gap*.33);ctx.fill();
  const cut=s*(.11+.04*Math.sin(i*.7+px*2));ctx.fillStyle='#D7FF3F';ctx.fillRect(-cut/2+(px-.5)*s*.16,y-gap*.4,cut,gap*.8);
 }
 ctx.restore();
}
function drawRitmo(ctx,w,h,px,py,time,intensity){
 ctx.fillStyle='#F3F2EC';ctx.fillRect(0,0,w,h);
 const size=w*.244;ctx.font=`700 ${size}px Outfit`;ctx.textAlign='center';ctx.textBaseline='middle';
 const rowHeight=size*.77,start=h*.5-rowHeight*2;
 for(let i=0;i<5;i++){
  ctx.save();const shift=Math.sin(i*.75+time)*w*.04*intensity+(px-.5)*w*.12*(i-2);
  ctx.translate(w/2+shift,start+i*rowHeight+(py-.5)*16);ctx.scale(1,1.08);
  if(i===2){ctx.fillStyle='#0B0D0C';ctx.fillText('untold',0,0);}else{ctx.strokeStyle=i%2?'#8D9686':'#B8BFB1';ctx.lineWidth=.8;ctx.strokeText('untold',0,0);}
  ctx.restore();
 }
}
