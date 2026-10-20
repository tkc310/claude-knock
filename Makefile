# タイ仏教行事カレンダーの開発・運用コマンド。`make` で一覧を表示する。
# 中身は Vite+（vp）を呼ぶだけ。Astro のコマンドは package.json の scripts に集約している。

.DEFAULT_GOAL := help
SHELL := /bin/bash

# vp をグローバルに入れていなくても動くよう、プロジェクト内の vite-plus を使う
VP ?= pnpm exec vp

# 引数（例: make ui-add C="heading card"）
C ?=

.PHONY: help setup tools install dev build preview check fix test test-watch ui-add clean

##@ はじめる

help: ## コマンドの一覧を表示する
	@awk 'BEGIN { FS = ":.*## " } \
		/^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } \
		/^[a-zA-Z0-9_-]+:.*## / { printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

setup: tools install ## 初回の準備（道具と依存を入れる）

tools: ## .tool-versions の Node.js・pnpm を入れる（mise か asdf）
	@if command -v mise >/dev/null 2>&1; then mise install; \
	elif command -v asdf >/dev/null 2>&1; then asdf install; \
	else echo "mise か asdf を入れてください"; exit 1; fi

install: ## 依存を入れる
	$(VP) install

##@ 開発

dev: ## 開発サーバーを起動する（http://localhost:4321）
	$(VP) run dev

build: ## 静的サイトを dist/ にビルドする
	$(VP) run build

preview: ## ビルドしたサイトを手元で確認する
	$(VP) run preview

##@ 検査・テスト

check: ## fmt・lint・型（vp check と astro check）
	$(VP) check
	$(VP) run typecheck

fix: ## fmt と lint の自動修正
	$(VP) check --fix

test: ## テストを実行する
	$(VP) test

test-watch: ## テストを監視モードで実行する
	$(VP) test watch

##@ UI

ui-add: ## 8341-ui の部品を足す（C="heading card"）
	@test -n "$(C)" || { echo 'C="部品名 ..." を指定してください（例: make ui-add C="heading card"）'; exit 1; }
	$(VP) dlx shadcn@latest add $(addprefix @8341/,$(C))

##@ 後片付け

clean: ## ビルドの成果物を消す（依存は残す）
	rm -rf dist .astro
