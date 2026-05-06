#!/usr/bin/env bash
set -euo pipefail
yq -o json "$1" > /tmp/resume.json
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
resumed export --resume /tmp/resume.json --theme "$SCRIPT_DIR/../theme/index.js" --output "$2"
