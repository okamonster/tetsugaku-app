import { MessageCircle } from 'lucide-react'

type TopicBadgeProps = {
  topic: string
}

export function TopicBadge({ topic }: TopicBadgeProps) {
  return (
    <div className="inline-flex max-w-[280px] items-center gap-1.5 rounded-full border border-border-strong bg-white px-3 py-1.5">
      <MessageCircle className="h-3.5 w-3.5 shrink-0 text-text-tertiary" aria-hidden="true" />
      <span className="truncate text-xs text-text-secondary">{topic}</span>
    </div>
  )
}
