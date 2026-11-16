import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
export async function mountBrandScene(canvas, stage, { reduced }) {
  if(reduced.matches || matchMedia('(max-width: 639px), (pointer: coarse)').matches) {
    stage.dataset.sceneState='poster';canvas.tabIndex=-1;canvas.setAttribute('aria-hidden','true');return {pause(){},destroy(){}};
  }
  let renderer, dead=false, shaderFailed=false;
  try {renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}
  catch {stage.dataset.sceneState='poster';canvas.tabIndex=-1;canvas.setAttribute('aria-hidden','true');return {pause(){},destroy(){}};}
  const showPoster=()=>{shaderFailed=true;dead=true;stage.classList.remove('is-ready');stage.dataset.sceneState='poster';canvas.setAttribute('aria-hidden','true');stage.querySelector('.mark-poster').removeAttribute('aria-hidden');};
  renderer.debug.onShaderError=showPoster;
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.setClearColor(0x0b0d0c,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,12.6);
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
  const environment=pmrem.fromScene(room,.035);scene.environment=environment.texture;scene.environmentIntensity=1.2;
  room.dispose();pmrem.dispose();
  const silver=new THREE.MeshPhysicalMaterial({color:0xc2cbb8,metalness:1,roughness:.23,clearcoat:1,clearcoatRoughness:.22,envMapIntensity:1.5});
  const sides=new THREE.MeshPhysicalMaterial({color:0x5f6a57,metalness:.96,roughness:.32,clearcoat:.8,envMapIntensity:1.1});
  const accent=new THREE.MeshStandardMaterial({color:0xd7ff3f,emissive:0x9dbf0d,emissiveIntensity:.7,roughness:.3,metalness:.35});
  const mark=new THREE.Group();scene.add(mark);
  const shape=new THREE.Shape();
  shape.moveTo(0,72);shape.lineTo(20,72);shape.lineTo(20,36);
  shape.bezierCurveTo(20,26,26,20,36,20);shape.bezierCurveTo(46,20,52,26,52,36);
  shape.lineTo(52,50);shape.lineTo(72,50);shape.lineTo(72,36);
  shape.bezierCurveTo(72,15,57,0,36,0);shape.bezierCurveTo(15,0,0,15,0,36);shape.lineTo(0,72);
  const dot=new THREE.Shape();dot.moveTo(52,58);dot.lineTo(72,58);dot.lineTo(72,72);dot.lineTo(52,72);dot.closePath();
  const options={depth:14,bevelEnabled:true,bevelSegments:6,steps:1,bevelSize:1.25,bevelThickness:1.25,curveSegments:48};
  const geometries=[new THREE.ExtrudeGeometry(shape,options),new THREE.ExtrudeGeometry(dot,options)];
  geometries.forEach(g=>g.translate(-36,-36,-7));
  const base=new THREE.Mesh(geometries[0],[silver,sides]),floating=new THREE.Mesh(geometries[1],[silver,sides]);mark.add(base,floating);
  const lineGeometry=new THREE.CylinderGeometry(.16,.16,19.5,10);
  const line1=new THREE.Mesh(lineGeometry,accent);line1.rotation.z=Math.PI/2;line1.position.set(-26,36.6,7.7);
  const line2=line1.clone();line2.position.set(26,36.6,7.7);mark.add(line1,line2);
  mark.scale.setScalar(.074);mark.rotation.set(-.13,-.40,-.13);mark.position.set(.1,.2,0);
  const key=new THREE.DirectionalLight(0xfff8e8,3.8);key.position.set(-3,6,8);scene.add(key);
  const fill=new THREE.DirectionalLight(0xe9f1df,2);fill.position.set(5,0,4);scene.add(fill);
  const rim=new THREE.DirectionalLight(0xd7ff3f,3.5);rim.position.set(-4,2,-4);scene.add(rim);
  // The sculpture has a fixed pose. Render only on mount and resize.
  const resize=()=>{
    if(dead)return;
    const {width,height}=stage.getBoundingClientRect();if(width<1||height<1)return;
    renderer.setSize(width,height,false);camera.aspect=width/height;
    camera.position.z=12.6*Math.max(1,.95/camera.aspect);camera.updateProjectionMatrix();
    try{renderer.render(scene,camera);}catch{showPoster();}
  };
  const observer=new ResizeObserver(resize);observer.observe(stage);
  const contextLost=event=>{event.preventDefault();showPoster();};
  canvas.addEventListener('webglcontextlost',contextLost);
  resize();if(!shaderFailed){stage.classList.add('is-ready');stage.dataset.sceneState='static';canvas.removeAttribute('aria-hidden');stage.querySelector('.mark-poster').setAttribute('aria-hidden','true');}
  window.__untoldGL={contexts:1,triangles:renderer.info.render.triangles};
  return {destroy(){dead=true;observer.disconnect();canvas.removeEventListener('webglcontextlost',contextLost);geometries.forEach(g=>g.dispose());lineGeometry.dispose();silver.dispose();sides.dispose();accent.dispose();environment.dispose();renderer.dispose();}};
}
