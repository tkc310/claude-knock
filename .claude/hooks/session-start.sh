#!/usr/bin/env bash
# クラウドセッションだけ、make test と make build に要る依存を入れる。手元では何もしない
set -euo pipefail

[[ "${CLAUDE_CODE_REMOTE:-}" == "true" ]] || exit 0
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}"

want_node=$(awk '$1 == "nodejs" { print $2 }' .tool-versions)
want_pnpm=$(awk '$1 == "pnpm" { print $2 }' .tool-versions)

# Node.js は入れ替えない（クラウドの既定を使う）。メジャーが違えば知らせるだけ
have_node=$(node --version | sed 's/^v//')
[[ "${have_node%%.*}" == "${want_node%%.*}" ]] ||
  echo "Node.js $have_node（.tool-versions は $want_node）で続けます" >&2

if [[ "$(pnpm --version 2>/dev/null)" != "$want_pnpm" ]]; then
  npm install --global --silent "pnpm@$want_pnpm"
fi

pnpm install --frozen-lockfile
