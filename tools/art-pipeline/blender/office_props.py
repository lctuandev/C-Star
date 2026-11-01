"""Furniture, each built around its own origin on the floor, measured in metres like the real thing."""
import math
import random

from kit import shade

LAMINATE = "#f0dfbf"
DESK_LEG = "#23284a"
FABRIC = "#1f8a86"
FABRIC_TRIM = "#f4ecdc"
CHAIR = "#1b1f3a"
CHAIR_SEAT = "#f2a93b"
METAL = "#aab2c8"
DARK = "#12152a"
PLASTIC = "#e8e6df"
WOOD = "#b87441"
WOOD_DARK = "#7a4628"
PAPER = "#f6efdf"
WHITE = "#f7f4ec"
GOLD = "#ffc83d"
CORAL = "#ff6b4a"
SKY = "#6fc3ff"
GREEN = ("#2fa866", "#1f8a55", "#4cc47c", "#2a9a70")
DRY = ("#9a7f45", "#7a6233", "#ad9256", "#675228")


def office_chair(g, turned=0.0, tall=False):
    with g.at(yaw=turned):
        for i in range(5):
            a = i * 2 * math.pi / 5
            tip = (math.sin(a) * 0.27, 0.06, math.cos(a) * 0.27)
            g.rod((0, 0.12, 0), tip, 0.018, CHAIR, 4)
            g.block(tip[0], tip[2], 0.05, 0.05, 0.0, 0.06, DARK)
        g.cylinder(0, 0, 0.1, 0.42, 0.03, 0.025, METAL, 6)
        g.bevel_box(0, 0, 0.46, 0.46, 0.42, 0.5, CHAIR_SEAT, 0.03, skip_bottom=False)
        height = 1.12 if tall else 0.92
        g.rod((0, 0.46, 0.2), (0, 0.62, 0.25), 0.02, CHAIR, 4)
        back = [(-0.21, 0.58, 0.23), (0.21, 0.58, 0.23), (0.19, height, 0.27), (-0.19, height, 0.27)]
        front = [(p[0], p[1], p[2] - 0.05) for p in back]
        g.face(front, CHAIR_SEAT)
        g.face(back[::-1], CHAIR)
        for side in (-1, 1):
            g.block(side * 0.25, 0.04, 0.05, 0.26, 0.66, 0.69, CHAIR)
            g.rod((side * 0.22, 0.48, 0.08), (side * 0.25, 0.66, 0.08), 0.012, CHAIR, 4)


def monitor(g, x=0.0, z=-0.18, yaw=0.0, wide=0.54):
    """Faces +Z. The screen itself is a separate picture, so that it can be off."""
    with g.at(x, 0.74, z, yaw):
        g.block(0, 0, 0.2, 0.15, 0.0, 0.015, DARK, skip="y")
        g.block(0, -0.02, 0.05, 0.03, 0.015, 0.2, DARK, skip="yY")
        g.block(0, 0, wide, 0.03, 0.12, 0.45, DARK, skip="")


def screen_quad(g, rect, x=0.0, z=-0.18, yaw=0.0, wide=0.54):
    with g.at(x, 0.74, z, yaw):
        w = wide - 0.03
        g.quad_uv([(-w / 2, 0.135, 0.016), (w / 2, 0.135, 0.016), (w / 2, 0.435, 0.016), (-w / 2, 0.435, 0.016)], rect, "glow")


def workstation(g, left_wall=True):
    """A cubicle seen from above: desk, fabric at the back and one side. The chair is apart."""
    g.bevel_box(0, 0, 1.5, 0.74, 0.7, 0.74, LAMINATE, 0.012, top_color=shade(LAMINATE, 0.04))
    for x in (-0.7, 0.7):
        g.block(x, 0, 0.05, 0.64, 0, 0.7, DESK_LEG, skip="yY")
    g.block(0, -0.26, 1.34, 0.025, 0.28, 0.7, DESK_LEG, skip="yY")
    g.block(0, -0.42, 1.6, 0.05, 0, 1.16, FABRIC, skip="yY")
    g.block(0, -0.42, 1.62, 0.06, 1.16, 1.19, FABRIC_TRIM)
    if left_wall:
        g.block(-0.8, 0.05, 0.05, 0.9, 0, 1.16, shade(FABRIC, -0.08), skip="yY")
        g.block(-0.8, 0.05, 0.06, 0.92, 1.16, 1.19, FABRIC_TRIM)
    g.block(0, 0.1, 0.42, 0.14, 0.74, 0.76, DARK, skip="y")
    g.block(0.3, 0.1, 0.06, 0.1, 0.74, 0.765, shade(DARK, 0.5), skip="y")
    # The tower under the desk and a bin beside it: empty desks keep them.
    g.block(0.52, -0.05, 0.18, 0.4, 0, 0.4, DARK, skip="y")


def desk_clutter(g, rng):
    """What makes a desk someone's. It goes when they do."""
    kinds = rng.sample(["mug", "papers", "plant", "notes", "folders", "frame", "cup", "stack"], 4)
    spots = [(-0.56, 0.12), (0.56, 0.2), (-0.5, -0.18), (0.5, -0.2)]
    for kind, (x, z) in zip(kinds, spots):
        with g.at(x, 0.74, z, rng.uniform(-0.3, 0.3)):
            if kind == "mug":
                g.cylinder(0, 0, 0, 0.1, 0.045, 0.045, rng.choice([WHITE, CORAL, SKY, GOLD]), 8, caps="Y")
            elif kind == "cup":
                g.cylinder(0, 0, 0, 0.14, 0.03, 0.045, WHITE, 8)
                g.cylinder(0, 0, 0.14, 0.155, 0.047, 0.04, DARK, 8)
            elif kind == "papers":
                for i in range(4):
                    g.block(0.01 * (i % 2), 0, 0.21, 0.29, i * 0.008, i * 0.008 + 0.008, PAPER, skip="y")
            elif kind == "stack":
                for i, color in enumerate((CORAL, SKY, PAPER)):
                    g.block(0, 0, 0.2 - i * 0.02, 0.27, i * 0.03, i * 0.03 + 0.03, color, skip="y")
            elif kind == "plant":
                g.cylinder(0, 0, 0, 0.08, 0.04, 0.055, WHITE, 8)
                g.blob(0, 0.13, 0, 0.075, 0.07, 0.075, rng.choice(GREEN), 6, 3, 0.15, rng)
            elif kind == "notes":
                for i in range(3):
                    g.block(i * 0.08 - 0.08, 0, 0.07, 0.07, 0, 0.012, rng.choice([GOLD, CORAL, SKY]), skip="y")
            elif kind == "folders":
                for i in range(3):
                    g.block(i * 0.05 - 0.05, 0, 0.04, 0.24, 0, 0.3, rng.choice([CORAL, GOLD, SKY, FABRIC_TRIM]), skip="y")
            elif kind == "frame":
                g.block(0, 0, 0.14, 0.02, 0, 0.18, DARK, skip="y")
                g.block(0, 0.012, 0.11, 0.005, 0.03, 0.15, PAPER, skip="y")


def meeting_chair(g, turned=0.0):
    with g.at(yaw=turned):
        for x, z in ((-0.2, -0.2), (0.2, -0.2), (-0.2, 0.2), (0.2, 0.2)):
            g.rod((x, 0.45, z), (x * 1.15, 0, z * 1.15), 0.014, METAL, 4)
        g.bevel_box(0, 0, 0.48, 0.48, 0.45, 0.52, "#6a2f6e", 0.03, skip_bottom=False)
        g.face([(-0.2, 0.6, 0.2), (0.2, 0.6, 0.2), (0.2, 0.92, 0.24), (-0.2, 0.92, 0.24)], "#6a2f6e")
        g.face([(-0.2, 0.92, 0.26), (0.2, 0.92, 0.26), (0.2, 0.6, 0.22), (-0.2, 0.6, 0.22)], "#4a2150")
        for side in (-1, 1):
            g.rod((side * 0.2, 0.5, 0.2), (side * 0.2, 0.9, 0.25), 0.014, METAL, 4)


def file_cabinet(g, rng):
    g.block(0, 0, 0.58, 0.56, 0, 1.36, "#5f6d9c", skip="y")
    for i in range(4):
        y = 0.08 + i * 0.32
        g.block(0, 0.285, 0.52, 0.015, y, y + 0.28, "#7486b8", skip="yz")
        g.block(0, 0.3, 0.16, 0.02, y + 0.18, y + 0.205, "#e8e6df", skip="yz")
        g.block(0, 0.297, 0.14, 0.006, y + 0.09, y + 0.15, PAPER, skip="yz")
    for i in range(rng.randint(2, 5)):
        g.block(-0.2 + i * 0.09, 0, 0.075, 0.26, 1.36, 1.68, rng.choice([CORAL, GOLD, SKY, FABRIC, WHITE]), skip="y")


def sofa(g):
    """Faces +Z, 1.9 m long. The one soft thing in the office."""
    fabric, dark = "#e2533c", "#b23c2c"
    g.bevel_box(0, 0.02, 1.9, 0.82, 0.12, 0.3, dark, 0.03)
    for x in (-0.62, 0, 0.62):
        g.bevel_box(x, 0.08, 0.6, 0.68, 0.3, 0.44, fabric, 0.05)
        g.bevel_box(x, -0.3, 0.6, 0.2, 0.42, 0.82, fabric, 0.06)
    for x in (-1.02, 1.02):
        g.bevel_box(x, 0.02, 0.2, 0.84, 0.12, 0.62, dark, 0.05)
    for x, z in ((-0.9, 0.34), (0.9, 0.34), (-0.9, -0.34), (0.9, -0.34)):
        g.block(x, z, 0.06, 0.06, 0, 0.12, WOOD_DARK)
    g.bevel_box(-0.62, 0.0, 0.34, 0.14, 0.44, 0.74, GOLD, 0.04)


def floor_lamp(g):
    g.cylinder(0, 0, 0, 0.03, 0.15, 0.15, DARK, 10)
    g.cylinder(0, 0, 0.03, 1.5, 0.012, 0.012, METAL, 6, caps="")
    g.cylinder(0, 0, 1.5, 1.72, 0.2, 0.13, "#f2e2c0", 10)


def potted_palm(g, rng, leaves=GREEN):
    g.cylinder(0, 0, 0, 0.36, 0.16, 0.2, "#cfd2c8", 10)
    g.cylinder(0, 0, 0.3, 0.36, 0.18, 0.18, "#3a2c20", 10)
    g.cylinder(0, 0, 0.36, 0.95, 0.03, 0.02, WOOD_DARK, 6, caps="")
    for i in range(9):
        a = i * 2.4
        length = rng.uniform(0.45, 0.72)
        tip = (math.sin(a) * length, 0.98 + rng.uniform(-0.1, 0.25), math.cos(a) * length)
        mid = (tip[0] * 0.5, 1.28 + rng.uniform(-0.05, 0.1), tip[2] * 0.5)
        side = (math.cos(a) * 0.09, 0, -math.sin(a) * 0.09)
        base = (0, 0.95, 0)
        color = rng.choice(leaves)
        g.face([base, (mid[0] - side[0], mid[1], mid[2] - side[2]), (mid[0] + side[0], mid[1], mid[2] + side[2])], color)
        g.face([base, (mid[0] + side[0], mid[1], mid[2] + side[2]), (mid[0] - side[0], mid[1], mid[2] - side[2])], color)
        g.face([(mid[0] - side[0], mid[1], mid[2] - side[2]), tip, (mid[0] + side[0], mid[1], mid[2] + side[2])], color)
        g.face([(mid[0] + side[0], mid[1], mid[2] + side[2]), tip, (mid[0] - side[0], mid[1], mid[2] - side[2])], color)


def coffee_machine(g):
    """As big as a fridge, the story says. It is the first thing to go."""
    steel, dark = "#d4d9e4", "#23284a"
    g.bevel_box(0, 0, 0.82, 0.68, 0, 1.72, steel, 0.03)
    g.block(0, -0.34, 0.74, 0.02, 0.1, 0.5, dark, skip="yZ")
    g.block(0, -0.345, 0.6, 0.03, 0.62, 1.05, dark, skip="yZ")
    g.block(0, -0.35, 0.7, 0.02, 1.15, 1.6, "#ff6b4a", skip="yZ")
    for x in (-0.14, 0.14):
        g.cylinder(x, -0.31, 0.72, 0.84, 0.03, 0.02, steel, 6)
    for i in range(4):
        g.cylinder(-0.24 + i * 0.16, -0.36, 1.26, 1.3, 0.05, 0.05, GOLD, 8)
    g.block(0, -0.36, 0.5, 0.04, 0.5, 0.53, steel, skip="y")


def kitchen_run(g, length):
    """A counter along Z, its doors toward +X, and cupboards over the half nearest -Z."""
    body, top = "#f0ece2", "#23284a"
    g.block(0, 0, 0.62, length, 0, 0.88, body, skip="y")
    g.bevel_box(0.02, 0, 0.66, length + 0.04, 0.88, 0.92, top, 0.01)
    doors = int(length / 0.6)
    for i in range(doors):
        z = -length / 2 + (i + 0.5) * length / doors
        g.block(0.315, z, 0.012, length / doors - 0.03, 0.08, 0.84, shade(body, 0.05), skip="yx")
        g.block(0.33, z + 0.18, 0.02, 0.02, 0.62, 0.76, METAL)
    g.block(0.12, -length / 4, 0.36, length / 2, 1.5, 2.2, body, skip="")
    for i in range(2):
        z = -length / 2 + (i + 0.5) * length / 4
        g.block(0.305, z, 0.012, length / 4 - 0.03, 1.53, 2.17, shade(body, 0.04), skip="yx")
        g.block(0.32, z + length / 8 - 0.06, 0.02, 0.02, 1.58, 1.74, METAL)
    # Microwave and kettle: this is where lunch happens.
    g.bevel_box(0.05, length / 2 - 0.5, 0.42, 0.56, 0.92, 1.22, "#2c3360", 0.012)
    g.block(0.265, length / 2 - 0.56, 0.01, 0.36, 0.96, 1.18, DARK)
    g.cylinder(0.08, 0.1, 0.92, 1.12, 0.09, 0.07, METAL, 8)
    for i in range(3):
        g.cylinder(0.1, -0.5 + i * 0.13, 0.92, 1.01, 0.04, 0.04, (CORAL, GOLD, WHITE)[i], 8)


def fridge(g):
    g.bevel_box(0, 0, 0.66, 0.66, 0, 1.8, "#e8e6df", 0.03)
    g.block(0, 0.335, 0.62, 0.01, 1.2, 1.2 + 0.012, DARK)
    g.block(-0.24, 0.345, 0.03, 0.03, 0.8, 1.12, METAL)
    g.block(-0.24, 0.345, 0.03, 0.03, 1.28, 1.56, METAL)


def vending_body(g):
    g.bevel_box(0, 0, 0.94, 0.72, 0, 1.86, "#c8352b", 0.02)
    g.block(0.3, 0.365, 0.14, 0.01, 0.7, 1.2, METAL)
    g.block(-0.12, 0.365, 0.52, 0.01, 0.12, 0.3, DARK)


def water_cooler(g):
    g.block(0, 0, 0.32, 0.32, 0, 1.0, PLASTIC, skip="y")
    g.block(0, 0.165, 0.2, 0.01, 0.74, 0.92, DARK)
    g.cylinder(0, 0, 1.0, 1.4, 0.15, 0.15, SKY, 10)
    g.cylinder(0, 0, 1.4, 1.46, 0.15, 0.04, SKY, 10)


def copier(g):
    g.bevel_box(0, 0, 0.9, 0.62, 0, 0.98, "#c9ced0", 0.02)
    g.block(0, 0.32, 0.86, 0.01, 0.1, 0.8, "#b4babc")
    g.bevel_box(0, -0.04, 0.84, 0.5, 0.98, 1.12, "#aeb4b6", 0.015)
    g.block(0.3, 0.2, 0.2, 0.14, 1.12, 1.135, DARK)
    g.block(-0.5, 0, 0.1, 0.34, 0.74, 0.82, PAPER, skip="y")


def round_table(g):
    g.cylinder(0, 0, 0, 0.03, 0.26, 0.26, DARK, 12)
    g.cylinder(0, 0, 0.03, 1.0, 0.03, 0.03, METAL, 6, caps="")
    g.cylinder(0, 0, 1.0, 1.04, 0.42, 0.42, LAMINATE, 14, caps="Yy", smooth=False)


def stool(g):
    g.cylinder(0, 0, 0, 0.02, 0.17, 0.17, DARK, 10)
    g.cylinder(0, 0, 0.02, 0.66, 0.02, 0.02, METAL, 6, caps="")
    g.cylinder(0, 0, 0.66, 0.72, 0.17, 0.17, CHAIR_SEAT, 10, smooth=False)


def fruit_bowl(g):
    g.cylinder(0, 0, 1.04, 1.13, 0.1, 0.2, "#d9dcd4", 12, caps="")
    g.cylinder(0, 0, 1.05, 1.06, 0.1, 0.1, "#c0c4bc", 12)


def fruit(g, rng, stage):
    pieces = {
        "full": ((-0.09, -0.05, CORAL), (0.09, -0.06, "#e89a3c"), (0, 0.09, "#8e3f8e"), (-0.05, 0.02, "#d9423f"), (0.07, 0.05, "#e8c33c")),
        "half": ((-0.07, 0.0, "#e89a3c"), (0.08, 0.03, "#e8c33c")),
        "bananas": (),
    }[stage]
    for x, z, color in pieces:
        g.blob(x, 1.14, z, 0.058, 0.056, 0.058, color, 7, 4, 0.05, rng, smooth=True)
    if stage in ("full", "bananas"):
        for i in range(3):
            g.rod((-0.1, 1.13 + i * 0.02, -0.04 + i * 0.03), (0.13, 1.16 + i * 0.02, 0.05 - i * 0.03), 0.016, "#e8d24a", 5)


def planter(g, rng, leaves, sparse=False):
    """One of the five boxes on the wall of plants. Sticks out toward +X."""
    g.block(0.1, 0, 0.2, 0.76, 0, 0.24, "#23284a", skip="")
    for i in range(5 if sparse else 13):
        z = rng.uniform(-0.36, 0.36)
        y = rng.uniform(0.2, 0.55)
        size = rng.uniform(0.07, 0.13) if sparse else rng.uniform(0.11, 0.2)
        g.blob(0.13 + rng.uniform(-0.04, 0.08), y, z, size, size * 1.1, size, rng.choice(leaves), 5, 3, 0.22, rng)


def bench(g):
    g.bevel_box(0, 0, 1.4, 0.4, 0.42, 0.47, WOOD, 0.012)
    for x in (-0.6, 0.6):
        g.block(x, 0, 0.05, 0.34, 0, 0.42, DARK, skip="yY")


def charging_post(g):
    g.block(0, 0, 0.16, 0.12, 0, 1.2, FABRIC, skip="y")
    g.block(0, 0.02, 0.3, 0.24, 1.2, 1.23, LAMINATE)
    with g.at(0, 1.23, 0.02, 0.3):
        g.block(0, 0, 0.08, 0.15, 0, 0.012, DARK, skip="y")


def rug(g, x0, x1, z0, z1, color, stripe):
    g.face([(x0, 0.012, z1), (x1, 0.012, z1), (x1, 0.012, z0), (x0, 0.012, z0)], color)
    g.face([(x0 + 0.12, 0.014, z1 - 0.12), (x1 - 0.12, 0.014, z1 - 0.12), (x1 - 0.12, 0.014, z1 - 0.2), (x0 + 0.12, 0.014, z1 - 0.2)], stripe)
    g.face([(x0 + 0.12, 0.014, z0 + 0.2), (x1 - 0.12, 0.014, z0 + 0.2), (x1 - 0.12, 0.014, z0 + 0.12), (x0 + 0.12, 0.014, z0 + 0.12)], stripe)


def trash_bin(g):
    g.cylinder(0, 0, 0, 0.34, 0.11, 0.14, "#2c3360", 8, caps="y")


def cardboard_box(g, rng):
    color = "#b08a5e"
    g.block(0, 0, 0.44, 0.34, 0, 0.26, color, skip="y")
    g.block(0, 0, 0.45, 0.04, 0.26, 0.262, shade(color, -0.2), skip="y")
    for i in range(2):
        g.block(-0.1 + i * 0.16, 0.05, 0.1, 0.1, 0.26, 0.32 + i * 0.06, rng.choice([CORAL, SKY, GOLD]), skip="y")
