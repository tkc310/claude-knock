## Development

Run every command through the Makefile, which calls Vite+ (`vp`). Run `make` to list them.

- `make setup`: install tools from `.tool-versions` and dependencies.
- `make dev`: start the Astro dev server on http://localhost:4321. From an agent shell the command returns at once and the server keeps running. Stop it with `pnpm exec astro dev stop`.
- `make check`: `vp check` (fmt, lint) plus `astro check`. `.astro` files are formatted whole by oxfmt (ADR-0011); only their frontmatter and `<script>` are linted, and templates are covered by `astro check` and `make build`.
- `make test`: run Vitest.
- `make build`: build the static site to `dist/`.

Astro commands live in `package.json` scripts and run through `vp run <script>`. Do not use `vp dev` or `vp build`, which run plain Vite. Do not edit `src/components/ui/`, `src/lib/`, or `src/styles/8341-ui.css`. Add 8341-ui components with `make ui-add C="name ..."`.

## まず読むもの

| やりたいこと                           | 読むもの                                                       |
| -------------------------------------- | -------------------------------------------------------------- |
| ドメインのルールを知る                 | `CLAUDE.md`（利用者が書いた指示書）                            |
| このカレンダー自体を直す・改善する     | `docs/improvement-loop.md` → `.claude/skills/improve/SKILL.md` |
| 判断の理由を知る                       | `docs/decisions/`（ADR）                                       |
| 過去に直したこと・残っている改善を知る | `docs/improvement/log.md`・`docs/improvement/backlog.md`       |
| 日付の正解データを足す                 | `tests/fixtures/README.md`                                     |
| エージェントとの進め方を知る           | `docs/ai-agents.md`                                            |

## 守ること

- `CLAUDE.md` のドメインルールに従う。`CLAUDE.md` は黙って書き換えず、変更案を示して利用者に確認する
- 検査を通すために規則を緩めない（緩めるなら ADR に理由を書き、人の承認を得る）
- 8341-ui の部品に Astro の要素を props で渡さない。子要素（slot）で渡す（props で渡すとビルドが「Objects are not valid as a React child」で失敗する）
- 1 コミット 1 改善。直したら再発防止（テスト・検査・ルール・スキル）を足す
- 変更したら `make check`・`make test`・`make build` を通し、`docs/improvement/log.md` の表の先頭に 1 行記録する
- 値や方針を変えたら `docs/decisions/` に ADR を足す。古い ADR は消さず「廃止（→ NNNN）」にする
- 会話で受けた指摘も `log.md` に残し、同じ種類の指摘が続いたらルール文書か検査に格上げする
- コミットメッセージは Conventional Commits（`type(scope): 説明`）で書く

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
