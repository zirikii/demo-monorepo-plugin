#!/usr/bin/env bash
# Refresh GoPay brand assets for the unofficial demo.
set -euo pipefail
DEST="$(cd "$(dirname "$0")/.." && pwd)/public/brand"
mkdir -p "$DEST"

URLS=(
  "https://gopay.co.id/assets/img/logo/gopay.webp"
)

if command -v curl >/dev/null 2>&1; then
  for url in "${URLS[@]}"; do
    echo "Attempting $url ..."
    if curl -fsSL "$url" -o "$DEST/gopay-cdn.webp" 2>/dev/null; then
      echo "Saved $DEST/gopay-cdn.webp"
    else
      echo "CDN not reachable — keeping committed SVGs."
    fi
  done
else
  echo "curl not found — keeping committed SVGs."
fi

echo "Brand assets ready in $DEST"
