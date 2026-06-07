import { createFileRoute } from '@tanstack/react-router'
import { requireChrome } from '#/core/routing/guards'
import { PhilosophersPage } from '#/features/philosophers/components/PhilosophersPage'

export const Route = createFileRoute('/philosophers/')({
  beforeLoad: () => {
    requireChrome()
  },
  component: PhilosophersPage,
})
