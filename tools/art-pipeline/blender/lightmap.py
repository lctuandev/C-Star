"""Lays out a shared lightmap and bakes Cycles' light into it (ADR-005).

Only light goes in, not colour: the colours stay sharp in the vertices and the decal atlas, and the
lightmap, soft by nature, stays small. `use_pass_color = False` is what makes that so.
"""
import bpy

LIGHTMAP_UV = "lightmap"


def lay_out_uvs(objects, margin):
    """Every object in one atlas: whatever is switched on or off later keeps its own light."""
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
        uv = obj.data.uv_layers.new(name=LIGHTMAP_UV)
        obj.data.uv_layers.active = uv
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=1.15, island_margin=margin, area_weight=1.0, scale_to_bounds=False)
    bpy.ops.uv.select_all(action="SELECT")
    bpy.ops.uv.pack_islands(rotate=True, margin=margin, shape_method="AABB")
    bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="DESELECT")


def _bake_node(material, image):
    """The active image node is where Cycles writes."""
    nodes = material.node_tree.nodes
    node = nodes.new("ShaderNodeTexImage")
    node.name = "lightmap_target"
    node.image = image
    uv = nodes.new("ShaderNodeUVMap")
    uv.uv_map = LIGHTMAP_UV
    material.node_tree.links.new(uv.outputs["UV"], node.inputs["Vector"])
    nodes.active = node
    node.select = True
    return node


def bake(scene, objects, size, samples, margin_px):
    image = bpy.data.images.new("lightmap", size, size, alpha=True, float_buffer=True)
    image.colorspace_settings.name = "Linear Rec.709"

    materials = {slot.material for obj in objects for slot in obj.material_slots if slot.material}
    targets = [(material, _bake_node(material, image)) for material in materials]

    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = samples
    scene.cycles.max_bounces = 5
    scene.cycles.diffuse_bounces = 4
    scene.cycles.glossy_bounces = 0
    scene.cycles.transmission_bounces = 2
    scene.cycles.sample_clamp_indirect = 8.0
    scene.cycles.seed = 7
    bake_settings = scene.render.bake
    bake_settings.margin = margin_px
    bake_settings.margin_type = "EXTEND"
    bake_settings.use_pass_direct = True
    bake_settings.use_pass_indirect = True
    bake_settings.use_pass_color = False
    bake_settings.target = "IMAGE_TEXTURES"

    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.bake(type="DIFFUSE", save_mode="INTERNAL")

    for material, node in targets:
        material.node_tree.nodes.remove(node)
    return image
