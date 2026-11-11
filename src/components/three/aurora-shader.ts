export const auroraVertex = /* glsl */ `
varying vec2 vUv;
void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}
`;
export const auroraFragment = /* glsl */ `
uniform float uTime;
uniform float uAspect;
uniform vec2 uResolution;
varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec2 uv=gl_FragCoord.xy/uResolution;
 vec2 p=(uv-.5)*vec2(uAspect,1.0);
 float t=uTime*.045;
 vec3 ink=vec3(.063,.067,.102),color=ink;
 // The UI keeps the official palette. Cyan, mint and rose are atmospheric accents requested for the aurora.
 for(int i=0;i<6;i++){
   float fi=float(i);
   float wave=sin(p.x*2.4+t+fi*.4)*.13+sin(p.x*4.1-t*.7+fi*.5)*.06;
   float band=p.y-wave+(fi-2.5)*.045;
   float curtain=exp(-abs(band)*(15.+noise(vec2(p.x*3.+t,fi))*14.));
   float strands=.62+.38*noise(vec2(p.x*38.+noise(vec2(p.y*2.,t))*2.,fi+t));
   float fade=exp(-p.x*p.x*.6);
   float region=clamp(uv.x+sin(t+fi*.3)*.035,0.,1.);
   vec3 hue=mix(vec3(.12,.60,.40),vec3(.06,.48,.64),smoothstep(.05,.30,region));
   hue=mix(hue,vec3(.06,.20,.72),smoothstep(.28,.52,region));
   hue=mix(hue,vec3(.47,.12,.72),smoothstep(.48,.76,region));
   hue=mix(hue,vec3(.67,.12,.42),smoothstep(.75,.98,region));
   color+=hue*curtain*strands*fade*.43;
   float line=exp(-abs(band+.015)*95.);
   color+=hue*line*fade*.1;
 }
 float haze=exp(-length(p-vec2(0,.08))*2.7);
 color+=vec3(.025,.015,.07)*haze;
 float edge=smoothstep(0.,.1,uv.y)*(1.-smoothstep(.86,1.,uv.y));
 color=mix(ink,color,edge);
 vec3 linearColor=mix(color/12.92,pow((color+.055)/1.055,vec3(2.4)),step(vec3(.04045),color));
 gl_FragColor=vec4(linearColor,1.);
 #include <colorspace_fragment>
}
`;
