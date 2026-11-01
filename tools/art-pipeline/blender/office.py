"""The building: one office, one rented room, every piece placed from the plan below (FEAT-028).

Positions here are the ones the web app reads back from office-plan.json, so the map, the seats and
the walls cannot drift apart. Near walls and ceilings exist for the light and are never exported.
"""
import json
import math
import random
from pathlib import Path

import bpy

import office_props as P
from kit import Geo, glass_material, glow_material, base_material, hex_color, new_collection, shade, to_blender

HERE = Path(__file__).parent
DECALS = json.loads((HERE.parent / "textures/decals.json").read_text())

ROOM_HEIGHT = 2.8
WALL = "#b4bfdc"
WALL_LOW = "#6878ad"
SKIRT = "#23284a"
CUT = "#10132a"  # the sawn top of a wall, seen from above
GLASS_FRAME = "#23284a"

DESK_X = (-4.5, -2.1, 0.3)
DESK_Z = (-2.6, -1.0, 0.6, 2.2)
CHAIR_Z = 0.64
# Order matters: desks empty from the end of this list (`officeMood`), so the player's comes first.
DESK_ORDER = (
    (1, 3), (0, 2), (2, 2), (1, 2), (0, 0),
    (0, 3), (2, 3), (1, 1), (2, 1), (0, 1), (1, 0), (2, 0),
)
SCREENS = ("screen_board", "screen_sheet", "screen_mail", "screen_code")


def rect(name):
    return tuple(DECALS[name])


def desks():
    return [(DESK_X[c], DESK_Z[r]) for c, r in DESK_ORDER]


class Plan:
    """What the game needs to know about what was built."""

    def __init__(self):
        self.solids = []

    def solid(self, cx, cz, w, d):
        self.solids.append([round(cx - w / 2, 3), round(cz - d / 2, 3), round(cx + w / 2, 3), round(cz + d / 2, 3)])

    def line(self, x0, z0, x1, z1):
        self.solids.append([min(x0, x1), min(z0, z1), max(x0, x1), max(z0, z1)])


def tiles(g, x0, x1, z0, z1, size, colors, rng, y=0.0):
    nx, nz = round((x1 - x0) / size), round((z1 - z0) / size)
    for i in range(nx):
        for j in range(nz):
            a, b = x0 + i * (x1 - x0) / nx, x0 + (i + 1) * (x1 - x0) / nx
            c, d = z0 + j * (z1 - z0) / nz, z0 + (j + 1) * (z1 - z0) / nz
            g.face([(a, y, d), (b, y, d), (b, y, c), (a, y, c)], rng.choice(colors))


def planks(g, x0, x1, z0, z1, width, colors, rng, y=0.0):
    """Runs along X with staggered joints."""
    rows = round((z1 - z0) / width)
    for j in range(rows):
        c, d = z0 + j * (z1 - z0) / rows, z0 + (j + 1) * (z1 - z0) / rows
        x = x0 - rng.uniform(0, 1.2)
        while x < x1:
            run = rng.uniform(0.9, 1.6)
            a, b = max(x, x0), min(x + run, x1)
            if b > a:
                g.face([(a, y, d), (b, y, d), (b, y, c), (a, y, c)], rng.choice(colors))
            x += run


def wall_x(g, x, z0, z1, side, height=ROOM_HEIGHT, color=WALL, low=WALL_LOW):
    """A wall along Z whose visible face looks toward `side`. Dado and skirting are part of it."""
    near = x + side * 0.05
    far = x - side * 0.05
    a, b = sorted((near, far))
    g.box(a, b, 0, height, z0, z1, color, "yY")
    g.box(a, b, height, height + 0.02, z0, z1, CUT, "y")
    g.box(*sorted((near, near + side * 0.012)), 0, 0.9, z0, z1, low, "yzZ")
    g.box(*sorted((near, near + side * 0.02)), 0, 0.09, z0, z1, SKIRT, "yzZ")


def wall_z(g, z, x0, x1, side, height=ROOM_HEIGHT, color=WALL, low=WALL_LOW, y0=0.0, dado=True):
    near = z + side * 0.05
    far = z - side * 0.05
    a, b = sorted((near, far))
    g.box(x0, x1, y0, height, a, b, color, "yY")
    g.box(x0, x1, height, height + 0.02, a, b, CUT, "y")
    if dado:
        g.box(x0, x1, 0, 0.9, *sorted((near, near + side * 0.012)), low, "yxX")
        g.box(x0, x1, 0, 0.09, *sorted((near, near + side * 0.02)), SKIRT, "yxX")


def window(g, glass, x0, x1, sill, head, z, rng, blinds=True):
    """A hole is what is left between four pieces of wall: the caller builds those."""
    frame = "#eceae2"
    depth = 0.07
    g.box(x0, x1, sill - 0.03, sill, z - depth, z + depth, frame, "y")
    g.box(x0, x1, head, head + 0.03, z - depth, z + depth, frame, "Y")
    g.box(x0 - 0.03, x0, sill, head, z - depth, z + depth, frame, "yY")
    g.box(x1, x1 + 0.03, sill, head, z - depth, z + depth, frame, "yY")
    panes = max(1, round((x1 - x0) / 1.1))
    for i in range(1, panes):
        x = x0 + (x1 - x0) * i / panes
        g.box(x - 0.015, x + 0.015, sill, head, z - 0.03, z + 0.03, frame, "yY")
    glass.face([(x0, sill, z), (x1, sill, z), (x1, head, z), (x0, head, z)], "#ffffff", "glass")
    if not blinds:
        return
    # Half-lowered blinds: where the stripes of sun on the carpet come from.
    bottom = head - rng.uniform(0.65, 0.95)
    y = head
    while y > bottom:
        g.box(x0 + 0.01, x1 - 0.01, y - 0.018, y, z + 0.075, z + 0.12, "#f4f0e6", "")
        y -= 0.075
    g.box(x0, x1, head - 0.01, head + 0.03, z + 0.07, z + 0.13, "#d8d4c8", "y")


def glass_wall_z(g, glass, z, x0, x1):
    g.box(x0, x1, 0, 0.07, z - 0.03, z + 0.03, GLASS_FRAME, "y")
    g.box(x0, x1, 2.2, 2.26, z - 0.03, z + 0.03, GLASS_FRAME, "")
    g.box(x0, x1, 1.0, 1.03, z - 0.012, z + 0.012, GLASS_FRAME, "y")
    posts = max(1, round((x1 - x0) / 1.05))
    for i in range(posts + 1):
        x = x0 + (x1 - x0) * i / posts
        g.box(x - 0.025, x + 0.025, 0.07, 2.2, z - 0.03, z + 0.03, GLASS_FRAME, "yY")
    glass.face([(x0, 0.07, z), (x1, 0.07, z), (x1, 2.2, z), (x0, 2.2, z)], "#ffffff", "glass")
    glass.face([(x1, 0.07, z), (x0, 0.07, z), (x0, 2.2, z), (x1, 2.2, z)], "#ffffff", "glass")


def glass_wall_x(g, glass, x, z0, z1):
    g.box(x - 0.03, x + 0.03, 0, 0.07, z0, z1, GLASS_FRAME, "y")
    g.box(x - 0.03, x + 0.03, 2.2, 2.26, z0, z1, GLASS_FRAME, "")
    g.box(x - 0.012, x + 0.012, 1.0, 1.03, z0, z1, GLASS_FRAME, "y")
    posts = max(1, round((z1 - z0) / 1.05))
    for i in range(posts + 1):
        z = z0 + (z1 - z0) * i / posts
        g.box(x - 0.03, x + 0.03, 0.07, 2.2, z - 0.025, z + 0.025, GLASS_FRAME, "yY")
    glass.face([(x, 0.07, z1), (x, 0.07, z0), (x, 2.2, z0), (x, 2.2, z1)], "#ffffff", "glass")
    glass.face([(x, 0.07, z0), (x, 0.07, z1), (x, 2.2, z1), (x, 2.2, z0)], "#ffffff", "glass")


def build_office(static, glow, glass, ceiling, near_wall, dynamic, plan):
    rng = random.Random(2030)
    g = static

    # Floors: carpet for the desks, cold vinyl where people pass, a better carpet for the promises.
    carpet = ("#373f73", "#333b6c", "#3b447b", "#303868")
    tiles(g, -6, 1.8, -5, 3.3, 0.5, carpet, rng)
    tiles(g, -6, 1.8, 3.3, 5, 0.5, ("#2f3663", "#2c335e", "#323a69"), rng)
    tiles(g, 1.8, 6, -5, -0.6, 0.5, ("#5a3a78", "#54366f", "#604080"), rng)
    planks(g, 1.8, 6, -0.6, 5, 0.28, ("#d9d2c2", "#d1cab9", "#e0d9ca", "#c9c2b0"), rng)

    # The slab and a stub of the missing wall: the room reads as a cutaway, not as a floating floor.
    g.box(-6.1, 6.1, -0.45, 0, 4.98, 5.1, "#1b1f3a", "y")
    g.box(-6.1, -5.98, -0.45, 0, -5.1, 5.1, "#1b1f3a", "y")
    g.box(5.98, 6.1, -0.45, 0, -5.1, 5.1, "#1b1f3a", "y")
    g.box(-6.1, 6.1, 0, 0.16, 4.98, 5.1, WALL_LOW, "yz")
    g.box(-6.1, 6.1, 0.16, 0.18, 4.98, 5.1, CUT, "y")

    # The walls: three, the fourth is where the player watches from.
    wall_x(g, -6, -5, 5, 1)
    wall_x(g, 6, -5, 5, -1)
    wall_z(g, -5, 1.8, 6, 1)

    # Back wall with windows, in pieces around the holes.
    sill, head = 0.85, 2.45
    openings = ((-3.9, -1.4), (-0.1, 1.5))
    wall_z(g, -5, -6, openings[0][0], 1)
    wall_z(g, -5, openings[0][1], openings[1][0], 1)
    wall_z(g, -5, openings[1][1], 1.8, 1)
    for x0, x1 in openings:
        wall_z(g, -5, x0, x1, 1, height=sill, y0=0)
        g.box(x0, x1, head, ROOM_HEIGHT, -5.05, -4.95, WALL, "yY")
        g.box(x0, x1, ROOM_HEIGHT, ROOM_HEIGHT + 0.02, -5.05, -4.95, CUT, "y")
        window(g, glass, x0, x1, sill, head, -5, rng)
        g.box(x0 - 0.05, x1 + 0.05, sill, sill + 0.03, -4.95, -4.82, "#eceae2", "")
    glow.picture_z(-1.2, 1.45, -5.6, 9.6, 2.2, rect("skyline"), material="glow")

    # The meeting room is glass: everyone can see who is being promised what.
    glass_wall_x(g, glass, 1.8, -5, -0.6)
    glass_wall_z(g, glass, -0.6, 2.9, 6)
    glass_wall_z(g, glass, -0.6, 1.8, 2.15)
    # The doorway between them.
    g.box(2.15, 2.9, 2.2, 2.26, -0.63, -0.57, GLASS_FRAME, "")
    plan.line(1.75, -5, 1.85, -0.6)
    plan.line(1.8, -0.65, 2.15, -0.55)
    plan.line(2.9, -0.65, 6, -0.55)
    plan.line(-6.1, -5, -5.95, 5)
    plan.line(5.95, -5, 6.1, 5)
    plan.line(-6, -5.1, 6, -4.95)

    # Over the meeting room's glass, from the month the dragon campaign starts.
    campaign = Geo()
    campaign.picture_z(4.4, 2.02, -0.55, 2.7, 0.44, rect("banner"))
    dynamic["DYN_banner"] = campaign

    # Twelve desks. The chair and the tower stay when someone leaves; their things do not.
    desk_rng = random.Random(14)
    for index, (x, z) in enumerate(desks()):
        with g.at(x, 0, z):
            P.workstation(g)
            P.monitor(g)
            with g.at(0, 0, CHAIR_Z):
                P.office_chair(g, desk_rng.uniform(-0.25, 0.25))
        plan.solid(x + 0.02, z - 0.03, 1.66, 0.84)
        clutter = Geo()
        with clutter.at(x, 0, z):
            P.desk_clutter(clutter, desk_rng)
        dynamic[f"DYN_desk_{index}"] = clutter
        screen = Geo()
        with screen.at(x, 0, z):
            P.screen_quad(screen, rect(SCREENS[desk_rng.randrange(len(SCREENS))]))
        dynamic[f"SCREEN_{index}"] = screen

    # Files, against the back wall: paper is the one thing that never leaves.
    file_rng = random.Random(3)
    for i, x in enumerate((-5.55, -4.95, -4.35)):
        with g.at(x, 0, -4.66):
            P.file_cabinet(g, file_rng)
    plan.solid(-4.95, -4.66, 1.8, 0.62)

    # Copier and water by the door to the meeting room.
    with g.at(1.05, 0, -4.55, 0.0):
        P.copier(g)
    plan.solid(1.05, -4.55, 1.1, 0.66)
    with g.at(0.1, 0, -4.68):
        P.water_cooler(g)
    plan.solid(0.1, -4.68, 0.36, 0.36)
    with g.at(1.45, 0, 2.9):
        P.trash_bin(g)

    # The meeting room.
    with g.at(3.9, 0, -2.7):
        g.bevel_box(0, 0, 1.16, 2.7, 0.7, 0.77, P.WOOD, 0.015, top_color=shade(P.WOOD, 0.08))
        g.block(0, -0.8, 0.34, 0.34, 0, 0.7, P.WOOD_DARK, skip="yY")
        g.block(0, 0.8, 0.34, 0.34, 0, 0.7, P.WOOD_DARK, skip="yY")
        for z in (-0.9, 0, 0.9):
            with g.at(-0.92, 0, z):
                P.meeting_chair(g, -math.pi / 2 + rng.uniform(-0.15, 0.15))
            with g.at(0.92, 0, z):
                P.meeting_chair(g, math.pi / 2 + rng.uniform(-0.15, 0.15))
        g.block(-0.2, 0.3, 0.21, 0.29, 0.77, 0.782, P.PAPER, skip="y")
        g.block(0.25, -0.6, 0.21, 0.29, 0.77, 0.782, P.PAPER, skip="y")
    plan.solid(3.9, -2.7, 1.2, 2.74)
    # Chairs along both sides, with room to pass behind them.
    plan.solid(2.98, -2.7, 0.56, 2.4)
    plan.solid(4.82, -2.7, 0.56, 2.4)

    g.block(3.9, -4.93, 2.9, 0.04, 0.88, 2.42, "#12152a", skip="yY")
    glow.picture_z(3.9, 1.65, -4.905, 2.72, 1.53, rect("slide"), material="glow")
    g.block(3.9, -4.86, 2.9, 0.1, 0.8, 0.88, P.WOOD_DARK, skip="y")
    with g.at(5.45, 0, -4.45):
        P.potted_palm(g, random.Random(5))
    plan.solid(5.45, -4.45, 0.5, 0.5)
    g.picture_x(5.922, 1.5, -1.9, 1.5, 0.9, rect("whiteboard"), facing=-1)
    g.block(5.94, -1.9, 0.02, 1.56, 1.02, 1.98, "#d8d4c8", skip="")
    glow.picture_x(5.93, 1.55, -3.75, 0.86, 0.86, rect("logo"), facing=-1, material="glow")

    # Wall of plants and the steel slogan: what a candidate sees first (chapter 1).
    for i in range(5):
        z = -2.0 + i * 0.8
        dynamic_green, dynamic_dry = Geo(), Geo()
        with dynamic_green.at(-5.94, 1.32, z):
            P.planter(dynamic_green, random.Random(40 + i), P.GREEN)
        with dynamic_dry.at(-5.94, 1.32, z):
            P.planter(dynamic_dry, random.Random(40 + i), P.DRY, sparse=True)
        dynamic[f"DYN_plant_{i}"] = dynamic_green
        dynamic[f"DYN_plant_dry_{i}"] = dynamic_dry
    g.box(-5.95, -5.92, 1.02, 2.02, -2.46, 1.5, "#17423a", "yY")
    g.picture_x(-5.915, 2.26, -0.48, 3.9, 0.42, rect("slogan"))

    g.picture_x(-5.93, 1.62, 3.0, 0.44, 0.62, rect("family"))
    g.picture_x(-5.93, 1.62, 2.3, 0.44, 0.62, rect("values"))
    g.picture_z(-4.8, 2.05, -4.93, 0.34, 0.34, rect("clock"))
    g.picture_z(-0.75, 1.62, -4.93, 1.05, 0.69, rect("kpi"))

    # Pantry, along the right wall: where people say what they cannot say in the room above.
    with g.at(5.64, 0, 1.75):
        P.kitchen_run(g, 2.5)
    plan.solid(5.64, 1.75, 0.66, 2.54)
    with g.at(5.6, 0, 3.4, -math.pi / 2):
        P.fridge(g)
    plan.solid(5.6, 3.4, 0.7, 0.7)
    with g.at(5.46, 0, 4.42, -math.pi / 2):
        P.vending_body(g)
    plan.solid(5.46, 4.42, 0.76, 0.98)
    glow.quad_uv(
        [(5.095, 0.32, 4.8), (5.095, 0.32, 4.06), (5.095, 1.74, 4.06), (5.095, 1.74, 4.8)],
        rect("vending"),
        "glow",
    )
    g.picture_x(5.922, 1.62, 2.45, 1.14, 0.75, rect("notices"), facing=-1)
    g.block(5.94, 2.45, 0.02, 1.2, 1.2, 2.04, P.WOOD_DARK, skip="")
    coffee = Geo()
    with coffee.at(5.5, 0, 0.1, -math.pi / 2):
        P.coffee_machine(coffee)
    dynamic["DYN_coffee"] = coffee
    plan.solid(5.5, 0.1, 0.72, 0.86)
    # What it stood on stays: a clean rectangle on the vinyl, a little brighter than the rest.
    g.face([(5.08, 0.004, 0.5), (5.92, 0.004, 0.5), (5.92, 0.004, -0.3), (5.08, 0.004, -0.3)], "#efe9dc")

    with g.at(4.05, 0, 2.0):
        P.round_table(g)
        P.fruit_bowl(g)
        with g.at(-0.62, 0, 0.32):
            P.stool(g)
        with g.at(0.62, 0, -0.32):
            P.stool(g)
    plan.solid(4.05, 2.0, 0.72, 0.72)
    for stage in ("full", "half", "bananas"):
        pile = Geo()
        with pile.at(4.05, 0, 2.0):
            P.fruit(pile, random.Random(8), stage)
        dynamic[f"DYN_fruit_{stage}"] = pile

    # HR's standing desk, beside the door: nobody passes unseen.
    with g.at(3.75, 0, 0.1):
        g.bevel_box(0, 0, 1.2, 0.56, 0.98, 1.03, P.LAMINATE, 0.012)
        for x in (-0.54, 0.54):
            g.block(x, 0, 0.06, 0.5, 0, 0.98, P.DESK_LEG, skip="yY")
        g.block(0.3, 0, 0.26, 0.34, 1.03, 1.09, P.METAL, skip="y")
        g.block(0.3, 0, 0.21, 0.29, 1.09, 1.11, P.PAPER, skip="y")
        with g.at(-0.2, 0.29, 0.02, math.pi):
            P.monitor(g, 0, -0.1)
    plan.solid(3.75, 0.1, 1.24, 0.6)

    # The sofa nobody has time for.
    P.rug(g, -5.9, -3.7, 3.0, 4.95, "#7a3550", "#ffc83d")
    with g.at(-5.42, 0, 3.95, math.pi / 2):
        P.sofa(g)
    plan.solid(-5.42, 3.95, 0.9, 2.2)
    with g.at(-4.4, 0, 3.95):
        g.bevel_box(0, 0, 0.62, 1.0, 0.32, 0.36, P.WOOD, 0.012)
        for x, z in ((-0.26, -0.44), (0.26, -0.44), (-0.26, 0.44), (0.26, 0.44)):
            g.block(x, z, 0.04, 0.04, 0, 0.32, P.DARK, skip="yY")
        g.block(0, -0.2, 0.2, 0.28, 0.36, 0.385, P.CORAL, skip="y")
    plan.solid(-4.4, 3.95, 0.66, 1.04)
    with g.at(-5.6, 0, 2.85):
        P.floor_lamp(g)
    plan.solid(-5.6, 2.85, 0.32, 0.32)
    with g.at(-5.55, 0, 4.72):
        P.potted_palm(g, random.Random(6))
    plan.solid(-5.55, 4.72, 0.46, 0.46)

    # Where you take the call you cannot take at your desk.
    with g.at(0.2, 0, 4.1):
        P.bench(g)
        with g.at(0.92, 0, 0.02):
            P.charging_post(g)
    plan.solid(0.2, 4.1, 1.44, 0.44)
    plan.solid(1.12, 4.12, 0.3, 0.26)
    P.rug(g, -1.0, 1.6, 3.55, 4.75, "#1f6e75", "#9ff0dc")

    # Stray props: the office looks used.
    box_rng = random.Random(11)
    with g.at(1.42, 0, 1.5, 0.3):
        P.cardboard_box(g, box_rng)
    plan.solid(1.42, 1.5, 0.5, 0.42)
    with g.at(-5.6, 0, 2.0, 0.6):
        P.trash_bin(g)

    # The fire door, under the only sign in the building that tells the truth.
    g.box(-5.95, -5.9, 0, 2.08, -3.62, -2.72, "#d8d4c8", "y")
    g.box(-5.9, -5.87, 0.02, 2.02, -3.56, -2.78, "#6878ad", "y")
    g.box(-5.87, -5.83, 0.98, 1.02, -3.5, -3.24, P.METAL, "")
    glow.picture_x(-5.93, 2.34, -3.17, 0.56, 0.21, rect("exit"), material="glow")

    # The tall wall the camera never sees, and the ceiling: light has to come from somewhere.
    near_wall.box(-6.1, 6.1, 0, ROOM_HEIGHT, 5.0, 5.1, "#9aa6c8", "")
    ceiling.box(-6.1, 6.1, ROOM_HEIGHT, ROOM_HEIGHT + 0.05, -5.1, 5.1, "#eceae2", "")


def build_home(static, glow, glass, ceiling, near_wall, dynamic, plan):
    rng = random.Random(305)
    g = static
    ox = 30.0
    paint, low = "#c98f62", "#8d5a48"
    with g.at(ox, 0, 0), glow.at(ox, 0, 0), glass.at(ox, 0, 0), ceiling.at(ox, 0, 0), near_wall.at(ox, 0, 0):
        planks(g, -3, 3, -3, 3, 0.22, ("#8a5430", "#7f4b2a", "#935a35", "#744426"), rng)
        wall_x(g, -3, -3, 3, 1, color=paint, low=low)
        wall_x(g, 3, -3, 3, -1, color=paint, low=low)
        sill, head = 1.0, 2.2
        wall_z(g, -3, -3, -1.6, 1, color=paint, low=low)
        wall_z(g, -3, 0.2, 3, 1, color=paint, low=low)
        wall_z(g, -3, -1.6, 0.2, 1, height=sill, color=paint, low=low)
        g.box(-1.6, 0.2, head, ROOM_HEIGHT, -3.05, -2.95, paint, "yY")
        g.box(-1.6, 0.2, ROOM_HEIGHT, ROOM_HEIGHT + 0.02, -3.05, -2.95, CUT, "y")
        window(g, glass, -1.6, 0.2, sill, head, -3, rng, blinds=False)
        glow.picture_z(-0.7, 1.6, -3.6, 3.4, 1.2, rect("night"), material="glow")

        # A mattress on the floor, because the first thing to cut is the bed frame.
        g.block(-1.9, 0.7, 2.0, 1.5, 0, 0.1, "#5a4636", skip="y")
        g.bevel_box(-1.9, 0.7, 1.96, 1.46, 0.1, 0.28, "#efe2c8", 0.05)
        g.bevel_box(-1.9, 1.05, 1.98, 0.86, 0.28, 0.33, "#2c6f7a", 0.04)
        g.bevel_box(-1.9, 0.18, 0.7, 0.38, 0.28, 0.42, "#f6efdf", 0.05)

        # The folding table: laptop, noodles, the envelopes.
        with g.at(1.5, 0, -1.9):
            g.bevel_box(0, 0, 1.3, 0.66, 0.68, 0.72, "#c98f52", 0.012)
            for x in (-0.58, 0.58):
                g.rod((x, 0.68, -0.26), (x, 0, 0.26), 0.016, P.DARK, 4)
                g.rod((x, 0.68, 0.26), (x, 0, -0.26), 0.016, P.DARK, 4)
            g.block(-0.05, 0.05, 0.36, 0.25, 0.72, 0.735, "#30383b", skip="y")
            lid = [(-0.23, 0.735, -0.09), (0.13, 0.735, -0.09), (0.13, 0.96, -0.15), (-0.23, 0.96, -0.15)]
            g.face(lid, "#242b2e")
            g.face(lid[::-1], "#30383b")
            g.cylinder(0.42, 0.1, 0.72, 0.84, 0.05, 0.065, "#eef0ea", 10)
            g.cylinder(0.42, 0.1, 0.84, 0.845, 0.066, 0.066, "#d9423f", 10)
            g.rod((0.34, 0.85, 0.06), (0.5, 0.9, 0.16), 0.004, P.WOOD, 4)
            g.quad_uv([(-0.55, 0.725, 0.3), (-0.2, 0.725, 0.3), (-0.2, 0.725, 0.2), (-0.55, 0.725, 0.2)], rect("bills"))
        with g.at(1.5, 0, -1.2):
            P.stool(g)
        plan.solid(ox + 1.5, -1.9, 1.34, 0.7)

        # A clamp lamp, curtains that were here before you, a shelf of the cheapest things.
        with g.at(1.5, 0, -1.9):
            g.rod((-0.3, 0.72, -0.2), (-0.3, 1.08, -0.16), 0.008, P.DARK, 4)
            g.cylinder(-0.3, -0.14, 1.03, 1.12, 0.08, 0.03, P.GOLD, 8)
        for x in (-1.78, 0.14):
            for i in range(3):
                g.block(x + i * 0.05, -2.88, 0.05, 0.05, 0.92, 2.34, shade("#2c6f7a", -0.1 * (i % 2)), skip="y")
        g.block(-0.73, -2.88, 2.16, 0.03, 2.34, 2.37, P.DARK)
        g.block(2.2, -2.82, 1.1, 0.26, 1.75, 1.78, P.WOOD_DARK)
        for i in range(5):
            g.cylinder(1.8 + i * 0.17, -2.82, 1.78, 1.92, 0.06, 0.07, ("#ff6b4a", "#ffc83d", "#ff6b4a", "#f6efdf", "#ff6b4a")[i], 8)
        # A rack instead of a wardrobe, and the shirt that came in the welcome kit.
        with g.at(-2.55, 0, -2.3):
            g.rod((-0.3, 0, -0.5), (-0.3, 1.7, -0.5), 0.015, P.METAL, 5)
            g.rod((-0.3, 0, 0.5), (-0.3, 1.7, 0.5), 0.015, P.METAL, 5)
            g.rod((-0.3, 1.7, -0.5), (-0.3, 1.7, 0.5), 0.015, P.METAL, 5)
            for i, color in enumerate(("#9ff0dc", "#9ff0dc", "#2c6f7a", "#f6efdf")):
                g.block(-0.3, -0.33 + i * 0.22, 0.34, 0.1, 0.92, 1.66, color, skip="y")
        plan.solid(ox - 2.75, -2.3, 0.3, 1.1)

        # The kettle corner.
        with g.at(2.65, 0, 1.4):
            g.block(0, 0, 0.5, 1.6, 0, 0.82, "#e0cda8", skip="y")
            g.bevel_box(0, 0, 0.54, 1.64, 0.82, 0.85, "#5e3f2f", 0.01)
            g.cylinder(0, 0.4, 0.85, 1.05, 0.08, 0.06, P.METAL, 8)
            g.block(0, -0.4, 0.3, 0.36, 0.85, 1.1, "#2c3360", skip="y")
        plan.solid(ox + 2.65, 1.4, 0.56, 1.66)

        g.picture_z(1.5, 1.55, -2.93, 0.34, 0.44, rect("calendar"))
        with g.at(2.3, 0, -2.5):
            P.trash_bin(g)
        # Pendant bulb.
        g.rod((0, 2.8, 0.2), (0, 2.28, 0.2), 0.006, P.DARK, 4)
        u0, v0, u1, v1 = rect("white")
        glow.blob(0, 2.22, 0.2, 0.05, 0.065, 0.05, "#ffffff", 8, 4, material="glow", uv=((u0 + u1) / 2, (v0 + v1) / 2))
        P.rug(g, -0.6, 1.2, -0.4, 1.2, "#7c4f40", "#d8b98a")
        near_wall.box(-3.1, 3.1, 0, ROOM_HEIGHT, 3.0, 3.1, "#a8765a", "")
        ceiling.box(-3.1, 3.1, ROOM_HEIGHT, ROOM_HEIGHT + 0.05, -3.1, 3.1, "#e8dcc8", "")

    plan.line(ox - 3.1, -3, ox - 2.95, 3)
    plan.line(ox + 2.95, -3, ox + 3.1, 3)
    plan.line(ox - 3, -3.1, ox + 3, -2.95)
    plan.solid(ox - 1.9, 0.7, 2.04, 1.54)


def area_light(collection, name, position, size, power, color, spread=None):
    light = bpy.data.lights.new(name, "AREA")
    light.shape = "RECTANGLE"
    light.size, light.size_y = size
    light.energy = power
    light.color = color
    if spread:
        light.spread = spread
    obj = bpy.data.objects.new(name, light)
    collection.objects.link(obj)
    obj.location = to_blender(*position)
    return obj


def point_light(collection, name, position, power, color, radius=0.1):
    light = bpy.data.lights.new(name, "POINT")
    light.energy = power
    light.color = color
    light.shadow_soft_size = radius
    obj = bpy.data.objects.new(name, light)
    collection.objects.link(obj)
    obj.location = to_blender(*position)
    return obj


def add_lights(scene):
    """Fluorescent panels for the office, and one low, kind sun for the first month's promises."""
    lights = new_collection("LIGHTS")
    cold = (0.9, 0.97, 1.0)
    for x in (-4.4, -1.9, 0.6):
        for z in (-3.2, -0.2, 2.8):
            area_light(lights, f"panel_{x}_{z}", (x, 2.76, z), (1.2, 0.6), 40, cold)
    for z in (-3.6, -1.6):
        area_light(lights, f"meeting_{z}", (3.9, 2.76, z), (1.6, 0.8), 44, (1.0, 0.9, 0.78))
    for z in (0.8, 3.2):
        area_light(lights, f"pantry_{z}", (4.2, 2.76, z), (1.4, 0.5), 40, (1.0, 0.96, 0.9))
    area_light(lights, "front", (-1.4, 2.76, 4.3), (2.4, 0.6), 34, cold)
    point_light(lights, "lounge_lamp", (-5.6, 1.62, 2.85), 26, (1.0, 0.68, 0.36), 0.14)

    sun = bpy.data.lights.new("sun", "SUN")
    sun.energy = 6.0
    sun.color = (1.0, 0.7, 0.42)
    sun.angle = math.radians(1.5)
    sun_object = bpy.data.objects.new("sun", sun)
    lights.objects.link(sun_object)
    # From behind the back wall, high enough to land on the floor the camera can see.
    sun_object.rotation_euler = (math.radians(-52), 0, math.radians(20))

    # Home: one warm bulb, and the city's blue through the window.
    point_light(lights, "bulb", (30, 2.2, 0.2), 120, (1.0, 0.7, 0.4), 0.08)
    point_light(lights, "desk_lamp", (31.2, 1.12, -2.05), 16, (1.0, 0.76, 0.46), 0.05)
    moon = area_light(lights, "moon", (29.3, 1.6, -3.2), (1.6, 1.2), 22, (0.45, 0.6, 1.0))
    moon.rotation_euler = (math.radians(90), 0, 0)

    world = bpy.data.worlds.new("sky")
    world.use_nodes = True
    background = world.node_tree.nodes["Background"]
    background.inputs["Color"].default_value = (0.75, 0.7, 0.85, 1.0)
    background.inputs["Strength"].default_value = 0.5
    scene.world = world


def build_all():
    """Returns (objects to bake, objects exported without a bake, the plan)."""
    scene = bpy.context.scene
    decals = bpy.data.images.load(str(HERE.parent / "textures/decals.png"), check_existing=True)
    materials = {
        "base": base_material("M_Base"),
        "decal": base_material("M_Decal", 0.5, decals),
        "glow": glow_material("M_Glow", 1.0, decals),
        "glass": glass_material("M_Glass"),
    }
    static_collection = new_collection("STATIC")
    unlit_collection = new_collection("UNLIT")
    hidden_collection = new_collection("BAKE_ONLY")

    static, glow, glass, ceiling, near_wall = Geo(), Geo(), Geo(), Geo(), Geo()
    dynamic = {}
    plan = Plan()
    build_office(static, glow, glass, ceiling, near_wall, dynamic, plan)
    build_home(static, glow, glass, ceiling, near_wall, dynamic, plan)

    baked = [static.to_object("STATIC", static_collection, materials)]
    screens = []
    for name, geo in dynamic.items():
        if name.startswith("SCREEN_"):
            screens.append(geo.to_object(name, unlit_collection, materials))
        else:
            baked.append(geo.to_object(name, static_collection, materials))
    unlit = [
        glow.to_object("GLOW", unlit_collection, materials),
        glass.to_object("GLASS", unlit_collection, materials),
        *screens,
    ]
    ceiling.to_object("CEILING", hidden_collection, materials)
    near_wall.to_object("NEAR_WALL", hidden_collection, materials)
    for obj in unlit:
        if obj.name == "GLASS":
            obj.visible_shadow = False
    bpy.data.objects["GLOW"].visible_shadow = False
    # It goes in month 2, and a machine this big would leave a black hole of its own shadow behind.
    bpy.data.objects["DYN_coffee"].visible_shadow = False
    bpy.data.objects["DYN_banner"].visible_shadow = False
    add_lights(scene)
    return baked, unlit, plan


def plan_json(plan):
    seats = []
    for x, z in desks():
        seats.append({"desk": [x, z], "seat": [x, 0, round(z + CHAIR_Z, 3)]})
    cameras = json.loads((HERE.parent / "cameras.json").read_text())
    return {"cameras": cameras, "desks": seats, "solids": plan.solids}
