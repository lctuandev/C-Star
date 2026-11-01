"""Open Image Denoise over a baked lightmap: Cycles only offers it for renders (FEAT-028).

blender --background --factory-startup --python blender/denoise.py -- --image out/lightmap.exr --out out/lightmap.clean.exr
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import bpy

import kit

args = argparse.ArgumentParser()
args.add_argument("--image", required=True)
args.add_argument("--out", required=True)
options = args.parse_args(kit.script_arguments())

scene = bpy.context.scene
image = bpy.data.images.load(str(Path(options.image).resolve()))
image.colorspace_settings.name = "Linear Rec.709"
scene.render.resolution_x, scene.render.resolution_y = image.size
scene.render.resolution_percentage = 100
scene.render.use_compositing = True
scene.render.image_settings.file_format = "OPEN_EXR"
scene.render.image_settings.color_depth = "32"
scene.render.image_settings.color_mode = "RGB"
scene.view_settings.view_transform = "Raw"
scene.render.filepath = str(Path(options.out).resolve())

tree = bpy.data.node_groups.new("denoise", "CompositorNodeTree")
scene.compositing_node_group = tree
tree.interface.new_socket("Image", in_out="OUTPUT", socket_type="NodeSocketColor")
source = tree.nodes.new("CompositorNodeImage")
source.image = image
denoise = tree.nodes.new("CompositorNodeDenoise")
output = tree.nodes.new("NodeGroupOutput")
tree.links.new(source.outputs["Image"], denoise.inputs["Image"])
tree.links.new(denoise.outputs["Image"], output.inputs[0])
print("DENOISE inputs", [socket.name for socket in denoise.inputs])
bpy.ops.render.render(write_still=True)
print("DENOISED", options.out)
