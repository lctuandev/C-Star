"""Mesh building shared by every art script (ADR-005). Runs inside Blender.

Game space is Y up, the camera on the +Z side, the same numbers the web app uses, so a position read
here is a position there. Blender only sees it at `Geo.to_object`.
"""
import math
import random

import bpy
from mathutils import Matrix, Vector


def to_blender(x, y, z):
    return (x, -z, y)


def hex_color(value):
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) / 255 for i in (0, 2, 4))


def shade(color, amount):
    """Lighter above 0, darker below: the way two painted panels differ."""
    rgb = hex_color(color) if isinstance(color, str) else color
    return tuple(max(0.0, min(1.0, c * (1 + amount))) for c in rgb)


class Geo:
    """Faces in game space, with a colour per face. `at` places furniture by its own origin."""

    def __init__(self):
        self.verts = []
        self.faces = []
        self.stack = [Matrix.Identity(4)]

    # ------------------------------------------------------------ placement

    def at(self, x=0.0, y=0.0, z=0.0, yaw=0.0):
        """`with geo.at(...)`: yaw turns +Z toward +X, as `rotation.y` does in three.js."""
        geo = self

        class Scope:
            def __enter__(self):
                # Game coordinates are kept in a plain Y-up frame, hence a rotation about the middle axis.
                turn = Matrix.Rotation(yaw, 4, "Y")
                geo.stack.append(geo.stack[-1] @ Matrix.Translation((x, y, z)) @ turn)
                return geo

            def __exit__(self, *_):
                geo.stack.pop()

        return Scope()

    def point(self, p):
        return (self.stack[-1] @ Vector(p)).to_tuple()

    # ------------------------------------------------------------ primitives

    def face(self, points, color, material="base", uvs=None, smooth=False):
        rgb = hex_color(color) if isinstance(color, str) else color
        start = len(self.verts)
        self.verts.extend(self.point(p) for p in points)
        uvs = uvs or [(0.0, 0.0)] * len(points)
        self.faces.append((list(range(start, start + len(points))), rgb, material, uvs, smooth))

    def box(self, x0, x1, y0, y1, z0, z1, color, skip="", material="base"):
        """`skip` drops faces nothing can see: x X y Y z Z are the -x +x -y +y -z +z sides."""
        c = [
            (x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1),
            (x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1),
        ]
        sides = {
            "y": ((0, 1, 2, 3), 0.0),
            "Y": ((7, 6, 5, 4), 0.0),
            "z": ((4, 5, 1, 0), 0.0),
            "Z": ((3, 2, 6, 7), 0.0),
            "x": ((0, 3, 7, 4), 0.0),
            "X": ((2, 1, 5, 6), 0.0),
        }
        for side, (order, _) in sides.items():
            if side not in skip:
                self.face([c[i] for i in order], color, material)

    def block(self, cx, cz, w, d, y0, y1, color, skip="y", material="base"):
        """A box by its centre on the floor: how furniture is measured."""
        self.box(cx - w / 2, cx + w / 2, y0, y1, cz - d / 2, cz + d / 2, color, skip, material)

    def bevel_box(self, cx, cz, w, d, y0, y1, color, bevel=0.02, skip_bottom=True, top_color=None):
        """A box whose top edges catch the light, for things seen close to the camera."""
        x0, x1 = cx - w / 2, cx + w / 2
        z0, z1 = cz - d / 2, cz + d / 2
        b = bevel
        self.box(x0, x1, y0, y1 - b, z0, z1, color, "Y" + ("y" if skip_bottom else ""))
        top = top_color or color
        self.face([(x0 + b, y1, z1 - b), (x1 - b, y1, z1 - b), (x1 - b, y1, z0 + b), (x0 + b, y1, z0 + b)], top)
        ring = [(x0, z1), (x1, z1), (x1, z0), (x0, z0)]
        inner = [(x0 + b, z1 - b), (x1 - b, z1 - b), (x1 - b, z0 + b), (x0 + b, z0 + b)]
        for i in range(4):
            j = (i + 1) % 4
            self.face(
                [
                    (ring[i][0], y1 - b, ring[i][1]),
                    (ring[j][0], y1 - b, ring[j][1]),
                    (inner[j][0], y1, inner[j][1]),
                    (inner[i][0], y1, inner[i][1]),
                ],
                top,
            )

    def cylinder(self, cx, cz, y0, y1, r0, r1, color, sides=8, caps="Y", smooth=True):
        ring = lambda y, r: [
            (cx + math.sin(a) * r, y, cz + math.cos(a) * r)
            for a in (2 * math.pi * i / sides for i in range(sides))
        ]
        low, high = ring(y0, r0), ring(y1, r1)
        for i in range(sides):
            j = (i + 1) % sides
            self.face([low[i], low[j], high[j], high[i]], color, smooth=smooth)
        if "Y" in caps and r1 > 0:
            self.face(high, color)
        if "y" in caps and r0 > 0:
            self.face(low[::-1], color)

    def rod(self, a, b, radius, color, sides=6):
        """A bar between two points: chair legs, lamp arms, cables."""
        a, b = Vector(a), Vector(b)
        axis = (b - a).normalized()
        helper = Vector((1, 0, 0)) if abs(axis.x) < 0.9 else Vector((0, 0, 1))
        u = axis.cross(helper).normalized() * radius
        v = axis.cross(u).normalized() * radius
        ring = lambda c: [
            (c + u * math.cos(t) + v * math.sin(t)).to_tuple()
            for t in (2 * math.pi * i / sides for i in range(sides))
        ]
        low, high = ring(a), ring(b)
        for i in range(sides):
            j = (i + 1) % sides
            self.face([low[i], low[j], high[j], high[i]], color, smooth=True)
        self.face(high, color)

    def blob(self, cx, cy, cz, rx, ry, rz, color, segments=7, rings=4, jitter=0.0, rng=None, smooth=False, material="base", keep=None, uv=(0.0, 0.0)):
        """A squashed sphere: foliage, fruit, cushions. `jitter` breaks it into a rock of facets."""
        rng = rng or random.Random(1)
        grid = []
        for r in range(rings + 1):
            polar = math.pi * r / rings
            row = []
            for s in range(segments):
                azimuth = 2 * math.pi * s / segments
                k = 1 + (rng.uniform(-jitter, jitter) if 0 < r < rings else 0)
                row.append(
                    (
                        cx + rx * k * math.sin(polar) * math.cos(azimuth),
                        cy + ry * k * math.cos(polar),
                        cz + rz * k * math.sin(polar) * math.sin(azimuth),
                    )
                )
            grid.append(row)
        for r in range(rings):
            for s in range(segments):
                t = (s + 1) % segments
                corners = [grid[r][s], grid[r][t], grid[r + 1][t], grid[r + 1][s]]
                if keep is None or keep(*[sum(p[i] for p in corners) / 4 for i in range(3)]):
                    self.face(corners, color, material, [uv] * 4, smooth)

    def loft(self, rings, color, sides=8, close_top=True, close_bottom=True, smooth=True):
        """A skin over `(x, y, z, rx, rz)` rings: limbs, torsos, the shapes boxes cannot make."""
        loops = []
        for x, y, z, rx, rz in rings:
            loops.append(
                [
                    (x + math.sin(a) * rx, y, z + math.cos(a) * rz)
                    for a in (2 * math.pi * i / sides for i in range(sides))
                ]
            )
        for low, high in zip(loops, loops[1:]):
            for i in range(sides):
                j = (i + 1) % sides
                self.face([low[i], low[j], high[j], high[i]], color, smooth=smooth)
        if close_top:
            self.face(loops[-1], color, smooth=smooth)
        if close_bottom:
            self.face(loops[0][::-1], color, smooth=smooth)

    def quad_uv(self, corners, rect, material="decal", color="#ffffff"):
        """A flat picture: `corners` from bottom left, anticlockwise, `rect` in the decal atlas."""
        u0, v0, u1, v1 = rect
        self.face(corners, color, material, [(u0, v0), (u1, v0), (u1, v1), (u0, v1)])

    def picture_z(self, cx, cy, z, w, h, rect, facing=1, material="decal"):
        """A picture on a wall that runs along X. `facing` is the side of Z it looks at."""
        x0, x1 = cx - w / 2 * facing, cx + w / 2 * facing
        self.quad_uv([(x0, cy - h / 2, z), (x1, cy - h / 2, z), (x1, cy + h / 2, z), (x0, cy + h / 2, z)], rect, material)

    def picture_x(self, x, cy, cz, w, h, rect, facing=1, material="decal"):
        """A picture on a wall that runs along Z. `facing` is the side of X it looks at."""
        z0, z1 = cz + w / 2 * facing, cz - w / 2 * facing
        self.quad_uv([(x, cy - h / 2, z0), (x, cy - h / 2, z1), (x, cy + h / 2, z1), (x, cy + h / 2, z0)], rect, material)

    # ------------------------------------------------------------ into Blender

    def to_object(self, name, collection, materials):
        """One object, one material slot per material used. Empty builders make no object."""
        if not self.faces:
            return None
        used = sorted({f[2] for f in self.faces})
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata([to_blender(*p) for p in self.verts], [], [f[0] for f in self.faces])
        uv_layer = mesh.uv_layers.new(name="uv")
        colors = mesh.color_attributes.new("Col", "BYTE_COLOR", "CORNER")
        for polygon, (_, rgb, material, uvs, smooth) in zip(mesh.polygons, self.faces):
            polygon.material_index = used.index(material)
            polygon.use_smooth = smooth
            for loop, uv in zip(polygon.loop_indices, uvs):
                uv_layer.data[loop].uv = uv
                colors.data[loop].color_srgb = (*rgb, 1.0)
        for material in used:
            mesh.materials.append(materials[material])
        mesh.validate()
        mesh.update()
        obj = bpy.data.objects.new(name, mesh)
        collection.objects.link(obj)
        return obj


# ---------------------------------------------------------------- materials


def base_material(name, roughness=0.65, image=None):
    """Colour from the vertices, or a picture: both end up in glTF's base colour."""
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Specular IOR Level"].default_value = 0.3
    if image is None:
        attribute = nodes.new("ShaderNodeVertexColor")
        attribute.layer_name = "Col"
        material.node_tree.links.new(attribute.outputs["Color"], bsdf.inputs["Base Color"])
    else:
        texture = nodes.new("ShaderNodeTexImage")
        texture.image = image
        uv = nodes.new("ShaderNodeUVMap")
        uv.uv_map = "uv"
        material.node_tree.links.new(uv.outputs["UV"], texture.inputs["Vector"])
        material.node_tree.links.new(texture.outputs["Color"], bsdf.inputs["Base Color"])
    return material


def glow_material(name, strength=1.0, image=None, color=(1, 1, 1)):
    """Light that needs no light: screens, signs, tubes. Unlit in the game."""
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Emission Color"].default_value = (*color, 1.0)
    bsdf.inputs["Emission Strength"].default_value = strength
    if image is not None:
        texture = nodes.new("ShaderNodeTexImage")
        texture.image = image
        uv = nodes.new("ShaderNodeUVMap")
        uv.uv_map = "uv"
        links.new(uv.outputs["UV"], texture.inputs["Vector"])
        links.new(texture.outputs["Color"], bsdf.inputs["Base Color"])
        links.new(texture.outputs["Color"], bsdf.inputs["Emission Color"])
    return material


def glass_material(name, tint=(0.75, 0.9, 0.88), alpha=0.12):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*tint, 1.0)
    bsdf.inputs["Alpha"].default_value = alpha
    bsdf.inputs["Roughness"].default_value = 0.1
    material.surface_render_method = "BLENDED"
    return material


def new_collection(name):
    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)
    return collection


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    return bpy.context.scene


def script_arguments():
    import sys

    return sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
