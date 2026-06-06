# tetsugaku-app

## プロジェクト概要

哲学者とレスバ（論争）して遊べる Web アプリ。エンターテインメント目的。

**要件定義**: ✅ 完了。
**実装**: ⏸️ Pencil でデザイン完成まで着手しない。クリーンスタートは方針承認済み。

## 技術スタック

- **フレームワーク**: TanStack Start（Next.js は使わない）
- **デプロイ**: Cloudflare Pages
- **パッケージ管理**: pnpm
- **LLM**: Chrome 内蔵のローカル Gemini（Gemini Nano / Chrome Built-in AI APIs）
  - サーバー側 LLM API は使わない
  - Chrome の `LanguageModel` / Prompt API を使用
- **モノレポ**: Turborepo + pnpm を維持（将来バックエンド追加に備える）
- **移行**: `create-turbo` 生成の `apps/` 配下を削除し、TanStack Start でクリーンスタート

## 設計上の制約

- ローカル LLM のため **Chrome 専用**
- HTTPS または localhost が必要
- ユーザー端末でモデルのダウンロードが必要な場合あり
- MVP はバックエンド不要（会話処理はすべてクライアント側）
- 履歴保存は将来 `apps/backend` + インフラで実装予定

## 決定済み

- アプリの目的: 哲学者とのレスバ遊び
- フレームワーク: TanStack Start
- デプロイ: Cloudflare Pages
- LLM: Chrome ローカル Gemini
- 進行形式: **フリーチャット**（ラウンド制・勝敗判定なし）
- お題: ユーザーが自由入力。思い浮かばないときは **選択式 UI** でお題を選べる
- 哲学者: MVP は固定 4 人（ソクラテス・プラトン・カント・ニーチェ）。将来拡張予定

### ペルソナ方針（暫定）

| 哲学者 | 論じ方の特徴 |
|--------|-------------|
| ソクラテス | 問答法、相手を問い詰める |
| プラトン | イデア論・正義、理想主義 |
| カント | 義務論・理性、冷静に論理展開 |
| ニーチェ | 挑発的、既存価値観を否定 |

### お題の方針

- 抽象論より **私生活・身近な話題** を優先
- 選択式 UI: 5 カテゴリ（人間関係 / 仕事・キャリア / SNS・現代生活 / 自分自身 / 恋愛・性）
- 具体リストは後日決定。データは `packages/common` に JSON 想定

## データ永続化

- MVP: 保存なし（リロードで消える）
- 将来: backend + インフラで履歴保存

## 画面構成（MVP）

1. トップ（キャッチコピー + 3 ステップ説明 + CTA + 注記）
2. 哲学者選択
3. お題入力（自由 + 選択式）
4. チャット画面

## ブラウザ対応

- Chrome 専用。非対応環境では案内画面のみ
- フォールバック API なし（MVP）

## UI・スタイリング

- Tailwind CSS + shadcn/ui
- MVP: ライトモードのみ。CSS 変数等で将来のダーク / ライト切替に備える

## モノレポ構成

```
apps/
  web/          # TanStack Start（フロントエンド）— MVP の主戦場
  backend/      # バックエンド（将来）
packages/
  common/       # 共有ロジック・型定義
  ui/           # 共有 UI コンポーネント（shadcn/ui ベース）
  tsconfig/     # 共有 TypeScript 設定
```

## MVP スコープ

- 実装対象: `apps/web` + `packages/{common,ui,tsconfig}`
- `apps/backend` は MVP では作らない

## 言語

- 日本語のみ。哲学者も現代日本語で論じる（ペルソナの思想・論調は維持）

## LLM 応答表示

- API はストリーミングで生成。UI はローディング表示 → 完了後に一括表示

## リロード・離脱時の UX

- チャット画面に「会話は保存されません」を常時表示
- `beforeunload` 等で離脱確認

## Chrome ローカル LLM 未準備時

- 起動時に `LanguageModel` API の可用性をチェック
- 不可なら手順付き案内画面を表示

## 哲学者選択 UI

- イラスト / 肖像画像 + 名前・キャッチコピー・説明のカード形式

## 肖像画像

- AI 生成 + 選定。画風統一。`apps/web/public/philosophers/` に配置想定

## 将来のバックエンド（履歴保存時）

- Hono on Cloudflare Workers（決定）
- DB は履歴機能実装時に決定（第一候補: Turso。D1 / Supabase も比較）

## 未決定（実装前に決める）

- 選択式お題の具体リスト
- 将来の DB 最終選定

## デザイン・実装の進め方

1. **Pencil** で画面デザインを作り込む（先に完了させる）
2. デザイン確定後: クリーンスタート（`apps/` スターター削除 → TanStack Start 新設）
3. Pencil デザインに沿って UI 実装 → LLM 接続 → デプロイ

**重要**: デザイン確定前に UI を勝手に実装しない。

## 実装時の優先順位（デザイン確定後）

1. クリーンスタート
2. Pencil デザインに基づく 4 画面 UI
3. Chrome ローカル LLM 接続 + ペルソナプロンプト
4. お題データ（`packages/common`）+ 肖像画像
5. Cloudflare Pages デプロイ

## 開発コマンド

```sh
pnpm install   # 依存関係インストール
pnpm dev       # 開発サーバー起動
pnpm build     # ビルド
pnpm lint      # リント
```
