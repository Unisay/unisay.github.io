#!/usr/bin/env bash
set -euo pipefail
INPUT="$1"
OUTPUT="$2"

if command -v wkhtmltopdf >/dev/null 2>&1; then
  wkhtmltopdf --enable-local-file-access --print-media-type \
    --page-size A4 --margin-top 10mm --margin-bottom 10mm \
    --margin-left 10mm --margin-right 10mm \
    "$INPUT" "$OUTPUT"
else
  chromium --headless --no-sandbox --disable-gpu --no-first-run \
    --print-to-pdf="$OUTPUT" \
    "file://$INPUT"
fi
