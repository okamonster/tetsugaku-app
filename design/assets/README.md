# デザインアセット

**筆刷り風バトルロゴ** — フォントをアウトライン化した pure SVG path。レンダリ時にフォント不要。

## 生成方法

```sh
python3 text-to-brush-svg.py
```

- ソース: `text-to-brush-svg.py`
- 筆文字フォント: [Yuji Mai](https://fonts.google.com/specimen/Yuji+Mai)（`fonts/YujiMai-Regular.ttf`, SIL OFL 1.1）
- 英字バッジ: Impact
- バトル縁取り: 多層 `stroke`（シアン→オレンジ→黒→白フィル）+ `feDisplacementMap`

## ファイル

| ファイル | 用途 |
|----------|------|
| `hero-resuba.svg` | トップ「哲学者と、レスバ!!」 |
| `wordmark.svg` | ヘッダー「哲学レスバ!!」 |
| `select-title.svg` | 哲学者選択「対戦相手を選べ!!」 |
| `grunge-noise.svg` | 画面ノイズオーバーレイ |

## 本番配置

```text
apps/web/public/branding/
  hero-resuba.svg
  wordmark.svg
  select-title.svg
  grunge-noise.svg
```

```tsx
<img src="/branding/hero-resuba.svg" alt="哲学者と、レスバ!!" width={680} height={220} />
```

## 注意

- **SVG が正**。旧 `render-logos.sh` / PNG は文字化けの原因だったため廃止。
- 文言変更時は `text-to-brush-svg.py` を編集して再生成する。
