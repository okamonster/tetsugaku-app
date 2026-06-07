import { createFileRoute } from '@tanstack/react-router'
import { BrowserUnsupportedPage } from '#/features/unsupported/components/BrowserUnsupportedPage'

export const Route = createFileRoute('/unsupported/browser')({
  component: BrowserUnsupportedPage,
})
