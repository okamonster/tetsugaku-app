import { getPhilosopherById } from '@repo/common/philosophers'
import { ROUTES } from '@repo/common/routes'
import { getEndReasonLabel } from '@repo/common/battle'
import type { BattleResult } from '#/features/battle/battle-result-storage'
import { ButtonOutline } from '#/shared/components/ButtonOutline'
import { ButtonPrimary } from '#/shared/components/ButtonPrimary'

type ResultPageProps = {
  result: BattleResult
}

export function ResultPage({ result }: ResultPageProps) {
  const philosopher = getPhilosopherById(result.philosopherId)
  const isWin = result.winner === 'user'
  const philosopherName = philosopher?.name ?? '哲学者'

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <header className="flex h-14 items-center justify-center px-6 md:px-12">
        <h1 className="font-display text-xl font-black text-text-primary">バトル結果</h1>
      </header>

      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center justify-center gap-4 px-6 py-8 text-center md:px-12">
        <p
          className={`font-display text-7xl font-black md:text-8xl ${
            isWin ? '-rotate-6 text-battle-red' : 'rotate-3 text-text-secondary'
          }`}
        >
          {isWin ? 'WIN!!' : 'LOSE...'}
        </p>

        <p className="text-base font-bold text-text-secondary">
          あなた vs {philosopherName}
        </p>

        <p className="rounded-full border-2 border-border-strong bg-white px-4 py-2 text-sm font-bold text-text-secondary -rotate-1">
          {getEndReasonLabel(result.endReason)}
        </p>

        <p className="max-w-[480px] text-[15px] leading-relaxed text-text-primary">
          {result.comment}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <ButtonPrimary
            to={ROUTES.chats}
            search={{
              philosopherId: result.philosopherId,
              topic: result.topic,
              duration: result.duration,
            }}
          >
            もう一回バトル!!
          </ButtonPrimary>
          <ButtonOutline to={ROUTES.home}>トップへ</ButtonOutline>
        </div>
      </main>
    </div>
  )
}
