import { Flag } from 'lucide-react'

type ButtonSurrenderProps = {
  onClick: () => void
  disabled?: boolean
}

export function ButtonSurrender({ onClick, disabled = false }: ButtonSurrenderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-[52px] shrink-0 items-center justify-center gap-1.5 rounded-full border-2 border-battle-red px-4 text-sm font-extrabold text-battle-red transition enabled:hover:bg-[#FFF1F2] disabled:opacity-50"
    >
      <Flag className="h-4 w-4" aria-hidden="true" />
      降参
    </button>
  )
}
