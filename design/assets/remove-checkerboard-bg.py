#!/usr/bin/env python3
"""偽透過（チェッカー／黒背景）をアルファ透過 PNG に変換する。"""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ASSETS_DIR = Path(__file__).resolve().parent
BRANDING_DIR = ASSETS_DIR.parents[1] / "apps" / "web" / "public" / "branding"

OUTPUTS = {
    "logo-mark.png": "logo-mark.png",
    "wordmark.png": "wordmark.png",
    "hero-logo.png": "hero-resuba.png",
    "select-title.png": "select-title.png",
}


def is_checkerboard_pixel(r: int, g: int, b: int, a: int) -> bool:
    if a < 10:
        return True
    if max(r, g, b) - min(r, g, b) > 18:
        return False
    return (r + g + b) / 3 >= 196


def is_removable_pixel(r: int, g: int, b: int, a: int) -> bool:
    if a < 10:
        return True
    if r < 45 and g < 45 and b < 45:
        return True
    return is_checkerboard_pixel(r, g, b, a)


def flood_fill(image: Image.Image, is_background) -> None:
    width, height = image.size
    pixels = image.load()
    visited = [[False] * width for _ in range(height)]
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if visited[y][x]:
            continue
        visited[y][x] = True

        r, g, b, a = pixels[x, y]
        if not is_background(r, g, b, a):
            continue

        pixels[x, y] = (r, g, b, 0)

        if x > 0:
            queue.append((x - 1, y))
        if x < width - 1:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y < height - 1:
            queue.append((x, y + 1))


def flood_fill_from_transparent(image: Image.Image, is_background) -> None:
    width, height = image.size
    pixels = image.load()
    visited = [[False] * width for _ in range(height)]
    queue: deque[tuple[int, int]] = deque()

    for y in range(height):
        for x in range(width):
            if pixels[x, y][3] == 0:
                queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        if visited[y][x]:
            continue
        visited[y][x] = True

        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= width or ny >= height:
                continue
            if visited[ny][nx]:
                continue

            r, g, b, a = pixels[nx, ny]
            if not is_background(r, g, b, a):
                continue

            pixels[nx, ny] = (r, g, b, 0)
            queue.append((nx, ny))


def remove_background(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    flood_fill(image, is_checkerboard_pixel)
    flood_fill_from_transparent(image, is_removable_pixel)
    return image


def main() -> None:
    BRANDING_DIR.mkdir(parents=True, exist_ok=True)

    for src_name, dst_name in OUTPUTS.items():
        src = ASSETS_DIR / src_name
        if not src.exists():
            raise FileNotFoundError(src)

        result = remove_background(src)
        dst = BRANDING_DIR / dst_name
        result.save(dst, format="PNG", optimize=True)
        print(f"saved {dst} ({result.size[0]}x{result.size[1]})")


if __name__ == "__main__":
    main()
