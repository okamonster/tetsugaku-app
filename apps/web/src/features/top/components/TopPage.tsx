import { ROUTES } from '@repo/common/routes'
import { AppHeader } from '#/shared/components/AppHeader'
import { BrandingImage } from '#/shared/components/BrandingImage'
import { ButtonPrimary } from '#/shared/components/ButtonPrimary'
import { GrungeOverlay } from '#/shared/components/GrungeOverlay'
import { StepCard } from '#/shared/components/StepCard'

const STEPS = [
  {
    step: 1,
    title: '誰とレスバする？',
    description: '4人の哲学者から対戦相手を選ぶ',
  },
  {
    step: 2,
    title: 'お題を決める',
    description: '自由入力 or カテゴリから選ぶ',
  },
  {
    step: 3,
    title: '好きなだけ論じる',
    description: '勝敗なし。気になったらずっと続けてOK',
  },
] as const

export function TopPage() {
  return (
    <div className="relative min-h-screen bg-bg-hero">
      <GrungeOverlay />
      <AppHeader />

      <main className="relative flex flex-col items-center gap-5 px-6 pb-4 pt-6 md:px-20">
        <BrandingImage
          src="/branding/hero-resuba.png"
          alt="哲学者と、レスバ!!"
          width={1060}
          height={402}
          className="h-auto w-full max-w-[509px]"
        />

        <p className="max-w-[560px] text-center text-base font-semibold leading-relaxed text-text-secondary">
          ソクラテス、プラトン、カント、ニーチェ——
          <br />
          身近なモヤモヤを、今日の論点でぶつけろ。
        </p>

        <div className="grid w-full max-w-[1120px] grid-cols-1 gap-5 lg:grid-cols-3">
          {STEPS.map((item) => (
            <StepCard key={item.step} {...item} />
          ))}
        </div>

        <ButtonPrimary to={ROUTES.philosophers}>バトル開始!!</ButtonPrimary>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex -rotate-1 items-center rounded border-[2.5px] border-battle-cyan bg-white px-3.5 py-2 text-xs font-extrabold text-text-primary">
            Chrome 専用
          </span>
          <span className="inline-flex rotate-1 items-center rounded border-2 border-border-strong bg-battle-red px-3.5 py-2 text-xs font-extrabold text-text-inverse">
            完全無料
          </span>
        </div>
      </main>

      <footer className="flex flex-col items-center gap-2 px-6 pb-8 pt-4 text-center text-xs text-text-tertiary md:px-12">
        <p>※ Chrome 内蔵 AI（Gemini Nano）が必要です</p>
        <p>※ 会話は保存されません。リロードすると消えます</p>
      </footer>
    </div>
  )
}
