import { createFileRoute, redirect } from '@tanstack/react-router'
import type { PhilosopherId } from '@repo/common/philosophers'
import { ROUTES } from '@repo/common/routes'
import {
  checkLlmAvailability,
  isLlmReadyForChat,
} from '#/core/llm/check-availability'
import {
  parseBattleDuration,
  requireChrome,
  requirePhilosopherId,
  requireTopic,
} from '#/core/routing/guards'
import { ChatPage } from '#/features/chat/components/ChatPage'

type ChatsSearch = {
  philosopherId?: string
  topic?: string
  duration?: number
}

export const Route = createFileRoute('/chats/')({
  validateSearch: (search: Record<string, unknown>): ChatsSearch => ({
    philosopherId:
      typeof search.philosopherId === 'string' ? search.philosopherId : undefined,
    topic: typeof search.topic === 'string' ? search.topic : undefined,
    duration:
      typeof search.duration === 'number'
        ? search.duration
        : typeof search.duration === 'string'
          ? Number(search.duration)
          : undefined,
  }),
  beforeLoad: async ({ search }) => {
    requireChrome()
    requirePhilosopherId(search.philosopherId)
    requireTopic(search.topic, search.philosopherId)

    if (typeof window !== 'undefined') {
      const llm = await checkLlmAvailability()
      if (!isLlmReadyForChat(llm)) {
        throw redirect({ to: ROUTES.unsupportedLlm })
      }
    }
  },
  component: ChatsRoute,
})

function ChatsRoute() {
  const { philosopherId, topic, duration } = Route.useSearch()
  return (
    <ChatPage
      philosopherId={philosopherId as PhilosopherId}
      topic={topic!}
      duration={parseBattleDuration(duration)}
    />
  )
}
