import type { Philosopher } from '@repo/common/philosophers'
import { PhilosopherAvatar } from '#/shared/components/PhilosopherAvatar'

type PhilosopherCardProps = {
  philosopher: Philosopher
  selected?: boolean
  onSelect: () => void
}

export function PhilosopherCard({
  philosopher,
  selected = false,
  onSelect,
}: PhilosopherCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full max-w-[268px] flex-col items-center gap-2 rounded-[20px] border-[3px] bg-bg-card p-[18px] text-left shadow-[4px_4px_0_rgba(26,26,26,0.25)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${
        selected ? 'scale-[1.02]' : ''
      }`}
      style={{
        borderColor: philosopher.color,
        transform: `rotate(${philosopher.rotation}deg)`,
        boxShadow: selected
          ? `0 0 0 3px ${philosopher.color}33, 4px 4px 0 rgba(26,26,26,0.25)`
          : undefined,
      }}
      aria-pressed={selected}
    >
      <PhilosopherAvatar philosopher={philosopher} className="h-20 w-20" />
      <h3 className="font-display text-center text-[22px] font-black text-text-primary">
        {philosopher.name}
      </h3>
      <p
        className="text-center text-xs font-extrabold"
        style={{ color: philosopher.color }}
      >
        {philosopher.quote}
      </p>
      <p className="text-center text-xs leading-snug text-text-secondary">
        {philosopher.description}
      </p>
    </button>
  )
}
