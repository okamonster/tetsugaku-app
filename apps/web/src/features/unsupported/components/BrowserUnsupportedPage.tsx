import { User } from 'lucide-react'
import { ROUTES } from '@repo/common/routes'
import { ButtonOutline } from '#/shared/components/ButtonOutline'
import { SetupStepList } from '#/shared/components/SetupStepList'

const STEPS = [
  'Google Chrome をインストール',
  '最新版にアップデート',
  'このページを Chrome で開き直す',
]

export function BrowserUnsupportedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-bg-primary px-6 py-12">
      <div
        className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-4 bg-[#DBEAFE]"
        style={{ borderColor: '#2563EB' }}
      >
        <User className="h-12 w-12 text-[#2563EB]" aria-hidden="true" />
      </div>

      <div className="w-full max-w-[560px] rounded-2xl border-[3px] border-[#2563EB] bg-white p-5">
        <p className="text-sm font-black text-[#2563EB]">ソクラテス</p>
        <h1 className="mt-2 text-[22px] font-bold leading-snug text-text-primary">
          「このブラウザでレスバできると、本当に思ってる？」
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          このアプリは Chrome 内蔵 AI（Gemini Nano）が必要だよ。
          <br />
          Safari や Firefox では動かない。
        </p>
      </div>

      <span className="-rotate-3 rounded border-2 border-border-strong bg-white px-3.5 py-2 text-xs font-extrabold text-text-primary">
        Chrome 専用
      </span>

      <SetupStepList steps={STEPS} />

      <ButtonOutline to={ROUTES.home}>トップに戻る</ButtonOutline>
    </main>
  )
}
