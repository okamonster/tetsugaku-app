import { createFileRoute, redirect } from '@tanstack/react-router'
import type { PhilosopherId } from '@repo/common/philosophers'
import { ROUTES } from '@repo/common/routes'
import {
  checkLlmAvailability,
  isLlmReadyForChat,
} from '#/core/llm/check-availability'
import { requireChrome, requirePhilosopherId, requireTopic } from '#/core/routing/guards'
import { ChatPage } from '#/features/chat/components/ChatPage'

type ChatsSearch = {
  philosopherId?: string
  topic?: string
}

export const Route = createFileRoute('/chats/')({
  validateSearch: (search: Record<string, unknown>): ChatsSearch => ({
    philosopherId:
      typeof search.philosopherId === 'string' ? search.philosopherId : undefined,
    topic: typeof search.topic === 'string' ? search.topic : undefined,
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
  const { philosopherId, topic } = Route.useSearch()
  return <ChatPage philosopherId={philosopherId as PhilosopherId} topic={topic!} />
}
