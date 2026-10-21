# 0010 型検査は `astro check` に寄せ、tsgolint は型を使う lint 規則だけにする

- 日付: 2026-10-21
- 状態: 採用

## 背景

`make check` は型検査を 2 回走らせていた。

| 検査                                                     | TypeScript                                | 見る範囲                                           |
| -------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------- |
| `vp check`（`lint.options.typeCheck: true` で tsgolint） | 7 系（typescript-go。tsgolint に同梱）    | `.ts`・`.tsx` などの型エラーと、型を使う lint 規則 |
| `vp run typecheck`（`astro check`、`@astrojs/check`）    | 6 系（`package.json` の `typescript ^6`） | `tsconfig.json` の対象すべて。`.astro` を含む      |

- `.ts` の型エラーは両方が出す。同じ誤りが 2 回、違う版の TypeScript の文言で出る
- `.astro` の型（frontmatter とテンプレートの式、props）は `astro check` しか見ない。tsgolint は `.astro` を扱わない。Astro の文書も「`tsc` は `.astro` を無視するので `astro check` を使う」としている
- `@astrojs/check` は peer で `typescript ^5 || ^6` しか受け付けず、TypeScript 7 には上げられない（`log.md` 2026-10-20）。`astro check` を外して tsgolint だけにすると、`.astro` の型が誰にも見られなくなる

## 決定

**型エラーの報告は `astro check`（TypeScript 6）だけにする。tsgolint は型を使う lint 規則（`typeAware`）にだけ使い、型エラーの報告（`typeCheck`）は切る。**

- `vite.config.ts` の `lint.options` を `{ typeAware: true, typeCheck: false }` にする
- `make check` は今までどおり `vp check`（fmt・lint・型を使う lint 規則）→ `vp run typecheck`（`astro check`）の順に走る。中身の役割だけが分かれる
- `typescript` は `^6` のまま。型エラーを判定する TypeScript は 1 つ（6 系）になる

## 理由

- `.astro` の型を見られるのは `astro check` だけで、外せない。外せない方に寄せれば、検査を減らさずに二重をなくせる
- `astro check` は `.astro` だけでなく `.ts` も含めて `tsconfig.json` の対象をすべて見る（`include: ["**/*"]`）。tsgolint の型エラーで見ていた範囲は `astro check` に含まれる
- 型を使う lint 規則（`no-floating-promises` など）は `astro check` には無い。`typeAware` は残す
- 型エラーの判定を 1 つの TypeScript に揃えると、6 系と 7 系で結果が食い違ったときにどちらを信じるか迷わずに済む

## 影響・トレードオフ

- **TypeScript 7 での型エラーと tsconfig の検査が無くなる。** 2026-10-20 に `baseUrl` を見つけたのは tsgolint の `typeCheck` だった（oxc の文書では、tsconfig の不正な設定は `typeCheck` が有効なときに報告される）。`typeAware` だけでも tsgolint は tsconfig を読むが、TypeScript 7 で消えた設定や 7 だけで出る型エラーが報告される保証は無い。TypeScript 7 へ上げるときに、まとめて出る可能性がある
- 型エラーの報告が `vp check` より後（`astro check`）になり、`vp check` だけを手で走らせても型エラーは出ない。型まで見るときは `make check` を使う
- `astro check` は tsgolint より遅い。`make check` 全体の時間はほぼ変わらない（もともと両方走っていた）
- 見直す時期: `@astrojs/check`（または Astro の後継の検査）が TypeScript 7 を受け付けたら、`typescript` を 7 に上げ、`typeCheck` を戻すかを判断し直す。そのときはこの ADR を「廃止（→ NNNN）」にする
- `.astro` の整形・lint を `prettier-plugin-astro` で扱うかは ADR-0011 で別に判断する。どちらに決まっても、`.astro` の型は `astro check` が見ることは変わらない（`@astrojs/language-server` は `prettier-plugin-astro` を任意の peer に持つだけで、型検査には使わない）
