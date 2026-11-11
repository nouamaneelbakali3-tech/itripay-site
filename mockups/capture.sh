#!/usr/bin/env bash
# Full-page captures of the three directions with headless Edge.
#   bash mockups/capture.sh            (server must be running: dart run tool/serve.dart)
#   bash mockups/capture.sh "a b" ar   (some directions, one language)
# Headless Edge will not open a window narrower than ~500px, so the phone
# capture loads the page in a 390px iframe (frame.html) and crops the result.
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
BASE="http://localhost:8080/mockups"
HERE="$(cd "$(dirname "$0")" && pwd)"; OUT="$HERE/shots"
PROFILE="${TEMP:-/tmp}/itripay-shots-profile"
mkdir -p "$OUT"
DIRS="${1:-a b c}"; LANGS="${2:-en ar}"
shoot() { # name url width scale
  local h
  h=$("$EDGE" --headless --disable-gpu --user-data-dir="$PROFILE" --window-size=$3,900 --virtual-time-budget=8000 --dump-dom "$2" 2>/dev/null | grep -o '<html[^>]*data-h="[0-9]*"' | grep -o '[0-9]*"$' | tr -d '"')
  [ -z "$h" ] && { echo "no height for $1"; return; }
  "$EDGE" --headless --disable-gpu --hide-scrollbars --user-data-dir="$PROFILE" --force-device-scale-factor=$4 --window-size=$3,$h --virtual-time-budget=8000 --screenshot="$(cygpath -w "$OUT/$1.png")" "$2" >/dev/null 2>&1
  echo "$1.png  h=$h"
}
for d in $DIRS; do for l in $LANGS; do
  shoot "$d-desktop-$l" "$BASE/$d/?lang=$l&shot=1" 1440 1
  shoot "$d-mobile-$l" "$BASE/frame.html?dir=$d&lang=$l&shot=1" 600 2
  (cd "$HERE/.." && dart run mockups/crop.dart "mockups/shots/$d-mobile-$l.png" 780)
done; done
