#!/usr/bin/env sh
set -eu
if [ "$#" -ne 2 ]; then echo "usage: sh scripts/install.sh <host> <target-project-dir>" >&2; exit 2; fi
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
node "$SCRIPT_DIR/../packages/cli/index.mjs" skills --host "$1" --root "$2"
