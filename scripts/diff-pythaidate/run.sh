#!/usr/bin/env bash
# src/core と pythaidate を比べる。初回は scripts/diff-pythaidate/.venv に pythaidate を入れる
set -euo pipefail

dir="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$dir/../.." && pwd)"
venv="$dir/.venv"

if [[ ! -x "$venv/bin/python" ]]; then
  python3 -m venv "$venv"
  "$venv/bin/pip" install --quiet -r "$dir/requirements.txt"
fi

cd "$root"
PYTHON="$venv/bin/python" exec node --import "$dir/resolve-ts.mjs" "$dir/compare.ts"
