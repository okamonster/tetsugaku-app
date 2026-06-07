import type { ReactNode } from 'react'
import { ButtonOutline } from '#/shared/components/ButtonOutline'

type PageBackHeaderProps = {
  backLabel?: string
  backTo: string
  rightSlot?: ReactNode
}

export function PageBackHeader({
  backLabel = '← 戻る',
  backTo,
  rightSlot,
}: PageBackHeaderProps) {
  return (
    <header className="flex h-[72px] items-center justify-between border-b-2 border-border-strong px-6 md:px-12">
      <ButtonOutline to={backTo}>{backLabel}</ButtonOutline>
      {rightSlot ?? <div className="w-[100px]" aria-hidden="true" />}
    </header>
  )
}
