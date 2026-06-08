import { Timer } from 'lucide-react'
import { formatRemainingTime } from '@repo/common/battle'

type TimerBadgeProps = {
  remainingSeconds: number
  urgent?: boolean
  preparing?: boolean
}

export function TimerBadge({
  remainingSeconds,
  urgent = false,
  preparing = false,
}: TimerBadgeProps) {
  if (preparing) {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full border-2 border-border-default bg-bg-muted px-4 py-2"
        aria-live="polite"
        aria-label="試合準備中。タイマーは開始後に動きます"
      >
        <Timer className="h-[18px] w-[18px] text-text-tertiary" aria-hidden="true" />
        <span className="font-display text-base font-extrabold text-text-secondary">
          準備中
        </span>
      </div>
    )
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border-[2.5px] border-border-strong px-4 py-2 shadow-[3px_3px_0_#1A1A1A] bg-battle-red text-text-inverse ${
        urgent ? 'animate-pulse' : ''
      }`}
      aria-live="polite"
      aria-label={`残り時間 ${formatRemainingTime(remainingSeconds)}`}
    >
      <Timer className="h-[18px] w-[18px]" aria-hidden="true" />
      <span className="font-display text-2xl font-black tabular-nums">
        {formatRemainingTime(remainingSeconds)}
      </span>
    </div>
  )
}
