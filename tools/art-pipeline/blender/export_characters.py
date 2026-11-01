"""Writes characters.raw.glb: everyone at the origin, skinned, without animation data (FEAT-029).

blender --background out/characters.blend --python blender/export_characters.py -- --out out
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import bpy

import kit

args = argparse.ArgumentParser()
args.add_argument("--out", default="out")
options = args.parse_args(kit.script_arguments())
out = Path(options.out).resolve()

for obj in bpy.data.objects:
    if obj.type == "ARMATURE":
        obj.location = (0, 0, 0)
    obj.select_set(obj.type in ("ARMATURE", "MESH"))
bpy.context.view_layer.update()
bpy.ops.export_scene.gltf(
    filepath=str(out / "characters.raw.glb"),
    export_format="GLB",
    use_selection=True,
    export_yup=True,
    export_skins=True,
    export_animations=False,
    export_morph=False,
    export_rest_position_armature=True,
    export_def_bones=False,
    export_all_influences=False,
    export_normals=True,
    export_texcoords=False,
    export_vertex_color="ACTIVE",
    export_materials="EXPORT",
    export_cameras=False,
    export_lights=False,
)
print("EXPORTED characters")
