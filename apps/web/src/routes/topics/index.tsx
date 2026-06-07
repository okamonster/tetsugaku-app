import { createFileRoute } from '@tanstack/react-router'
import { requireChrome, requirePhilosopherId } from '#/core/routing/guards'
import { TopicsPage } from '#/features/topics/components/TopicsPage'

type TopicsSearch = {
  philosopherId?: string
}

export const Route = createFileRoute('/topics/')({
  validateSearch: (search: Record<string, unknown>): TopicsSearch => ({
    philosopherId:
      typeof search.philosopherId === 'string' ? search.philosopherId : undefined,
  }),
  beforeLoad: ({ search }) => {
    requireChrome()
    requirePhilosopherId(search.philosopherId)
  },
  component: TopicsRoute,
})

function TopicsRoute() {
  const { philosopherId } = Route.useSearch()
  return <TopicsPage philosopherId={philosopherId!} />
}
