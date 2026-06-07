import { createFileRoute } from '@tanstack/react-router'
import { requireChrome } from '#/core/routing/guards'
import { LlmUnsupportedPage } from '#/features/unsupported/components/LlmUnsupportedPage'

export const Route = createFileRoute('/unsupported/llm')({
  beforeLoad: () => {
    requireChrome()
  },
  component: LlmUnsupportedPage,
})
