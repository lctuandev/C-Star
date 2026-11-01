#!/usr/bin/env python3
"""Draws the one atlas for every picture in the office: posters, screens, the view from the window.

Text lives in decal-text.json, which the fiction test reads (contracts/content.md). Writes
decals.png and decals.json (uv rectangles, v up, as Blender wants them).
"""
import json
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).parent
SIZE = 2048
BOLD = "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"
REGULAR = "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"
TEXT = json.loads((HERE / "decal-text.json").read_text(encoding="utf-8"))

atlas = Image.new("RGB", (SIZE, SIZE), "#20282b")
rects = {}


def font(size, bold=True):
    return ImageFont.truetype(BOLD if bold else REGULAR, size)


def panel(name, x, y, w, h, background="#ffffff", scale=2):
    """A canvas at twice the size, so type comes out smooth when it is pasted down."""
    image = Image.new("RGB", (w * scale, h * scale), background)
    rects[name] = (x / SIZE, 1 - (y + h) / SIZE, (x + w) / SIZE, 1 - y / SIZE)
    return image, ImageDraw.Draw(image), scale, (x, y, w, h)


def paste(canvas):
    image, _, _, (x, y, w, h) = canvas
    atlas.paste(image.resize((w, h), Image.LANCZOS), (x, y))


def centered(draw, xy, text, size, fill, bold=True):
    draw.text(xy, text, font=font(size, bold), fill=fill, anchor="mm")


def slide():
    canvas = panel("slide", 0, 0, 1024, 576, "#161a3a")
    image, draw, s, _ = canvas
    W, H = image.size
    for i in range(H):
        t = i / H
        draw.line([(0, i), (W, i)], fill=(int(22 + 30 * t), int(26 + 18 * t), int(58 + 60 * t)))
    centered(draw, (W / 2, 170 * s), TEXT["slide"]["title"], 110 * s, "#ffc83d")
    centered(draw, (W / 2, 262 * s), TEXT["slide"]["subtitle"], 32 * s, "#9ff0dc", False)
    points = [(150, 500), (300, 470), (430, 480), (560, 410), (690, 390), (870, 290)]
    draw.line([(p[0] * s, p[1] * s) for p in points], fill="#9ff0dc", width=10 * s, joint="curve")
    tip = points[-1]
    draw.polygon(
        [(tip[0] * s + 34 * s, tip[1] * s - 26 * s), (tip[0] * s - 18 * s, tip[1] * s - 12 * s), (tip[0] * s + 6 * s, tip[1] * s + 28 * s)],
        fill="#9ff0dc",
    )
    centered(draw, (300 * s, 390 * s), TEXT["slide"]["note"], 26 * s, "#aebbba", False)
    paste(canvas)


def logo_plate():
    """The mark from docs/brand: a C and an asterisk drawn as tubes, one arm about to die."""
    canvas = panel("logo", 1040, 0, 256, 256, "#10132a", 4)
    image, draw, s, _ = canvas
    tube, gold, dim = "#9ff0dc", "#ffc83d", "#8d6a1c"
    k = 256 / 512 * s
    draw.arc([(108 * k, 108 * k), (404 * k, 404 * k)], 40, 318, fill=tube, width=int(62 * k))
    cx, cy = 399 * k, 131 * k
    for angle, length, color in ((-90, 60, gold), (-18, 60, gold), (54, 60, dim), (126, 60, gold), (198, 60, gold)):
        tip = (cx + math.cos(math.radians(angle)) * length * k, cy + math.sin(math.radians(angle)) * length * k)
        draw.line([(cx, cy), tip], fill=color, width=int(30 * k))
    paste(canvas)


def slogan():
    canvas = panel("slogan", 0, 590, 1024, 110, "#17423a")
    image, draw, s, _ = canvas
    W, H = image.size
    size = 44 * s
    while font(size).getlength(TEXT["slogan"]) > W - 60 * s:
        size -= 2
    draw.text((W / 2 + s, H / 2 + 3 * s), TEXT["slogan"], font=font(size), fill="#0b211d", anchor="mm")
    draw.text((W / 2, H / 2), TEXT["slogan"], font=font(size), fill="#f4ecdc", anchor="mm")
    paste(canvas)


def family():
    canvas = panel("family", 1310, 0, 340, 480, "#ff6b4a")
    image, draw, s, _ = canvas
    W, H = image.size
    draw.ellipse([W * 0.5 - 130 * s, 40 * s, W * 0.5 + 130 * s, 300 * s], fill="#ffc83d")
    for i, line in enumerate(TEXT["family"]):
        centered(draw, (W / 2, (120 + i * 76) * s), line, 54 * s, "#20282b")
    centered(draw, (W / 2, 432 * s), TEXT["familyNote"], 17 * s, "#fbe9df", False)
    paste(canvas)


def values():
    canvas = panel("values", 1664, 0, 340, 480, "#1b1f3a")
    image, draw, s, _ = canvas
    W, _ = image.size
    centered(draw, (W / 2, 80 * s), "C*", 96 * s, "#9ff0dc")
    for i, line in enumerate(TEXT["values"]):
        draw.text((36 * s, (190 + i * 92) * s), f"{i + 1}.", font=font(34 * s), fill="#ffc83d")
        draw.text((90 * s, (190 + i * 92) * s), line, font=font(34 * s if i < 2 else 25 * s), fill="#eef3f2")
    paste(canvas)


def kpi():
    canvas = panel("kpi", 0, 714, 640, 420, "#f4f2ea")
    image, draw, s, _ = canvas
    W, H = image.size
    centered(draw, (W / 2, 44 * s), TEXT["kpi"]["title"], 40 * s, "#2b2a26")
    x0, y0, x1, y1 = 70 * s, 90 * s, 600 * s, 370 * s
    for i in range(6):
        y = y0 + (y1 - y0) * i / 5
        draw.line([(x0, y), (x1, y)], fill="#d8d4c8", width=2 * s)
    up = [(x0 + (x1 - x0) * i / 8, y1 - (y1 - y0) * (i / 8) ** 1.8) for i in range(9)]
    draw.line(up, fill="#d9423f", width=9 * s, joint="curve")
    flat = [(x0, y1 - 120 * s), (x0 + 150 * s, y1 - 120 * s), (x0 + 260 * s, y1 - 40 * s), (x1, y1 - 8 * s)]
    draw.line(flat, fill="#2f6e78", width=9 * s, joint="curve")
    draw.text((x1 - 90 * s, y0 + 6 * s), TEXT["kpi"]["up"], font=font(30 * s), fill="#d9423f")
    draw.text((x1 - 110 * s, y1 - 56 * s), TEXT["kpi"]["flat"], font=font(30 * s), fill="#2f6e78")
    paste(canvas)


def whiteboard():
    canvas = panel("whiteboard", 654, 714, 700, 420, "#f2f4f2")
    image, draw, s, _ = canvas
    rng = random.Random(4)
    colors = ["#2f6e78", "#d9423f", "#2b2a26", "#2f6e78", "#d9423f"]
    for i, line in enumerate(TEXT["whiteboard"]):
        x, y = (40 + (i % 2) * 330) * s, (46 + i * 66) * s
        draw.text((x, y), line, font=font(38 * s, False), fill=colors[i])
    draw.line([(420 * s, 120 * s), (560 * s, 60 * s)], fill="#d9423f", width=6 * s)
    draw.ellipse([30 * s, 20 * s, 340 * s, 110 * s], outline="#2f6e78", width=5 * s)
    for _ in range(5):
        x, y = rng.randint(540, 640) * s, rng.randint(296, 356) * s
        draw.rectangle([x, y, x + 54 * s, y + 54 * s], fill=rng.choice(["#f2c879", "#f08a7a", "#9fd0f5"]))
    paste(canvas)


def notice_board():
    canvas = panel("notices", 1368, 494, 640, 420, "#b08a5e")
    image, draw, s, _ = canvas
    rng = random.Random(9)
    W, H = image.size
    for _ in range(4000):
        x, y = rng.randrange(W), rng.randrange(H)
        draw.point((x, y), fill=rng.choice(["#a27c52", "#bd976a", "#9a7349"]))
    tints = ["#f4f2ea", "#f2c879", "#f4f2ea", "#9fd0f5", "#f08a7a", "#f4f2ea"]
    for i, memo in enumerate(TEXT["memos"]):
        x, y = (24 + (i % 3) * 206) * s, (24 + (i // 3) * 196) * s
        note = Image.new("RGBA", (190 * s, 176 * s), tints[i])
        note_draw = ImageDraw.Draw(note)
        words, lines, line = memo.split(), [], ""
        for word in words:
            if font(26 * s).getlength(f"{line} {word}") > 164 * s:
                lines.append(line)
                line = word
            else:
                line = f"{line} {word}".strip()
        lines.append(line)
        for j, text in enumerate(lines):
            note_draw.text((14 * s, (22 + j * 36) * s), text, font=font(26 * s), fill="#2b2a26")
        for j in range(3):
            note_draw.line([(14 * s, (118 + j * 16) * s), (170 * s, (118 + j * 16) * s)], fill="#a9a498", width=2 * s)
        turned = note.rotate(rng.uniform(-4, 4), expand=True, resample=Image.BICUBIC)
        image.paste(turned, (x, y), turned)
        draw.ellipse([x + 84 * s, y - 6 * s, x + 104 * s, y + 14 * s], fill="#d9423f")
    paste(canvas)


def calendar():
    canvas = panel("calendar", 0, 1148, 220, 280, "#f4f2ea")
    image, draw, s, _ = canvas
    W, _ = image.size
    draw.rectangle([0, 0, W, 56 * s], fill="#c8423a")
    centered(draw, (W / 2, 28 * s), TEXT["calendar"]["month"], 26 * s, "#ffffff")
    for row in range(5):
        for col in range(7):
            x, y = (20 + col * 27) * s, (76 + row * 32) * s
            draw.text((x, y), str(row * 7 + col + 1), font=font(15 * s, False), fill="#2b2a26")
    draw.ellipse([(20 + 4 * 27 - 8) * s, (76 - 8) * s, (20 + 4 * 27 + 24) * s, (76 + 24) * s], outline="#d9423f", width=4 * s)
    centered(draw, (W / 2, 254 * s), TEXT["calendar"]["payday"], 22 * s, "#d9423f")
    paste(canvas)


def clock():
    canvas = panel("clock", 234, 1148, 160, 160, "#20282b", 4)
    image, draw, s, _ = canvas
    W, _ = image.size
    draw.ellipse([6 * s, 6 * s, 154 * s, 154 * s], fill="#f4f2ea")
    for i in range(12):
        a = math.radians(i * 30)
        draw.line(
            [(W / 2 + math.sin(a) * 58 * s, W / 2 - math.cos(a) * 58 * s), (W / 2 + math.sin(a) * 68 * s, W / 2 - math.cos(a) * 68 * s)],
            fill="#2b2a26",
            width=3 * s,
        )
    # Ten forty-one: the minute the money did not arrive in chapter 2.
    for angle, length, width in ((10.68 * 30, 40, 7), (41 * 6, 60, 4)):
        a = math.radians(angle)
        draw.line([(W / 2, W / 2), (W / 2 + math.sin(a) * length * s, W / 2 - math.cos(a) * length * s)], fill="#2b2a26", width=width * s)
    paste(canvas)


def skyline():
    canvas = panel("skyline", 0, 1442, 2048, 400, "#000000", 1)
    image, draw, _, _ = canvas
    W, H = image.size
    rng = random.Random(21)
    for y in range(H):
        t = y / H
        top, low = (86, 104, 176), (255, 178, 110)
        draw.line([(0, y), (W, y)], fill=tuple(int(a + (b - a) * t ** 1.5) for a, b in zip(top, low)))
    for layer, (tone, base, spread) in enumerate((((168, 138, 170), 150, 170), ((110, 92, 150), 230, 150), ((54, 50, 104), 310, 90))):
        x = 0
        while x < W:
            w = rng.randint(50, 130)
            h = rng.randint(30, spread)
            top = H - (H - base) - h
            draw.rectangle([x, top, x + w, H], fill=tone)
            if layer > 0:
                for wy in range(top + 8, H, 12):
                    for wx in range(x + 6, x + w - 6, 10):
                        if rng.random() < 0.26:
                            draw.rectangle([wx, wy, wx + 4, wy + 6], fill=(255, 214, 130))
            x += w + rng.randint(0, 16)
    atlas_part = image.filter(ImageFilter.GaussianBlur(1.2))
    atlas.paste(atlas_part, (0, 1442))


def screens():
    """What people work on. A hundred pixels on a phone, so shapes, not words."""
    canvas = panel("screen_board", 410, 1148, 320, 200, "#14242a")
    image, draw, s, _ = canvas
    rng = random.Random(2)
    for col, title in enumerate(TEXT["tickets"]):
        x = (10 + col * 104) * s
        draw.rectangle([x, 8 * s, x + 96 * s, 192 * s], fill="#1e333a")
        draw.text((x + 8 * s, 14 * s), title, font=font(13 * s), fill="#aebbba")
        for row in range(rng.randint(2, 4)):
            y = (40 + row * 38) * s
            draw.rectangle([x + 6 * s, y, x + 90 * s, y + 30 * s], fill=rng.choice(["#c8f0e4", "#f2c879", "#f08a7a", "#9fd0f5"]))
    paste(canvas)

    canvas = panel("screen_sheet", 744, 1148, 320, 200, "#eef3f2")
    image, draw, s, _ = canvas
    rng = random.Random(3)
    draw.rectangle([0, 0, 640, 26 * s], fill="#2f6e78")
    for row in range(9):
        for col in range(6):
            x, y = col * 53 * s, (26 + row * 19) * s
            draw.rectangle([x, y, x + 53 * s, y + 19 * s], outline="#c5cfcd")
            if rng.random() < 0.6:
                draw.rectangle([x + 6 * s, y + 7 * s, x + rng.randint(16, 44) * s, y + 12 * s], fill=rng.choice(["#55645f", "#f08a7a", "#7f8e8d"]))
    paste(canvas)

    canvas = panel("screen_mail", 1078, 1148, 320, 200, "#f4f6f5")
    image, draw, s, _ = canvas
    rng = random.Random(5)
    draw.rectangle([0, 0, 90 * s, 200 * s], fill="#d7e2e0")
    for i in range(7):
        y = (12 + i * 26) * s
        draw.rectangle([100 * s, y, 306 * s, y + 18 * s], fill="#ffffff", outline="#c5cfcd")
        draw.rectangle([108 * s, y + 6 * s, (150 + rng.randint(30, 120)) * s, y + 12 * s], fill="#d9423f" if i == 1 else "#7f8e8d")
    paste(canvas)

    canvas = panel("screen_code", 1412, 1148, 320, 200, "#0f1a1e")
    image, draw, s, _ = canvas
    rng = random.Random(6)
    for i in range(11):
        y = (10 + i * 17) * s
        x = (12 + rng.randint(0, 3) * 18) * s
        for _ in range(rng.randint(1, 4)):
            w = rng.randint(24, 70) * s
            draw.rectangle([x, y, x + w, y + 8 * s], fill=rng.choice(["#c8f0e4", "#9fd0f5", "#f2c879", "#7f8e8d"]))
            x += w + 8 * s
    paste(canvas)


def vending():
    canvas = panel("vending", 1750, 1148, 280, 280, "#10242c", 2)
    image, draw, s, _ = canvas
    rng = random.Random(8)
    for row in range(4):
        draw.rectangle([10 * s, (14 + row * 66) * s, 270 * s, (70 + row * 66) * s], fill="#183642")
        for col in range(5):
            x = (20 + col * 50) * s
            y = (22 + row * 66) * s
            if row == 3:
                continue
            draw.rectangle([x, y, x + 34 * s, y + 42 * s], fill=rng.choice(["#d9423f", "#f2c879", "#9fd0f5", "#c8f0e4"]))
    centered(draw, (140 * s, 244 * s), TEXT["vending"][3], 30 * s, "#d9423f")
    paste(canvas)


def exit_sign():
    canvas = panel("exit", 234, 1322, 160, 60, "#1f9d5c", 3)
    image, draw, s, _ = canvas
    centered(draw, (80 * s, 30 * s), TEXT["exit"], 30 * s, "#ffffff")
    paste(canvas)


def bills():
    canvas = panel("bills", 410, 1360, 320, 70, "#f4f2ea")
    image, draw, s, _ = canvas
    for i, line in enumerate(TEXT["bills"]):
        x = (8 + i * 104) * s
        draw.rectangle([x, 6 * s, x + 96 * s, 64 * s], fill="#ffffff", outline="#d9423f" if i == 2 else "#a9a498", width=2 * s)
        centered(draw, (x + 48 * s, 26 * s), line, 13 * s, "#d9423f" if i == 2 else "#2b2a26")
        draw.line([(x + 12 * s, 46 * s), (x + 84 * s, 46 * s)], fill="#a9a498", width=2 * s)
    paste(canvas)


def night_city():
    canvas = panel("night", 744, 1360, 400, 70, "#0a1420", 1)
    image, draw, _, (x, y, w, h) = canvas
    rng = random.Random(33)
    for i in range(h):
        draw.line([(0, i), (w, i)], fill=(10 + i // 3, 18 + i // 3, 34 + i // 2))
    px = 0
    while px < w:
        bw = rng.randint(18, 44)
        top = rng.randint(14, 46)
        draw.rectangle([px, top, px + bw, h], fill=(12, 18, 28))
        for wy in range(top + 3, h, 5):
            for wx in range(px + 3, px + bw - 2, 5):
                if rng.random() < 0.32:
                    draw.point((wx, wy), fill=(240, 196, 120))
        px += bw + rng.randint(0, 6)
    atlas.paste(image, (x, y))


def banner():
    """The dragon campaign's banner: a carp going up, and red enough to be seen from the desks."""
    canvas = panel("banner", 0, 1860, 1024, 170, "#c8352b")
    image, draw, s, _ = canvas
    W, H = image.size
    draw.rectangle([8 * s, 8 * s, W - 8 * s, H - 8 * s], outline="#ffc83d", width=5 * s)
    for x in (112, W // s - 112):
        draw.ellipse([(x - 62) * s, 56 * s, (x + 38) * s, 114 * s], fill="#ffc83d")
        draw.polygon([((x + 30) * s, 85 * s), ((x + 76) * s, 52 * s), ((x + 76) * s, 118 * s)], fill="#ffc83d")
        draw.ellipse([(x - 44) * s, 72 * s, (x - 34) * s, 82 * s], fill="#1b1f3a")
    size = 74 * s
    while font(size).getlength(TEXT["banner"]) > W - 400 * s:
        size -= 2
    centered(draw, (W / 2, H / 2), TEXT["banner"], size, "#ffc83d")
    paste(canvas)


def white():
    """For anything that glows in plain white, like a bare bulb."""
    canvas = panel("white", 1900, 1860, 32, 32, "#fff2d6", 1)
    paste(canvas)


for draw_decal in (white, banner, slide, logo_plate, slogan, family, values, kpi, whiteboard, notice_board, calendar, clock, skyline, screens, vending, exit_sign, bills, night_city):
    draw_decal()

atlas.save(HERE / "decals.png", optimize=True)
(HERE / "decals.json").write_text(json.dumps(rects, indent=2) + "\n")
print(f"decals: {len(rects)} pictures")
