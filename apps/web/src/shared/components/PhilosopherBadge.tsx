import type { Philosopher } from '@repo/common/philosophers'
import { PhilosopherAvatar } from '#/shared/components/PhilosopherAvatar'

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
        <PhilosopherAvatar philosopher={philosopher} className="h-6 w-6" />
        <span className="text-[13px] font-semibold" style={{ color: philosopher.color }}>
          {philosopher.name}
        </span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2.5">
      <PhilosopherAvatar philosopher={philosopher} />
      <span className="text-lg font-bold" style={{ color: philosopher.color }}>
        {philosopher.name}
      </span>
    </div>
  )
}
