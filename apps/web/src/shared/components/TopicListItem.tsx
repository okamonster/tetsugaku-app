import { ChevronRight } from 'lucide-react'

type TopicListItemProps = {
  text: string
  selected?: boolean
  onClick: () => void
}

export function TopicListItem({ text, selected = false, onClick }: TopicListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition hover:bg-bg-muted ${
        selected ? 'border-accent-primary bg-bg-muted' : 'border-border-default bg-bg-card'
      }`}
      aria-pressed={selected}
    >
      <span className="text-sm text-text-primary">{text}</span>
      <ChevronRight className="h-[18px] w-[18px] shrink-0 text-text-tertiary" aria-hidden="true" />
    </button>
  )
}
