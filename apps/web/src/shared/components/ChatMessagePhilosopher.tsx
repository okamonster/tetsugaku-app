import { User } from 'lucide-react'
import type { Philosopher } from '@repo/common/philosophers'

type ChatMessagePhilosopherProps = {
  philosopher: Philosopher
  text: string
}

export function ChatMessagePhilosopher({ philosopher, text }: ChatMessagePhilosopherProps) {
  return (
    <div className="flex w-full max-w-[720px] gap-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: philosopher.avatarBg, border: `2px solid ${philosopher.color}` }}
      >
        <User className="h-[18px] w-[18px] text-text-tertiary" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="max-w-[min(100%,420px)] rounded-2xl rounded-tl-sm border bg-bg-card px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-text-primary"
          style={{ borderColor: philosopher.color, borderLeftWidth: 4 }}
        >
          {text}
        </div>
        <span
          className="mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ backgroundColor: philosopher.avatarBg, color: philosopher.color }}
        >
          {philosopher.name}
        </span>
      </div>
    </div>
  )
}
