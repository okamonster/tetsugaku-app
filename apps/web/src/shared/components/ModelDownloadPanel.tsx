import { Download } from 'lucide-react'

type ModelDownloadPanelProps = {
  progress: number | null
}

export function ModelDownloadPanel({ progress }: ModelDownloadPanelProps) {
  const hasProgress = progress !== null
  const clampedProgress = hasProgress ? Math.min(100, Math.max(0, progress)) : 0

  return (
    <div className="mx-auto w-full max-w-[480px] rounded-2xl border-2 border-border-strong bg-bg-card p-6 shadow-[4px_4px_0_rgba(26,26,26,0.2)]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border-strong bg-bg-muted">
          <Download className="h-5 w-5 text-accent-primary" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-text-primary">
            {hasProgress ? 'AIモデルをダウンロード中' : 'AIモデルを準備中'}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            Chrome 内蔵の Gemini Nano を初回セットアップしています。
            完了するまでこのページを閉じないでください。
          </p>

          <div
            className="mt-4 h-3 overflow-hidden rounded-full border border-border-default bg-bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={hasProgress ? clampedProgress : undefined}
            aria-label={hasProgress ? `ダウンロード進捗 ${clampedProgress}%` : 'ダウンロード準備中'}
          >
            {hasProgress ? (
              <div
                className="h-full rounded-full bg-accent-primary transition-[width] duration-300 ease-out"
                style={{ width: `${clampedProgress}%` }}
              />
            ) : (
              <div className="h-full w-1/3 animate-pulse rounded-full bg-accent-primary/70" />
            )}
          </div>

          <p className="mt-2 text-xs text-text-tertiary">
            {hasProgress
              ? `${clampedProgress}% 完了 · 初回は数分かかることがあります`
              : '接続を確認しています…'}
          </p>
        </div>
      </div>
    </div>
  )
}
