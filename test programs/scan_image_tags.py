#!/usr/bin/env python3
import re
import sys
import subprocess
from pathlib import Path

try:
    from PIL import Image
    from PIL.ExifTags import TAGS
except Exception as exc:
    print(f"ERROR: Pillow is required. Install with: python3 -m pip install pillow\n{exc}")
    sys.exit(1)

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".tif", ".tiff"}
XMP_RE = re.compile(rb"<x:xmpmeta.*?</x:xmpmeta>", re.S)


def _decode_xp(value):
    if isinstance(value, bytes):
        try:
            return value.decode("utf-16le", errors="ignore").rstrip("\x00").strip()
        except Exception:
            return ""
    if isinstance(value, (list, tuple)):
        try:
            return bytes(value).decode("utf-16le", errors="ignore").rstrip("\x00").strip()
        except Exception:
            return ""
    if isinstance(value, str):
        return value.strip()
    return ""


def extract_exif_keywords(path: Path):
    try:
        img = Image.open(path)
    except Exception:
        return []

    exif = img.getexif()
    keywords = []

    for tag_id, value in exif.items():
        name = TAGS.get(tag_id, tag_id)
        if name in ("XPKeywords", "XPSubject", "XPComment", "ImageDescription", "XPTitle"):
            decoded = _decode_xp(value)
            if decoded:
                # XPKeywords can be semicolon or comma separated
                parts = [p.strip() for p in re.split(r"[;,]", decoded) if p.strip()]
                keywords.extend(parts)

    return keywords


def extract_xmp_keywords(path: Path):
    try:
        data = path.read_bytes()
    except Exception:
        return []

    match = XMP_RE.search(data)
    if not match:
        return []

    xmp = match.group(0)
    keywords = []

    for li in re.findall(rb"<rdf:li>(.*?)</rdf:li>", xmp, re.S):
        try:
            text = li.decode("utf-8", errors="ignore").strip()
        except Exception:
            text = ""
        if text:
            keywords.append(text)

    m = re.search(rb"photoshop:Keywords=\"(.*?)\"", xmp)
    if m:
        try:
            text = m.group(1).decode("utf-8", errors="ignore")
            keywords.extend([k.strip() for k in text.split(",") if k.strip()])
        except Exception:
            pass

    return keywords


def extract_exiftool_keywords(path: Path):
    try:
        result = subprocess.run(
            [
                "exiftool",
                "-Keywords",
                "-Subject",
                "-IPTC:Keywords",
                "-XMP:Subject",
                "-XMP:Keywords",
                "-s",
                "-s",
                "-s",
                str(path),
            ],
            capture_output=True,
            text=True,
            check=False,
        )
    except FileNotFoundError:
        return []

    if result.returncode != 0:
        return []

    lines = [line.strip() for line in result.stdout.splitlines() if line.strip()]
    return lines


def main():
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("Test-Images")
    if not root.exists():
        print(f"ERROR: folder not found: {root}")
        sys.exit(1)

    images = sorted([p for p in root.iterdir() if p.suffix.lower() in IMAGE_EXTS])
    if not images:
        print(f"No images found in {root}")
        return

    for path in images:
        keywords = []
        keywords.extend(extract_exiftool_keywords(path))
        if not keywords:
            keywords.extend(extract_exif_keywords(path))
            keywords.extend(extract_xmp_keywords(path))
        # de-dupe while preserving order
        seen = set()
        deduped = []
        for k in keywords:
            if k not in seen:
                seen.add(k)
                deduped.append(k)

        if deduped:
            print(f"{path.name}: {', '.join(deduped)}")
        else:
            print(f"{path.name}: none")


if __name__ == "__main__":
    main()
