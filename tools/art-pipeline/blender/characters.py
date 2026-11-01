"""Seven people and the colleagues nobody learns the names of (FEAT-029).

One body, dressed differently: dress and hair say who someone is. They are symbols, not portraits of
anyone (contracts/content.md). The bones all stand upright, so a bone's axes are the world's axes and
the game can swing an arm with `bone.rotation.x` without knowing how it was rigged.
"""
import math
import random
from dataclasses import dataclass, field

import bmesh
import bpy
from mathutils import Vector

from kit import Geo, hex_color, shade, to_blender

SKIN = "#e8b58e"
SKIN_DARK = "#d39a72"

BONES = {
    # name: (parent, x, y, z)
    "hips": (None, 0, 0.8, 0),
    "chest": ("hips", 0, 0.92, 0),
    "head": ("chest", 0, 1.22, 0),
    "eyes": ("head", 0, 1.385, 0.13),
    "armL": ("chest", 0.18, 1.15, 0),
    "foreL": ("armL", 0.22, 0.92, 0),
    "armR": ("chest", -0.18, 1.15, 0),
    "foreR": ("armR", -0.22, 0.92, 0),
    "legL": ("hips", 0.09, 0.78, 0),
    "shinL": ("legL", 0.095, 0.42, 0),
    "legR": ("hips", -0.09, 0.78, 0),
    "shinR": ("legR", -0.095, 0.42, 0),
}


@dataclass
class Look:
    top: str
    pants: str
    shoes: str = "#23284a"
    hair: str = "#2a2233"
    hairstyle: str = "short"
    sleeve: str = None
    skin: str = SKIN
    extras: tuple = ()
    build: float = 1.0  # shoulders and waist
    height: float = 1.0
    seed: int = 1


PEOPLE = {
    "player": Look("#f6efdf", "#3a4478", "#f4f0e6", "#2a2233", "short", extras=("lanyard",), seed=2),
    "boss": Look("#23284a", "#23284a", "#141627", "#3a3440", "sidepart", extras=("tie", "lapels"), build=1.14, height=1.03, seed=3),
    "hr": Look("#7a3a8c", "#2c2748", "#7a3a8c", "#1f1830", "bun", extras=("blouse", "clipboard"), seed=4, skin="#eebd98"),
    "accountant": Look("#e0a32e", "#4b4f6e", "#5a3a2c", "#6d6878", "curls", extras=("glasses",), build=1.08, height=0.96, seed=5),
    "dan": Look("#e2533c", "#2f3663", "#f4f0e6", "#201a28", "messy", extras=("hood",), seed=6, skin=SKIN_DARK),
    "uyen": Look("#1f8a86", "#f0e4cc", "#23284a", "#33202a", "ponytail", seed=7, skin="#eebd98"),
    "khoa": Look("#6fc3ff", "#3a4478", "#ff6b4a", "#2a2233", "short", extras=("backpack", "glasses"), seed=8),
    "chairman": Look("#c9ccd6", "#c9ccd6", "#141627", "#d8d8dc", "sidepart", extras=("redtie", "lapels"), build=1.1, height=1.05, seed=12),
    "manager": Look("#9ff0dc", "#2c3360", "#f4f0e6", "#1f1830", "short", extras=("lanyard", "star"), build=1.06, seed=13, skin=SKIN_DARK),
    "deputy": Look("#3e4f8a", "#4a4458", "#7a4628", "#3a2c26", "sidepart", extras=("blouse",), seed=14),
    "worker_a": Look("#c9d2e8", "#2f3663", hair="#3a2c26", hairstyle="short", seed=9, skin=SKIN_DARK),
    "worker_b": Look("#f2a93b", "#3a4478", hair="#201a28", hairstyle="bob", seed=10),
    "worker_c": Look("#8e5fc0", "#23284a", hair="#2a2233", hairstyle="sidepart", seed=11),
}

HIP_HEIGHT = 0.8
LEG_SCALE = 0.88
HEAD_SCALE = 1.2
NECK = 1.22


def stylize(y):
    """Shorter legs than life: at a hundred pixels tall, a big head is what reads as a person."""
    return y * LEG_SCALE if y < HIP_HEIGHT else y - HIP_HEIGHT * (1 - LEG_SCALE)


def head_scaled(point):
    x, y, z = point
    return (x * HEAD_SCALE, NECK + (y - NECK) * HEAD_SCALE, z * HEAD_SCALE)


def limb(g, top, bottom, r_top, r_bottom, color, sides=8):
    ax, ay, az = top
    bx, by, bz = bottom
    mid = lambda t: (ax + (bx - ax) * t, ay + (by - ay) * t, az + (bz - az) * t)
    rings = [
        (*mid(1.0), r_bottom, r_bottom),
        (*mid(0.5), (r_top + r_bottom) / 2 * 1.04, (r_top + r_bottom) / 2 * 1.04),
        (*mid(0.04), r_top, r_top),
        (ax, ay + r_top * 0.5, az, r_top * 0.6, r_top * 0.6),
    ]
    g.loft(rings, color, sides, close_top=True, close_bottom=True)


def shoe(g, x, color):
    g.loft(
        [
            (x, 0.0, 0.035, 0.05, 0.12),
            (x, 0.05, 0.03, 0.055, 0.115),
            (x, 0.085, 0.0, 0.052, 0.075),
            (x, 0.11, -0.01, 0.045, 0.05),
        ],
        color,
        8,
    )


def build_body(look):
    """Returns {bone: Geo}. The character faces +Z with feet at y = 0."""
    parts = {name: Geo() for name in BONES}
    rng = random.Random(look.seed)
    top, pants = look.top, look.pants
    sleeve = look.sleeve or top
    w = look.build

    # Legs: the thigh and the shin overlap, so a bent knee opens no gap.
    for side, leg, shin, sign in (("L", "legL", "shinL", 1), ("R", "legR", "shinR", -1)):
        limb(parts[leg], (sign * 0.09, 0.8, 0), (sign * 0.095, 0.41, 0), 0.088, 0.066, pants)
        limb(parts[shin], (sign * 0.095, 0.43, 0), (sign * 0.098, 0.08, 0), 0.066, 0.05, pants)
        shoe(parts[shin], sign * 0.098, look.shoes)

    parts["hips"].loft(
        [
            (0, 0.71, 0, 0.13 * w, 0.095),
            (0, 0.79, 0, 0.165 * w, 0.115),
            (0, 0.9, 0, 0.15 * w, 0.105),
        ],
        pants,
        10,
    )
    parts["chest"].loft(
        [
            (0, 0.84, 0, 0.158 * w, 0.112),
            (0, 0.98, 0, 0.17 * w, 0.122),
            (0, 1.1, 0, 0.185 * w, 0.125),
            (0, 1.18, 0, 0.17 * w, 0.105),
            (0, 1.225, 0, 0.09, 0.075),
        ],
        top,
        10,
    )
    parts["chest"].loft([(0, 1.2, 0, 0.05, 0.05), (0, 1.29, 0, 0.048, 0.048)], look.skin, 8, close_top=False)

    for arm, fore, sign in (("armL", "foreL", 1), ("armR", "foreR", -1)):
        x = 0.178 * w
        limb(parts[arm], (sign * x, 1.15, 0), (sign * (x + 0.04), 0.91, 0), 0.058, 0.047, sleeve)
        limb(parts[fore], (sign * (x + 0.04), 0.93, 0), (sign * (x + 0.052), 0.7, 0.01), 0.047, 0.038, sleeve)
        parts[fore].blob(sign * (x + 0.054), 0.655, 0.012, 0.04, 0.052, 0.04, look.skin, 7, 4, smooth=True)

    head = parts["head"]
    cy = 1.385
    r = 0.155
    # One skin from chin to crown: a second shape for the jaw shows through when smoothed.
    head.loft(
        [
            (0, cy - 0.15, 0.012, r * 0.42, r * 0.5),
            (0, cy - 0.125, 0.012, r * 0.72, r * 0.8),
            (0, cy - 0.07, 0.006, r * 0.9, r * 0.96),
            (0, cy, 0, r * 0.98, r),
            (0, cy + 0.075, 0, r * 0.94, r * 0.96),
            (0, cy + 0.125, 0, r * 0.7, r * 0.72),
            (0, cy + 0.155, 0, r * 0.3, r * 0.32),
        ],
        look.skin,
        12,
    )
    # Ears, and a nose so that the head has a front from any angle.
    for sign in (1, -1):
        head.blob(sign * r * 0.97, cy - 0.01, 0, 0.022, 0.035, 0.02, look.skin, 6, 4, smooth=True)
    head.blob(0, cy - 0.03, r * 0.98, 0.016, 0.018, 0.02, shade(look.skin, -0.1), 6, 4, smooth=True)
    head.box(-0.022, 0.022, cy - 0.082, cy - 0.074, r * 0.86, r * 0.9, "#7a3f3a", "y")

    eyes = parts["eyes"]
    for sign in (1, -1):
        eyes.blob(sign * 0.058, cy, r * 0.93, 0.016, 0.02, 0.008, "#16182c", 6, 4, smooth=True)
    for sign in (1, -1):
        head.box(sign * 0.058 - 0.026, sign * 0.058 + 0.026, cy + 0.04, cy + 0.052, r * 0.9, r * 0.96, look.hair, "y")

    hairdo(parts, look, cy, r, rng)
    extras(parts, look, cy, r)
    return parts


def hairdo(parts, look, cy, r, rng):
    head = parts["head"]
    hair = look.hair
    style = look.hairstyle
    cap = lambda rise, back=0.0, jitter=0.0: head.blob(
        0, cy + 0.008, -0.006, r * 1.07, r * 1.1, r * 1.09, hair, 12, 8, jitter, rng, smooth=jitter == 0,
        # Keep what is above a hairline that runs from the forehead down to the nape.
        keep=lambda x, y, z: (y - cy) + max(0.0, -z) * (0.9 + back) - max(0.0, z) * 0.3 > rise,
    )
    if style == "short":
        cap(0.015)
    elif style == "sidepart":
        cap(0.03, 0.1)
        head.blob(0.04, cy + 0.13, 0.08, 0.12, 0.05, 0.08, hair, 8, 5, smooth=True)
    elif style == "messy":
        cap(0.02, 0.0, 0.06)
        for i in range(9):
            a = i * 2.4
            head.blob(
                math.sin(a) * 0.1, cy + 0.12 + rng.uniform(0, 0.04), math.cos(a) * 0.09 - 0.02,
                0.05, 0.06, 0.05, hair, 5, 3, 0.2, rng,
            )
    elif style == "bun":
        cap(0.03, 0.2)
        head.blob(0, cy + 0.1, -0.15, 0.075, 0.075, 0.075, hair, 9, 6, smooth=True)
    elif style == "ponytail":
        cap(0.0, 0.2)
        head.blob(0, cy + 0.04, -0.17, 0.04, 0.04, 0.04, "#ffc83d", 7, 4, smooth=True)
        parts["chest"].loft(
            [
                (0, 1.03, -0.19, 0.01, 0.01),
                (0, 1.14, -0.2, 0.05, 0.05),
                (0, 1.32, -0.19, 0.06, 0.06),
                (0, 1.42, -0.17, 0.04, 0.04),
            ],
            hair,
            8,
        )
    elif style == "bob":
        cap(-0.03, -0.1)
        for sign in (1, -1):
            head.blob(sign * 0.13, cy - 0.06, -0.03, 0.05, 0.13, 0.11, hair, 8, 5, smooth=True)
        head.blob(0, cy - 0.04, -0.12, 0.13, 0.13, 0.07, hair, 8, 5, smooth=True)
    elif style == "curls":
        for i in range(26):
            polar = math.acos(1 - 1.4 * (i + 0.5) / 26)
            azimuth = i * 2.4
            x = math.sin(polar) * math.sin(azimuth) * r * 1.02
            y = math.cos(polar) * r * 1.02
            z = math.sin(polar) * math.cos(azimuth) * r * 1.02 - 0.03
            if y + (-z) * 0.5 > 0.0:
                head.blob(x, cy + y + 0.02, z, 0.055, 0.052, 0.055, hair, 6, 4, 0.1, rng)


def extras(parts, look, cy, r):
    chest = parts["chest"]
    front = 0.125
    if "tie" in look.extras:
        chest.box(-0.05, 0.05, 1.12, 1.2, front - 0.01, front + 0.012, "#f6efdf", "y")
        chest.face([(-0.022, 1.17, front + 0.02), (0.022, 1.17, front + 0.02), (0.034, 0.92, front + 0.012), (0, 0.87, front + 0.012), (-0.034, 0.92, front + 0.012)], "#ffc83d")
    if "redtie" in look.extras:
        chest.box(-0.05, 0.05, 1.12, 1.2, front - 0.01, front + 0.012, "#f6efdf", "y")
        chest.face([(-0.022, 1.17, front + 0.02), (0.022, 1.17, front + 0.02), (0.034, 0.92, front + 0.012), (0, 0.87, front + 0.012), (-0.034, 0.92, front + 0.012)], "#c8352b")
    if "star" in look.extras:
        chest.blob(-0.09, 1.08, front + 0.004, 0.03, 0.03, 0.012, "#ffc83d", 5, 3, smooth=False)
    if "lapels" in look.extras:
        for sign in (1, -1):
            chest.face(
                [(sign * 0.06, 1.22, 0.1), (sign * 0.015, 0.98, front + 0.012), (sign * 0.13, 1.06, front + 0.005)][:: -sign],
                shade(look.top, 0.35),
            )
    if "blouse" in look.extras:
        chest.face([(-0.05, 1.2, front), (0, 1.03, front + 0.012), (0.05, 1.2, front)][:: -1], "#f6efdf")
    if "lanyard" in look.extras:
        for sign in (1, -1):
            chest.rod((sign * 0.06, 1.2, 0.06), (0, 0.98, front + 0.01), 0.006, "#23a58c", 4)
        chest.box(-0.04, 0.04, 0.9, 0.98, front + 0.004, front + 0.012, "#ffffff", "y")
    if "hood" in look.extras:
        chest.blob(0, 1.2, -0.1, 0.15, 0.09, 0.09, shade(look.top, -0.12), 8, 5, smooth=True)
        for sign in (1, -1):
            chest.rod((sign * 0.03, 1.15, front), (sign * 0.03, 1.03, front + 0.01), 0.005, "#f6efdf", 4)
    if "glasses" in look.extras:
        head = parts["head"]
        z = r * 1.0
        for sign in (1, -1):
            x = sign * 0.058
            for a, b in (((x - 0.04, cy + 0.03), (x + 0.04, cy + 0.03)), ((x - 0.04, cy - 0.03), (x + 0.04, cy - 0.03)), ((x - 0.04, cy - 0.03), (x - 0.04, cy + 0.03)), ((x + 0.04, cy - 0.03), (x + 0.04, cy + 0.03))):
                head.rod((a[0], a[1], z), (b[0], b[1], z), 0.0055, "#16182c", 4)
    if "backpack" in look.extras:
        chest.loft([(0, 0.86, -0.19, 0.14, 0.08), (0, 1.0, -0.2, 0.155, 0.09), (0, 1.14, -0.19, 0.13, 0.075)], "#ffc83d", 10)
        for sign in (1, -1):
            chest.rod((sign * 0.12, 1.19, 0.0), (sign * 0.12, 0.95, 0.125), 0.016, "#c98f1a", 4)
    if "clipboard" in look.extras:
        fore = parts["foreL"]
        fore.box(0.16, 0.2, 0.72, 0.98, 0.1, 0.32, "#7a4628", "")
        fore.box(0.155, 0.16, 0.74, 0.96, 0.12, 0.3, "#f6efdf", "yY")


def to_skinned(name, parts, collection, material, height):
    """All the parts become one mesh, each stuck entirely to its bone: one draw call per person."""
    merged = Geo()
    ranges = {}
    for bone, geo in parts.items():
        start = len(merged.verts)
        merged.verts.extend(head_scaled(p) if bone in ("head", "eyes") else p for p in geo.verts)
        for indices, rgb, mat, uvs, smooth in geo.faces:
            merged.faces.append(([i + start for i in indices], rgb, mat, uvs, smooth))
        ranges[bone] = (start, len(merged.verts))
    merged.verts = [(x, stylize(y) * height, z) for x, y, z in merged.verts]
    obj = merged.to_object(name, collection, {"base": material})
    for bone, (start, end) in ranges.items():
        if end > start:
            obj.vertex_groups.new(name=bone).add(list(range(start, end)), 1.0, "REPLACE")
    # Faces arrive with vertices of their own: smooth shading needs them shared.
    welded = bmesh.new()
    welded.from_mesh(obj.data)
    bmesh.ops.remove_doubles(welded, verts=welded.verts, dist=0.0004)
    welded.to_mesh(obj.data)
    welded.free()

    armature_data = bpy.data.armatures.new(f"{name}_rig")
    rig = bpy.data.objects.new(f"{name}_rig", armature_data)
    collection.objects.link(rig)
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    edit = {}
    for bone, (parent, x, y, z) in BONES.items():
        b = armature_data.edit_bones.new(bone)
        point = head_scaled((x, y, z)) if bone == "eyes" else (x, y, z)
        origin = Vector(to_blender(point[0], stylize(point[1]) * height, point[2]))
        b.head = origin
        b.tail = origin + Vector((0, 0, 0.06))
        b.roll = 0.0
        b.use_deform = True
        if parent:
            b.parent = edit[parent]
        edit[bone] = b
    bpy.ops.object.mode_set(mode="OBJECT")
    obj.parent = rig
    modifier = obj.modifiers.new("skin", "ARMATURE")
    modifier.object = rig
    return rig, obj
