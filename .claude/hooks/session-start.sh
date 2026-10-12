#!/bin/bash
# Prepara el estudio de video al abrir una sesion en la nube.
set -euo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

if ! command -v ffmpeg >/dev/null 2>&1; then
  apt-get update -qq && apt-get install -y -qq ffmpeg >/dev/null
fi

# Chrome headless que HyperFrames usa para renderizar
npx -y hyperframes browser ensure >/dev/null 2>&1
