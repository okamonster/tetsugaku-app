type CategoryChipProps = {
  label: string
  selected?: boolean
  onClick: () => void
}

export function CategoryChip({ label, selected = false, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex -rotate-1 items-center rounded-full border-2 px-3.5 py-2 text-[13px] font-bold transition ${
        selected
          ? 'border-accent-primary bg-accent-primary text-text-inverse'
          : 'border-border-strong bg-white text-text-secondary hover:bg-bg-muted'
      }`}
      aria-pressed={selected}
    >
      {label}
    </button>
  )
}
