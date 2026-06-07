import { Glasses } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { ROUTES } from '@repo/common/routes'
import { checkLlmAvailability } from '#/core/llm/check-availability'
import { ButtonOutline } from '#/shared/components/ButtonOutline'
import { ButtonPrimary } from '#/shared/components/ButtonPrimary'
import { SetupStepList } from '#/shared/components/SetupStepList'

const STEPS = [
  'Chrome を最新版（128+）にアップデート',
  'chrome://flags で「Prompt API for Gemini Nano」を有効化',
  'chrome://components で「Optimization Guide On Device Model」を更新',
  'ブラウザを再起動してこのページを再読み込み',
]

export function LlmUnsupportedPage() {
  const navigate = useNavigate()

  const handleRetry = async () => {
    const result = await checkLlmAvailability()
    if (
      result.status === 'available' ||
      result.status === 'downloadable' ||
      result.status === 'downloading'
    ) {
      navigate({ to: ROUTES.home })
      return
    }
    window.location.reload()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-bg-primary px-6 py-12">
      <div
        className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-4 bg-[#F1F5F9]"
        style={{ borderColor: '#475569' }}
      >
        <Glasses className="h-12 w-12 text-[#475569]" aria-hidden="true" />
      </div>

      <div className="w-full max-w-[560px] rounded-2xl border-[3px] border-[#475569] bg-white p-5">
        <p className="text-sm font-black text-[#475569]">カント</p>
        <h1 className="mt-2 text-[22px] font-bold leading-snug text-text-primary">
          「対話には条件がある。まず AI の準備を整えよう。」
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Chrome 内蔵 AI（Gemini Nano）がまだ使えない状態みたい。
          <br />
          下の手順で設定してから、もう一度試してね。
        </p>
      </div>

      <span className="rotate-2 rounded border-2 border-border-strong bg-white px-3.5 py-2 text-xs font-extrabold text-text-primary">
        要セットアップ
      </span>

      <SetupStepList steps={STEPS} />

      <div className="flex flex-wrap justify-center gap-3">
        <ButtonPrimary onClick={handleRetry}>もう一度チェック</ButtonPrimary>
        <ButtonOutline to={ROUTES.home}>トップに戻る</ButtonOutline>
      </div>
    </main>
  )
}
