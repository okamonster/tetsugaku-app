import { User } from 'lucide-react'
import type { Philosopher } from '@repo/common/philosophers'

type PhilosopherBadgeProps = {
  philosopher: Philosopher
  compact?: boolean
}

export function PhilosopherBadge({ philosopher, compact = false }: PhilosopherBadgeProps) {
  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full border-2 bg-bg-card px-3.5 py-2"
        style={{ borderColor: philosopher.color }}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-muted">
          <User className="h-3.5 w-3.5 text-text-tertiary" aria-hidden="true" />
        </div>
        <span className="text-[13px] font-semibold" style={{ color: philosopher.color }}>
          {philosopher.name}
        </span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2.5">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: philosopher.avatarBg, border: `2px solid ${philosopher.color}` }}
      >
        <User className="h-[18px] w-[18px] text-text-tertiary" aria-hidden="true" />
      </div>
      <span className="text-lg font-bold" style={{ color: philosopher.color }}>
        {philosopher.name}
      </span>
    </div>
  )
}
