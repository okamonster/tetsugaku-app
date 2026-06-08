import { createFileRoute, redirect } from '@tanstack/react-router'
import { ROUTES } from '@repo/common/routes'
import { loadBattleResult } from '#/features/battle/battle-result-storage'
import { ResultPage } from '#/features/results/components/ResultPage'
import { requireChrome } from '#/core/routing/guards'

export const Route = createFileRoute('/results/')({
  beforeLoad: () => {
    requireChrome()

    if (typeof window !== 'undefined') {
      const result = loadBattleResult()
      if (!result) {
        throw redirect({ to: ROUTES.home })
      }
    }
  },
  component: ResultsRoute,
})

function ResultsRoute() {
  const result = loadBattleResult()
  if (!result) return null
  return <ResultPage result={result} />
}
