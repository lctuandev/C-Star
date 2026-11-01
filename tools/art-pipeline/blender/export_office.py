"""Turns the baked light into a picture and writes office.raw.glb (FEAT-028).

blender --background out/office.blend --python blender/export_office.py -- --out out
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import bpy
import numpy as np

import kit

args = argparse.ArgumentParser()
args.add_argument("--out", default="out")
args.add_argument("--range", type=float, default=2.0, help="the brightest light stored, 1 being plain white")
options = args.parse_args(kit.script_arguments())
out = Path(options.out).resolve()

source = bpy.data.images.load(str(out / "lightmap.clean.exr"))
source.colorspace_settings.name = "Linear Rec.709"
width, height = source.size
pixels = np.empty(width * height * 4, dtype=np.float32)
source.pixels.foreach_get(pixels)
pixels = pixels.reshape(height, width, 4)

# sRGB spends its bits where dim light needs them, and `range` leaves headroom for the bright.
light = np.clip(pixels[:, :, :3] / options.range, 0, 1)
encoded = np.where(light <= 0.0031308, light * 12.92, 1.055 * np.power(light, 1 / 2.4) - 0.055)

picture = bpy.data.images.new("office_light", width, height, alpha=False)
picture.colorspace_settings.name = "Non-Color"
rgba = np.ones((height, width, 4), dtype=np.float32)
rgba[:, :, :3] = encoded
picture.pixels.foreach_set(rgba.ravel())
picture.filepath_raw = str(out / "office_light.png")
picture.file_format = "PNG"
picture.save()

# Tied to the occlusion slot only so that glTF keeps the second UV and carries the picture.
output_group = bpy.data.node_groups.new("glTF Material Output", "ShaderNodeTree")
output_group.interface.new_socket("Occlusion", in_out="INPUT", socket_type="NodeSocketFloat")
for name in ("M_Base", "M_Decal"):
    tree = bpy.data.materials[name].node_tree
    texture = tree.nodes.new("ShaderNodeTexImage")
    texture.image = picture
    uv = tree.nodes.new("ShaderNodeUVMap")
    uv.uv_map = "lightmap"
    tree.links.new(uv.outputs["UV"], texture.inputs["Vector"])
    split = tree.nodes.new("ShaderNodeSeparateColor")
    tree.links.new(texture.outputs["Color"], split.inputs["Color"])
    group = tree.nodes.new("ShaderNodeGroup")
    group.node_tree = output_group
    tree.links.new(split.outputs[0], group.inputs["Occlusion"])

bpy.ops.object.select_all(action="DESELECT")
exported = [o for o in bpy.data.objects if o.type == "MESH" and o.name not in ("CEILING", "NEAR_WALL")]
for obj in exported:
    obj.select_set(True)
bpy.context.view_layer.objects.active = exported[0]
bpy.ops.export_scene.gltf(
    filepath=str(out / "office.raw.glb"),
    export_format="GLB",
    use_selection=True,
    export_yup=True,
    export_texcoords=True,
    export_normals=False,
    export_tangents=False,
    export_vertex_color="ACTIVE",
    export_materials="EXPORT",
    export_cameras=False,
    export_lights=False,
    export_extras=False,
)
print(f"EXPORTED {len(exported)} objects, range {options.range}")
