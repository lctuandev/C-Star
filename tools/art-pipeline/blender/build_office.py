"""Builds the office, bakes its light, writes office.raw.glb and office-plan.json (FEAT-028).

blender --background --factory-startup --python blender/build_office.py -- --out out [--size 2048] [--samples 256]
"""
import argparse
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import bpy

import kit
import lightmap
import office

args = argparse.ArgumentParser()
args.add_argument("--out", default="out")
args.add_argument("--size", type=int, default=2048)
args.add_argument("--samples", type=int, default=256)
args.add_argument("--scale", type=float, default=0.5, help="the light is stored at this fraction of its value")
options = args.parse_args(kit.script_arguments())
out = Path(options.out).resolve()
out.mkdir(parents=True, exist_ok=True)

scene = kit.reset_scene()
baked, unlit, plan = office.build_all()
for obj in baked:
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
bpy.ops.object.mode_set(mode="EDIT")
bpy.ops.mesh.select_all(action="SELECT")
# Tiles and neighbours become one surface, so the carpet is one island of light, without seams.
bpy.ops.mesh.remove_doubles(threshold=0.0005)
bpy.ops.object.mode_set(mode="OBJECT")

started = time.time()
lightmap.lay_out_uvs(baked, 0.0022)
print(f"LAYOUT {time.time() - started:.1f}s")
started = time.time()
image = lightmap.bake(scene, baked, options.size, options.samples, 6)
print(f"BAKED {time.time() - started:.1f}s")

raw = out / "lightmap.exr"
image.filepath_raw = str(raw)
image.file_format = "OPEN_EXR"
image.save()

bpy.ops.wm.save_as_mainfile(filepath=str(out / "office.blend"))
(out / "office-plan.json").write_text(json.dumps(office.plan_json(plan), indent=1) + "\n")

triangles = sum(sum(len(p.vertices) - 2 for p in obj.data.polygons) for obj in baked + unlit if obj)
print(f"TRIANGLES {triangles}, objects {len(baked) + len(unlit)}")
