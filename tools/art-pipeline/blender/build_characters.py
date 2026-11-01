"""Writes characters.blend: everyone in a row, for the GLB, portraits and the cover (FEAT-029).

blender --background --factory-startup --python blender/build_characters.py -- --out out
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import bpy

import characters
import kit

args = argparse.ArgumentParser()
args.add_argument("--out", default="out")
options = args.parse_args(kit.script_arguments())
out = Path(options.out).resolve()
out.mkdir(parents=True, exist_ok=True)

kit.reset_scene()
collection = kit.new_collection("PEOPLE")
material = kit.base_material("M_Skin", 0.55)
total = 0
for index, (name, look) in enumerate(characters.PEOPLE.items()):
    rig, mesh = characters.to_skinned(f"CHR_{name}", characters.build_body(look), collection, material, look.height)
    rig.location.x = index * 0.75
    triangles = sum(len(p.vertices) - 2 for p in mesh.data.polygons)
    total += triangles
    print(f"PERSON {name}: {triangles} triangles")
print(f"PEOPLE {total}")
bpy.ops.wm.save_as_mainfile(filepath=str(out / "characters.blend"))
