"""Rebuild the original SVG's exact cubic curves. Run: npm run model."""
import bpy, math, re, json, pathlib, xml.etree.ElementTree as ET
from mathutils import Vector
ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT/'public/models'
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene

def point(x,y): return ((x-200)/100, (197-y)/100, 0)
def curve_from_path(data, name):
    tokens=re.findall(r'[A-Za-z]|-?\d*\.?\d+',data); i=0; current=(0,0); nodes=[]; command=None
    def number():
        nonlocal i
        n=float(tokens[i]); i+=1; return n
    while i<len(tokens):
        if tokens[i].isalpha(): command=tokens[i]; i+=1
        if command=='M':
            current=(number(),number()); nodes.append({'p':current}); command='L'
        elif command in ['H','V','L']:
            if command=='H': target=(number(),current[1])
            elif command=='V': target=(current[0],number())
            else: target=(number(),number())
            nodes[-1]['right']=current; nodes.append({'p':target,'left':target}); current=target
        elif command=='C':
            c1=(number(),number()); c2=(number(),number()); target=(number(),number())
            nodes[-1]['right']=c1; nodes.append({'p':target,'left':c2}); current=target
        elif command in ['Z','z']: break
        else: raise ValueError('Unsupported SVG command: '+str(command))
    if nodes[-1]['p']==nodes[0]['p']:
        nodes[0]['left']=nodes[-1].get('left',nodes[0]['p']); nodes.pop()
    curve=bpy.data.curves.new(name,'CURVE'); curve.dimensions='2D'; curve.resolution_u=20
    curve.fill_mode='BOTH'; curve.extrude=.008 if 'Fold' in name else .17; curve.bevel_depth=.003 if 'Fold' in name else .045; curve.bevel_resolution=5
    spline=curve.splines.new('BEZIER'); spline.bezier_points.add(len(nodes)-1); spline.use_cyclic_u=True
    for p,n in zip(spline.bezier_points,nodes):
        p.co=point(*n['p']); p.handle_left_type='FREE'; p.handle_right_type='FREE'
        p.handle_left=point(*n.get('left',n['p'])); p.handle_right=point(*n.get('right',n['p']))
    obj=bpy.data.objects.new(name,curve); scene.collection.objects.link(obj)
    obj.rotation_euler.x=math.pi/2
    bpy.context.view_layer.objects.active=obj; obj.select_set(True)
    bpy.ops.object.convert(target='MESH'); bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
    for p in obj.data.polygons: p.use_smooth=abs(p.normal.y)<.98
    obj.select_set(False)
    return obj

root=ET.parse(ROOT/'logos/ Vetor editável.svg').getroot()
paths=root.findall('{http://www.w3.org/2000/svg}path')
objects=[]
for i,path in enumerate(paths):
    obj=curve_from_path(path.attrib['d'], 'Untold_OpticalGlass' if i==0 else 'Untold_Fold')
    if i==1:
        # The original second path is the coloured fold overlay, not a second silhouette.
        obj.location.y=-.222
    mat=bpy.data.materials.new('Optical glass' if i==0 else 'Violet glass fold'); mat.use_nodes=True
    node=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
    node.inputs['Base Color'].default_value=(.72,.79,1,1) if i==0 else (.40,.29,.72,1)
    node.inputs['Transmission Weight'].default_value=.96
    node.inputs['Roughness'].default_value=.10
    node.inputs['IOR'].default_value=1.46
    obj.data.materials.append(mat); objects.append(obj)
# Export only brand geometry, with a physically exportable transmission material.
for obj in objects: obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'untold-glass.glb'),export_format='GLB',use_selection=True,export_apply=True)
# Reimport in a separate scene and check the exported artifact, not the source object.
original_scene=scene
validation=bpy.data.scenes.new('GLB validation'); bpy.context.window.scene=validation
bpy.ops.import_scene.gltf(filepath=str(OUT/'untold-glass.glb'))
report=[]
for obj in validation.objects:
    if obj.type=='MESH':
        import bmesh
        bm=bmesh.new(); bm.from_mesh(obj.data)
        # glTF splits vertices at hard normals and material seams. Weld a validation copy.
        split_vertices=len(bm.verts)
        bmesh.ops.remove_doubles(bm, verts=list(bm.verts), dist=0.00001)
        report.append({'object':obj.name,'vertices':len(obj.data.vertices),'welded_vertices':len(bm.verts),'polygons':len(obj.data.polygons),'dimensions':list(obj.dimensions),'non_manifold_edges':sum(not e.is_manifold for e in bm.edges),'invalid_normals':sum(not all(math.isfinite(v) for v in p.normal) for p in obj.data.polygons)})
        bm.free()
assert len(report)==2 and all(r['vertices']>100 and r['invalid_normals']==0 and r['non_manifold_edges']==0 for r in report)
(ROOT/'docs/model-validation.json').write_text(json.dumps(report,indent=2))
bpy.context.window.scene=original_scene
bpy.data.scenes.remove(validation)
# Preview studio: light bars reveal the bevel while the luminous backdrop is transmitted.
world=bpy.data.worlds.new('Ink studio'); world.use_nodes=True
world.node_tree.nodes.get('Background').inputs[0].default_value=(.045,.05,.09,1)
world.node_tree.nodes.get('Background').inputs[1].default_value=.45
scene.world=world

def area(name, loc, energy, color, size, size_y):
    light=bpy.data.lights.new(name,'AREA'); light.energy=energy; light.color=color; light.shape='RECTANGLE'; light.size=size; light.size_y=size_y
    obj=bpy.data.objects.new(name,light); scene.collection.objects.link(obj); obj.location=loc
    obj.rotation_euler=(Vector((0,0,0))-obj.location).to_track_quat('-Z','Y').to_euler()
area('Key softbox',(-3,-4,4),850,(.75,.85,1),4,1)
area('Violet edge',(4,0,2),1100,(.44,.26,1),3,1)
area('Front strip',(2,-4,-1),650,(.8,.9,1),.5,4)
# Atmospheric background, made in Blender for an independent static fallback.
bpy.ops.mesh.primitive_plane_add(size=20, location=(0,1.5,0),rotation=(math.pi/2,0,0))
back=bpy.context.object; back.name='Aurora preview backdrop'
mat=bpy.data.materials.new('Aurora atmosphere'); mat.use_nodes=True; nodes=mat.node_tree.nodes; nodes.clear(); links=mat.node_tree.links
out=nodes.new('ShaderNodeOutputMaterial'); emission=nodes.new('ShaderNodeEmission'); links.new(emission.outputs[0],out.inputs[0])
tex=nodes.new('ShaderNodeTexNoise'); tex.inputs['Scale'].default_value=.6; tex.inputs['Detail'].default_value=2
coord=nodes.new('ShaderNodeTexCoord'); mapping=nodes.new('ShaderNodeVectorMath'); mapping.operation='MULTIPLY'; mapping.inputs[1].default_value=(.7,2.8,1)
links.new(coord.outputs['Object'],mapping.inputs[0]); links.new(mapping.outputs[0],tex.inputs[0])
ramp=nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].position=.25; ramp.color_ramp.elements[0].color=(.005,.006,.015,1)
ramp.color_ramp.elements[1].position=.8; ramp.color_ramp.elements[1].color=(.09,.025,.5,1)
ramp.color_ramp.elements.new(.52).color=(.005,.015,.09,1)
links.new(tex.outputs['Fac'],ramp.inputs[0]); links.new(ramp.outputs[0],emission.inputs[0]); emission.inputs[1].default_value=.7
back.data.materials.append(mat)
cam_data=bpy.data.cameras.new('Preview camera'); cam=bpy.data.objects.new('Preview camera',cam_data); scene.collection.objects.link(cam)
cam.location=(.9,-8,.7); cam.rotation_euler=(Vector((0,0,0))-cam.location).to_track_quat('-Z','Y').to_euler(); cam_data.type='ORTHO'; cam_data.ortho_scale=4.8; scene.camera=cam
scene.render.engine='CYCLES'; scene.cycles.samples=40
scene.render.resolution_x=1100; scene.render.resolution_y=1100; scene.render.resolution_percentage=100
scene.render.image_settings.file_format='WEBP'; scene.render.image_settings.quality=90
scene.view_settings.view_transform='AgX'
source=ROOT/'source/3d/untold-glass.blend'; source.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(source))
scene.render.filepath=str(OUT/'untold-glass-preview.webp'); bpy.ops.render.render(write_still=True)
scene.render.resolution_x=800; scene.render.resolution_y=800; scene.cycles.samples=24
scene.render.filepath=str(OUT/'untold-glass-fallback.webp'); bpy.ops.render.render(write_still=True)
print('UNTOLD MODEL VERIFIED',json.dumps(report))
