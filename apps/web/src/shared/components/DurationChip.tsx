import type { BattleDurationSeconds } from '@repo/common/battle'

type DurationChipProps = {
  minutes: 5 | 8 | 10
  seconds: BattleDurationSeconds
  subtitle: string
  selected?: boolean
  onClick: () => void
}

export function DurationChip({
  minutes,
  subtitle,
  selected = false,
  onClick,
}: DurationChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-[84px] flex-col items-center gap-0.5 rounded-2xl border-2 px-5 py-2.5 transition ${
        selected
          ? 'border-accent-primary bg-accent-primary text-text-inverse'
          : 'border-border-strong bg-white text-text-primary hover:bg-bg-muted'
      }`}
      aria-pressed={selected}
    >
      <span className="text-xl font-black">{minutes}分</span>
      <span
        className={`text-[11px] font-semibold ${
          selected ? 'text-white/80' : 'text-text-tertiary'
        }`}
      >
        {subtitle}
      </span>
    </button>
  )
}
