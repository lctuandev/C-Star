"""Renders the built scene with Cycles from the game's cameras: for judging the art, and for the 2D
screens (FEAT-032).

blender --background out/office.blend --python blender/render_views.py -- --out out/views --views office,desk
"""
import argparse
import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import bpy
from mathutils import Vector

import kit

VIEWS = json.loads((Path(__file__).parent.parent / "cameras.json").read_text())

args = argparse.ArgumentParser()
args.add_argument("--out", default="out/views")
args.add_argument("--views", default=",".join(VIEWS))
args.add_argument("--width", type=int, default=960)
args.add_argument("--height", type=int, default=540)
args.add_argument("--samples", type=int, default=48)
options = args.parse_args(kit.script_arguments())

scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = options.samples
scene.cycles.use_denoising = True
scene.cycles.denoiser = "OPENIMAGEDENOISE"
scene.cycles.max_bounces = 5
scene.render.resolution_x = options.width
scene.render.resolution_y = options.height
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "None"
scene.render.image_settings.file_format = "PNG"

bpy.data.objects["CEILING"].visible_camera = False
bpy.data.objects["NEAR_WALL"].visible_camera = False

camera_data = bpy.data.cameras.new("view")
camera = bpy.data.objects.new("view", camera_data)
scene.collection.objects.link(camera)
scene.camera = camera

out = Path(options.out).resolve()
out.mkdir(parents=True, exist_ok=True)
for name in options.views.split(","):
    pose = VIEWS[name]
    camera.location = kit.to_blender(*pose["position"])
    target = Vector(kit.to_blender(*pose["target"]))
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera_data.sensor_fit = "VERTICAL"
    camera_data.angle_y = math.radians(pose.get("fov", 42))
    scene.render.filepath = str(out / f"{name}.png")
    bpy.ops.render.render(write_still=True)
    print("RENDERED", name)
