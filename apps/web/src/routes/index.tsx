import { createFileRoute } from '@tanstack/react-router'
import { TopPage } from '#/features/top/components/TopPage'

export const Route = createFileRoute('/')({
  component: TopPage,
})
