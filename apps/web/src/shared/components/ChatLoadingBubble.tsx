import { User } from 'lucide-react'
import type { Philosopher } from '@repo/common/philosophers'

type ChatLoadingBubbleProps = {
  philosopher: Philosopher
}

export function ChatLoadingBubble({ philosopher }: ChatLoadingBubbleProps) {
  return (
    <div className="flex w-full max-w-[720px] gap-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: philosopher.avatarBg, border: `2px solid ${philosopher.color}` }}
      >
        <User className="h-[18px] w-[18px] text-text-tertiary" aria-hidden="true" />
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-2xl border border-border-default bg-bg-card px-[18px] py-3.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-text-tertiary" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-text-tertiary [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-text-tertiary [animation-delay:300ms]" />
        <span className="ml-1 text-[13px] text-text-tertiary">考え中...</span>
      </div>
    </div>
  )
}
