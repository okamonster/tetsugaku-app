# デプロイ手順（手動・MVP）

哲学レスバを Cloudflare に手動デプロイする手順。
TanStack Start + Cloudflare Vite プラグインにより **Workers（`*.workers.dev`）** として公開する。

> 仕様書上は「Cloudflare Pages」と記載。TanStack Start の公式ルートは `wrangler deploy`（Workers + 静的アセット）であり、MVP ではこれで問題ない。

## 前提

- Node.js >= 18
- pnpm 9
- Cloudflare アカウント
- Wrangler 認証済み（`wrangler login`）

## 方針（決定済み）

| 項目 | 内容 |
|------|------|
| 運用 | 手動デプロイ（初回）。後日 Workers Builds へ移行可 |
| URL | まず `*.workers.dev`、カスタムドメインは MVP 公開後 |
| 実行場所 | `apps/web` で完結 |
| デプロイ前 | 必ず `pnpm preview` で production ビルドを確認 |

## 初回セットアップ

```sh
# リポジトリルートで依存関係をインストール
pnpm install

# Wrangler にログイン（ブラウザが開く）
cd apps/web
pnpm exec wrangler login

# アカウント確認
pnpm exec wrangler whoami
```

## デプロイ手順（毎回）

すべて `apps/web` で実行する。

```sh
cd apps/web

# 1. production ビルド + ローカルプレビュー
pnpm preview
# → http://localhost:4173（または表示された URL）で確認

# 2. 確認項目
# - トップ・哲学者選択・お題入力・チャットの遷移
# - /branding/* と /philosophers/*.png の画像表示
# - Chrome で LanguageModel API が動作するか（localhost は HTTPS 相当）

# 3. 本番デプロイ
pnpm run deploy
# 内部で pnpm build && wrangler deploy
# ※ `pnpm deploy` ではなく `pnpm run deploy`（pnpm 組み込みコマンドと競合するため）
```

デプロイ完了後、ターミナルに表示される `https://tetsugaku-app.<account>.workers.dev` を開く。

## 初回デプロイの認証

`wrangler deploy` は Cloudflare 認証が必要。未ログインだと以下のエラーになる:

```text
Not logged in.
```

対処:

```sh
cd apps/web
pnpm exec wrangler login   # ブラウザで Cloudflare にログイン
pnpm exec wrangler whoami  # 確認
pnpm run deploy
```

CI や非対話環境では `CLOUDFLARE_API_TOKEN` 環境変数を設定する。

## プレビューを止める

`pnpm preview` は Ctrl+C で終了してから `pnpm deploy` を実行する。

## 設定ファイル

| ファイル | 役割 |
|----------|------|
| `apps/web/wrangler.jsonc` | Worker 名・互換日付・エントリポイント |
| `apps/web/vite.config.ts` | Cloudflare Vite プラグイン |
| `apps/web/package.json` | `build` / `preview` / `deploy` スクリプト |

### wrangler.jsonc（現状）

```jsonc
{
  "name": "tetsugaku-app",
  "compatibility_date": "2026-06-07",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry",
  "observability": { "enabled": true },
  "upload_source_maps": true
}
```

## 環境変数・シークレット

MVP では **不要**（LLM はクライアント側、バックエンドなし）。

将来バックエンド追加時:

```sh
pnpm exec wrangler secret put MY_SECRET
```

公開変数は `wrangler.jsonc` の `vars` に記載。

## カスタムドメイン（将来）

1. ドメインを取得し Cloudflare に追加
2. Workers ダッシュボードまたは Wrangler でカスタムドメインを紐付け
3. `tetsugaku-app` Worker にルートを設定

初回は `workers.dev` のみで運用する。

## トラブルシュート

### `wrangler whoami` が失敗する

```sh
pnpm exec wrangler login
```

### ビルドエラー（モノレポ）

`apps/web` ではなくルートから実行していないか確認。必ず `cd apps/web` してから `pnpm preview` / `pnpm run deploy`。

### 画像が 404

`apps/web/public/` 配下のファイルがビルドに含まれているか確認。

- `/branding/*`
- `/philosophers/ソクラテス.png` 等（日本語ファイル名）

### Chrome LLM が本番で動かない

- HTTPS でアクセスしているか（`workers.dev` は OK）
- Chrome かつ `LanguageModel` API が有効か
- 非対応時は `/unsupported/*` へ誘導される想定

## 次のステップ（任意）

- [ ] Workers Builds で GitHub 連携の自動デプロイ
- [ ] カスタムドメイン追加
- [ ] 哲学者画像の軽量化（各 ~1.5MB → WebP 化等）
