#!/usr/bin/env python3
"""Generate brush-stroke battle logos as pure SVG paths."""

from __future__ import annotations

from pathlib import Path

from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from typing import NamedTuple

ASSETS_DIR = Path(__file__).parent
# Yuji Mai — 書道家・片岡裕司の筆文字をデジタイズ（SIL OFL 1.1）
BRUSH_FONT_PATH = ASSETS_DIR / "fonts" / "YujiMai-Regular.ttf"
IMPACT_PATH = "/System/Library/Fonts/Supplemental/Impact.ttf"

CYAN = "#00E5FF"
ORANGE = "#FF6B00"
BLACK = "#1A1A1A"
WHITE = "#FFFFFF"
YELLOW = "#FFE100"
RED = "#FF1744"

# select-title 基準のタイトルスタイル
TITLE_BASE_SIZE = 52
TITLE_STROKE_SCALE = 0.75
CANVAS_BLEED = 18


class TextBox(NamedTuple):
    path: str
    left: float
    top: float
    width: float
    height: float
    glyph_x: float
    glyph_y: float


def title_stroke_scale(font_size: float) -> float:
    return TITLE_STROKE_SCALE * (font_size / TITLE_BASE_SIZE)


def stroke_pad(font_size: float) -> float:
    return title_stroke_scale(font_size) * 12 + 8


def text_bounds(
    font: TTFont,
    text: str,
    font_size: float,
    baseline_x: float = 0,
    baseline_y: float = 0,
    letter_spacing: float = 0,
) -> tuple[float, float, float, float]:
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font.get("hmtx")
    scale = font_size / font["head"].unitsPerEm
    pen = BoundsPen(glyph_set)
    x = baseline_x
    for char in text:
        code = ord(char)
        if code not in cmap:
            continue
        name = cmap[code]
        advance, _ = hmtx[name]
        t = Transform().translate(x, baseline_y).scale(scale, -scale)
        glyph_set[name].draw(TransformPen(pen, t))
        x += (advance + letter_spacing) * scale
    if pen.bounds is None:
        return (0.0, 0.0, 0.0, 0.0)
    return pen.bounds


def make_text_box(
    font: TTFont,
    text: str,
    font_size: float,
    letter_spacing: float = 0,
) -> TextBox:
    path = text_to_path_d(font, text, font_size, 0, 0, letter_spacing)
    xmin, ymin, xmax, ymax = text_bounds(font, text, font_size, 0, 0, letter_spacing)
    pad = stroke_pad(font_size)
    return TextBox(
        path=path,
        left=0,
        top=0,
        width=(xmax - xmin) + pad * 2,
        height=(ymax - ymin) + pad * 2,
        glyph_x=xmin,
        glyph_y=ymin,
    )


def text_group(box: TextBox, font_size: float, rot: float = 0) -> str:
    pad = stroke_pad(font_size)
    inner_x = pad - box.glyph_x
    inner_y = pad - box.glyph_y
    if rot:
        return f"""<g transform="translate({box.left:.1f} {box.top:.1f})">
    <g transform="rotate({rot} {box.width / 2:.1f} {box.height / 2:.1f})" filter="url(#ink-rough)">
      <g transform="translate({inner_x:.1f} {inner_y:.1f})">{title_brush(box.path, font_size)}</g>
    </g>
  </g>"""
    return f"""<g transform="translate({box.left:.1f} {box.top:.1f})" filter="url(#ink-rough)">
    <g transform="translate({inner_x:.1f} {inner_y:.1f})">{title_brush(box.path, font_size)}</g>
  </g>"""


def title_brush(d: str, font_size: float, fill: str = WHITE) -> str:
    """select-title と同じ白筆文字＋カラー縁取り。"""
    return brush_text(
        d,
        ink=False,
        stroke_scale=title_stroke_scale(font_size),
        weight="normal",
        fill=fill,
    )


def title_splashes() -> str:
    return "\n  ".join(
        [
            splatter(70, 85, 48, 26, 18, CYAN, 0.28),
            splatter(500, 45, 60, 34, -12, ORANGE, 0.25),
        ]
    )


def badge_label_offset(
    font: TTFont,
    text: str,
    font_size: float,
    badge_w: float,
    badge_h: float,
    letter_spacing: float = 0,
    y_shift: float = 0,
) -> tuple[float, float]:
    xmin, ymin, xmax, ymax = text_bounds(font, text, font_size, 0, 0, letter_spacing)
    x = (badge_w - (xmax - xmin)) / 2 - xmin
    # 筆文字は上に細い墨が伸びるため、bbox 中心より少し下げて見た目を中央に寄せる
    y = (badge_h - (ymax - ymin)) / 2 - ymin + y_shift
    return x, y


def vs_badge(
    label_d: str,
    x: float,
    y: float,
    rot: float,
    width: float,
    height: float,
    label_offset: tuple[float, float] = (10, 3),
) -> str:
    lx, ly = label_offset
    cx, cy = width / 2, height / 2
    return f"""<g transform="translate({x:.1f} {y:.1f})">
    <g transform="rotate({rot} {cx:.1f} {cy:.1f})">
      <rect x="0" y="0" width="{width:.1f}" height="{height:.1f}" rx="3" fill="{RED}" stroke="{BLACK}" stroke-width="2.5"/>
      <g transform="translate({lx:.1f} {ly:.1f})">{path_el(label_d, WHITE)}</g>
    </g>
  </g>"""


def load_font(path: str, index: int | None = None) -> TTFont:
    return TTFont(path, fontNumber=index) if path.endswith(".ttc") and index is not None else TTFont(path)


def text_to_path_d(
    font: TTFont,
    text: str,
    font_size: float,
    baseline_x: float,
    baseline_y: float,
    letter_spacing: float = 0,
) -> str:
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font.get("hmtx")
    scale = font_size / font["head"].unitsPerEm
    parts: list[str] = []
    x = baseline_x

    for char in text:
        code = ord(char)
        if code not in cmap:
            continue
        name = cmap[code]
        advance, _ = hmtx[name]
        pen = SVGPathPen(glyph_set)
        t = Transform().translate(x, baseline_y).scale(scale, -scale)
        glyph_set[name].draw(TransformPen(pen, t))
        if cmd := pen.getCommands():
            parts.append(cmd)
        x += (advance + letter_spacing) * scale
    return " ".join(parts)


def path_el(
    d: str,
    fill: str = "none",
    stroke: str | None = None,
    stroke_width: float = 0,
    opacity: float = 1,
    dx: float = 0,
    dy: float = 0,
    paint_order: str | None = None,
) -> str:
    if not d.strip():
        return ""
    s = ""
    if stroke and stroke_width:
        s = f' stroke="{stroke}" stroke-width="{stroke_width}" stroke-linejoin="round" stroke-linecap="round"'
    po = f' paint-order="{paint_order}"' if paint_order else ""
    inner = f'<path d="{d}" fill="{fill}" opacity="{opacity}"{s}{po}/>'
    if dx or dy:
        return f'<g transform="translate({dx} {dy})">{inner}</g>'
    return inner


def brush_text(
    d: str,
    ink: bool = True,
    stroke_scale: float = 1.0,
    weight: str = "normal",
    fill: str = WHITE,
) -> str:
    """Layered battle outline around brush-letter paths."""
    s = stroke_scale
    if weight == "heavy":
        lines = [
            path_el(d, "none", CYAN, 18 * s, 1, 9, 9),
            path_el(d, "none", ORANGE, 13 * s, 1, 6, 6),
            path_el(d, "none", BLACK, 9 * s, 1, 3, 3),
        ]
        if fill == WHITE:
            lines.append(path_el(d, BLACK, BLACK, 7 * s, 1, 0, 0, paint_order="stroke fill"))
        lines += [
            path_el(d, fill, fill, 10 * s, 1, 0, 0, paint_order="stroke fill"),
            path_el(d, fill, BLACK, 4 * s, 1, 0, 0),
        ]
    elif weight == "bold":
        lines = [
            path_el(d, "none", CYAN, 15 * s, 1, 8, 8),
            path_el(d, "none", ORANGE, 10 * s, 1, 5, 5),
            path_el(d, "none", BLACK, 7 * s, 1, 2, 2),
            path_el(d, fill, fill, 7 * s, 1, 0, 0, paint_order="stroke fill"),
            path_el(d, fill, BLACK, 3.5 * s, 1, 0, 0),
        ]
    else:
        lines = [
            path_el(d, "none", CYAN, 12 * s, 1, 7, 7),
            path_el(d, "none", ORANGE, 8 * s, 1, 4, 4),
            path_el(d, "none", BLACK, 5 * s, 1, 2, 2),
            path_el(d, fill, BLACK, 3 * s, 1, 0, 0),
        ]
    if ink:
        lines.append(path_el(d, YELLOW, None, 0, 0.2, -1, -1))
    return "\n    ".join(lines)


def splatter(cx: float, cy: float, rx: float, ry: float, rot: float, color: str, op: float) -> str:
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{color}" opacity="{op}" transform="rotate({rot} {cx} {cy})"/>'


def wrap_svg(w: float, h: float, body: str) -> str:
    w = round(w)
    h = round(h)
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n'
        "  <defs>\n"
        '    <filter id="ink-rough" x="-15%" y="-15%" width="130%" height="130%">\n'
        '      <feMorphology operator="dilate" radius="0.8" result="bold"/>\n'
        '      <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" result="n"/>\n'
        '      <feDisplacementMap in="bold" in2="n" scale="2.4"/>\n'
        "    </filter>\n"
        "  </defs>\n"
        f"{body}\n</svg>\n"
    )


def hero_resuba(jp: TTFont, _impact: TTFont) -> str:
    pad = 12
    pre_size = 28
    main_size = 92
    fight_size = 14
    row_gap = 4
    stack_overlap = 10

    pre = make_text_box(jp, "哲学者と、", pre_size)
    main = make_text_box(jp, "レスバ！！", main_size, letter_spacing=14)
    fight_path = text_to_path_d(jp, "FIGHT！！", fight_size, 0, 0, letter_spacing=1)
    fx0, fy0, fx1, fy1 = text_bounds(jp, "FIGHT！！", fight_size, letter_spacing=1)
    badge_w = fx1 - fx0 + 20
    badge_h = fy1 - fy0 + 14

    header_w = pre.width + row_gap + badge_w
    content_w = max(main.width, header_w)
    origin_x = CANVAS_BLEED
    origin_y = CANVAS_BLEED

    header_x = origin_x + (content_w - header_w) / 2
    pre_x = header_x
    pre_y = origin_y
    badge_x = header_x + pre.width + row_gap
    badge_y = pre_y + (pre.height - badge_h) / 2

    main_x = origin_x + (content_w - main.width) / 2
    main_y = pre_y + pre.height - stroke_pad(main_size) - stack_overlap

    pre = pre._replace(left=pre_x, top=pre_y)
    main = main._replace(left=main_x, top=main_y)

    canvas_w = origin_x + content_w + CANVAS_BLEED + pad
    canvas_h = main_y + main.height + CANVAS_BLEED + pad

    splash_cx = main_x + main.width * 0.1
    splash_cy = main_y + main.height * 0.55

    return wrap_svg(
        canvas_w,
        canvas_h,
        f"""
  <ellipse cx="{splash_cx:.0f}" cy="{splash_cy:.0f}" rx="40" ry="22" fill="{CYAN}" opacity="0.28" transform="rotate(18 {splash_cx:.0f} {splash_cy:.0f})"/>
  <ellipse cx="{main_x + main.width * 0.65:.0f}" cy="{main_y + main.height * 0.4:.0f}" rx="48" ry="26" fill="{ORANGE}" opacity="0.25" transform="rotate(-12 {main_x + main.width * 0.65:.0f} {main_y + main.height * 0.4:.0f})"/>
  {text_group(pre, pre_size, rot=-2)}
  {text_group(main, main_size, rot=-2)}
  {vs_badge(fight_path, badge_x, badge_y, 10, badge_w, badge_h, badge_label_offset(jp, "FIGHT！！", fight_size, badge_w, badge_h, 1, y_shift=4))}""",
    )


def wordmark(jp: TTFont) -> str:
    pad = 12
    pre_size = 14
    mark_size = 28
    gap = 8

    pre_path = text_to_path_d(jp, "哲学", pre_size, 0, 0)
    px0, py0, px1, py1 = text_bounds(jp, "哲学", pre_size)
    pre_box_w = px1 - px0 + 16
    pre_box_h = py1 - py0 + 10

    resuba = make_text_box(jp, "レスバ！！", mark_size, letter_spacing=2)
    resuba_x = CANVAS_BLEED + pre_box_w + gap
    resuba_y = CANVAS_BLEED
    resuba = resuba._replace(left=resuba_x, top=resuba_y)

    canvas_w = resuba_x + resuba.width + CANVAS_BLEED + pad
    canvas_h = resuba_y + resuba.height + CANVAS_BLEED + pad
    pre_y = resuba_y + (resuba.height - pre_box_h) / 2
    pre_inner_x = 8 - px0
    pre_inner_y = (pre_box_h - (py1 - py0)) / 2 - py0

    return wrap_svg(
        canvas_w,
        canvas_h,
        f"""
  <g transform="translate({CANVAS_BLEED} {pre_y:.1f}) rotate(4)">
    <rect x="0" y="0" width="{pre_box_w:.1f}" height="{pre_box_h:.1f}" rx="2" fill="{BLACK}"/>
    <g transform="translate({pre_inner_x:.1f} {pre_inner_y:.1f})">{path_el(pre_path, WHITE)}</g>
  </g>
  {text_group(resuba, mark_size, rot=-2)}""",
    )


def select_title(jp: TTFont, impact: TTFont) -> str:
    pad = 16
    title_size = TITLE_BASE_SIZE
    title = make_text_box(jp, "対戦相手を選べ!!", title_size, letter_spacing=8)
    vs_size = 13
    vs = text_to_path_d(impact, "VS", vs_size, 0, 0)
    vs_badge_w, vs_badge_h = 52, 24

    badge_x = CANVAS_BLEED
    badge_y = CANVAS_BLEED
    title_x = CANVAS_BLEED + 4
    title_y = badge_y + 26

    title = title._replace(left=title_x, top=title_y)
    canvas_w = title_x + title.width + CANVAS_BLEED + pad
    canvas_h = title_y + title.height + CANVAS_BLEED + pad

    splash_cx = title_x + title.width * 0.12
    splash_cy = title_y + title.height * 0.55

    return wrap_svg(
        canvas_w,
        canvas_h,
        f"""
  <ellipse cx="{splash_cx:.0f}" cy="{splash_cy:.0f}" rx="44" ry="24" fill="{CYAN}" opacity="0.28" transform="rotate(18 {splash_cx:.0f} {splash_cy:.0f})"/>
  <ellipse cx="{title_x + title.width * 0.82:.0f}" cy="{title_y + title.height * 0.32:.0f}" rx="52" ry="28" fill="{ORANGE}" opacity="0.25" transform="rotate(-12 {title_x + title.width * 0.82:.0f} {title_y + title.height * 0.32:.0f})"/>
  {vs_badge(vs, badge_x, badge_y, -8, vs_badge_w, vs_badge_h, badge_label_offset(impact, "VS", vs_size, vs_badge_w, vs_badge_h))}
  {text_group(title, title_size, rot=-2)}""",
    )


def export_png(svg_path: Path) -> None:
    import subprocess

    png_path = svg_path.with_suffix(".png")
    subprocess.run(
        ["magick", "-background", "none", "-density", "200", str(svg_path), str(png_path)],
        check=True,
    )
    print(png_path)


def main() -> None:
    out = ASSETS_DIR
    if not BRUSH_FONT_PATH.exists():
        raise SystemExit(f"Brush font not found: {BRUSH_FONT_PATH}")
    jp = load_font(str(BRUSH_FONT_PATH))
    impact = load_font(IMPACT_PATH)
    for name, svg in {
        "hero-resuba.svg": hero_resuba(jp, impact),
        "wordmark.svg": wordmark(jp),
        "select-title.svg": select_title(jp, impact),
    }.items():
        path = out / name
        path.write_text(svg, encoding="utf-8")
        print(path)
        export_png(path)


if __name__ == "__main__":
    main()
