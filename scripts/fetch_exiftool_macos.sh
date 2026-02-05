#!/usr/bin/env bash
set -euo pipefail

VERSION="13.44"
BASE_URL="https://exiftool.org"
ARCHIVE="Image-ExifTool-${VERSION}.tar.gz"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_DIR="${ROOT_DIR}/resources/exiftool-mac"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

mkdir -p "${DEST_DIR}"

curl -L "${BASE_URL}/${ARCHIVE}" -o "${TMP_DIR}/${ARCHIVE}"

tar -xzf "${TMP_DIR}/${ARCHIVE}" -C "${TMP_DIR}"

# The official tarball extracts to Image-ExifTool-<version>
SRC_DIR="${TMP_DIR}/Image-ExifTool-${VERSION}"

if [[ ! -d "${SRC_DIR}" ]]; then
  echo "ERROR: Expected ${SRC_DIR} to exist after extraction."
  exit 1
fi

# Install layout expected by the app
mkdir -p "${DEST_DIR}/bin" "${DEST_DIR}/libexec/lib/perl5"

# Copy the exiftool script and libs
cp "${SRC_DIR}/exiftool" "${DEST_DIR}/bin/exiftool"
rsync -a "${SRC_DIR}/lib/" "${DEST_DIR}/libexec/lib/perl5/"

# Patch shebang + library paths to be relative to bundled folder
python3 - <<'PY'
from pathlib import Path
path = Path("resources/exiftool-mac/bin/exiftool")
text = path.read_text()
lines = text.splitlines()
if lines:
    lines[0] = "#!/usr/bin/env perl"
text = "\n".join(lines) + "\n"
text = text.replace(
    "unshift @INC, '/usr/local/lib';\n", ""
)
text = text.replace(
    "unshift @INC, '/usr/lib';\n", ""
)
# Insert FindBin-based relative lib paths near top if not present
if "FindBin" not in text:
    marker = "use vars qw($VERSION $MWG_TAG_ID $MWG_MODULE $exifToolPath);\n"
    insert = "use FindBin;\n" \
             "unshift @INC, \"$FindBin::RealBin/../libexec/lib/perl5\";\n" \
             "unshift @INC, \"$FindBin::RealBin/../libexec/lib/perl5/$Config{archname}\";\n"
    if marker in text:
        text = text.replace(marker, marker + insert, 1)
path.write_text(text)
PY

chmod +x "${DEST_DIR}/bin/exiftool"
chmod -R u+rwX,go+rX "${DEST_DIR}"

echo "ExifTool ${VERSION} installed to ${DEST_DIR}"
