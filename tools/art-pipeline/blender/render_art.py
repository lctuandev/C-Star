"""Everything 2D the game shows, rendered from the same scene it plays in (FEAT-032, ADR-005).

Places for the 2D mode and the loading moment, a portrait of each person, the cover.

blender --background out/office.blend --python blender/render_art.py -- --out out/rendered [--only places,portraits,cover]
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

ROOT = Path(__file__).parent.parent
CAMERAS = json.loads((ROOT / "cameras.json").read_text())
PLAN = json.loads((ROOT / "out/office-plan.json").read_text())

args = argparse.ArgumentParser()
args.add_argument("--out", default="out/rendered")
args.add_argument("--only", default="places,portraits,cover")
args.add_argument("--samples", type=int, default=96)
options = args.parse_args(kit.script_arguments())
out = Path(options.out).resolve()
stages = options.only.split(",")

scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.use_denoising = True
scene.cycles.denoiser = "OPENIMAGEDENOISE"
scene.cycles.max_bounces = 5
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "None"
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"

with bpy.data.libraries.load(str(ROOT / "out/characters.blend"), link=False) as (source, target):
    target.objects = [name for name in source.objects]
people_collection = kit.new_collection("PEOPLE")
for obj in target.objects:
    people_collection.objects.link(obj)

camera_data = bpy.data.cameras.new("view")
camera = bpy.data.objects.new("view", camera_data)
scene.collection.objects.link(camera)
scene.camera = camera
camera_data.sensor_fit = "VERTICAL"

# The same numbers as `poseOf('type')` in apps/web: a rendered colleague sits as a live one does.
TYPING = {
    "chest": (0.06, 0, 0), "head": (0.1, 0.1, 0),
    "legL": (-1.45, 0, 0), "legR": (-1.45, 0, 0), "shinL": (1.3, 0, 0), "shinR": (1.3, 0, 0),
    "armL": (-0.62, 0, 0.12), "armR": (-0.62, 0, -0.12), "foreL": (-0.95, 0, 0), "foreR": (-0.95, 0, 0),
}
TALKING = {
    "armL": (-0.5, 0, 0.14), "foreL": (-1.1, 0, 0), "armR": (0.02, 0, -0.05), "foreR": (-0.12, 0, 0),
    "head": (0.0, 0.1, 0),
}
SEATED_DROP = -0.17


def hide_people():
    for obj in people_collection.objects:
        obj.hide_render = True


def pose(rig, joints, drop=0.0):
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
        bone.rotation_euler = joints.get(bone.name, (0, 0, 0))
        bone.location = (0, 0, 0)
    # Bone Y runs up the upright bones.
    rig.pose.bones["hips"].location = (0, drop, 0)


def stand(name, x, z, heading, joints=None, drop=0.0):
    rig = bpy.data.objects[f"CHR_{name}_rig"]
    mesh = bpy.data.objects[f"CHR_{name}"]
    rig.hide_render = mesh.hide_render = False
    rig.location = kit.to_blender(x, 0, z)
    rig.rotation_euler = (0, 0, heading)
    pose(rig, joints or {}, drop)


def seat(name, desk_index):
    x, _, z = PLAN["desks"][desk_index]["seat"]
    stand(name, x, z, math.pi, TYPING, SEATED_DROP)


def staff():
    """The first month: every desk taken."""
    hide_people()
    seat("dan", 1)
    seat("uyen", 2)
    seat("khoa", 3)
    seat("accountant", 4)
    seat("manager", 5)
    seat("deputy", 6)
    for index, name in zip(range(7, 11), ("worker_a", "worker_b", "worker_c", "worker_b")):
        # One model, several desks: a copy for each seat past the first.
        rig = bpy.data.objects[f"CHR_{name}_rig"]
        mesh = bpy.data.objects[f"CHR_{name}"]
        if rig.hide_render:
            seat(name, index)
        else:
            copy_rig = rig.copy()
            copy_rig.data = rig.data
            copy_mesh = mesh.copy()
            copy_mesh.parent = copy_rig
            copy_mesh.modifiers["skin"].object = copy_rig
            people_collection.objects.link(copy_rig)
            people_collection.objects.link(copy_mesh)
            x, _, z = PLAN["desks"][index]["seat"]
            copy_rig.location = kit.to_blender(x, 0, z)
            copy_rig.rotation_euler = (0, 0, math.pi)
            pose(copy_rig, TYPING, SEATED_DROP)
    stand("hr", 3.75, -0.3, 0)
    stand("boss", 3.9, -4.4, 0, TALKING)


def shoot(position, target, fov, path, width, height, samples):
    camera.location = kit.to_blender(*position)
    aim = Vector(kit.to_blender(*target))
    camera.rotation_euler = (aim - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera_data.angle_y = math.radians(fov)
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.cycles.samples = samples
    scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)
    print("RENDERED", path.name)


def characters_height(name):
    """The middle of the face and hair, for a shot that fits everyone's own height."""
    mesh = bpy.data.objects[f"CHR_{name}"]
    return max(v.co.z for v in mesh.data.vertices) - 0.2


# Every shot is from inside, or from where the missing wall would be: the ceiling stays, it lit all this.
bpy.data.objects["NEAR_WALL"].visible_camera = False

if "places" in stages:
    staff()
    for place in ("office", "desk", "meeting", "hallway", "home"):
        pose_data = CAMERAS[place]
        shoot(pose_data["position"], pose_data["target"], pose_data["fov"], out / "places" / f"{place}.png", 1280, 800, options.samples)

if "cover" in stages:
    staff()
    stand("player", -0.6, 3.05, math.pi - 0.15)
    # From above the walls, like the game's own overview: the ceiling goes, the page's ink shows.
    bpy.data.objects["CEILING"].visible_camera = False
    scene.render.film_transparent = True
    shoot((-3.8, 5.0, 8.6), (0.9, 0.55, 0.0), 38, out / "cover.png", 1920, 1200, options.samples * 2)
    scene.render.film_transparent = False
    bpy.data.objects["CEILING"].visible_camera = True

if "portraits" in stages:
    # A plain studio, away from everything, lit like the office and warmed like a promise.
    hide_people()
    scene.render.film_transparent = True
    studio = kit.new_collection("STUDIO")
    for name, position, power, color, size in (
        ("key", (101.2, 2.0, 2.4), 60, (1.0, 0.94, 0.84), 1.6),
        ("fill", (98.8, 1.6, 2.0), 22, (0.72, 0.8, 1.0), 2.0),
        ("rim", (100.4, 2.4, -1.4), 40, (1.0, 0.8, 0.5), 1.0),
    ):
        light = bpy.data.lights.new(name, "AREA")
        light.size = size
        light.energy = power
        light.color = color
        lamp = bpy.data.objects.new(name, light)
        studio.objects.link(lamp)
        lamp.location = kit.to_blender(*position)
        target_point = Vector(kit.to_blender(100, 1.25, 0))
        lamp.rotation_euler = (target_point - lamp.location).to_track_quat("-Z", "Y").to_euler()
    for name in ("player", "boss", "chairman", "manager", "deputy", "hr", "accountant", "dan", "uyen", "khoa"):
        hide_people()
        stand(name, 100, 0, -0.28)
        height = characters_height(name)
        shoot((100, height + 0.04, 1.9), (100, height, 0), 19, out / "portraits" / f"{name}.png", 320, 320, 64)
        bpy.data.objects[f"CHR_{name}_rig"].location = (0, 0, 0)
    scene.render.film_transparent = False
