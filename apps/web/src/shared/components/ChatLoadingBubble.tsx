import type { Philosopher } from '@repo/common/philosophers'
import { PhilosopherAvatar } from '#/shared/components/PhilosopherAvatar'

type ChatLoadingBubbleProps = {
  philosopher: Philosopher
}

export function ChatLoadingBubble({ philosopher }: ChatLoadingBubbleProps) {
  return (
    <div className="flex w-full max-w-[720px] gap-3">
      <PhilosopherAvatar philosopher={philosopher} />
      <div className="inline-flex items-center gap-1.5 rounded-2xl border border-border-default bg-bg-card px-[18px] py-3.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-text-tertiary" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-text-tertiary [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-text-tertiary [animation-delay:300ms]" />
        <span className="ml-1 text-[13px] text-text-tertiary">考え中...</span>
      </div>
    </div>
  )
}
