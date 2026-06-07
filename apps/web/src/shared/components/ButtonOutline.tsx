import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

type ButtonOutlineProps = {
  children: ReactNode
  to?: string
  search?: Record<string, string>
  onClick?: () => void
  className?: string
}

const baseClassName =
  'inline-flex items-center justify-center rounded-full border-2 border-border-strong bg-transparent px-5 py-3 text-[15px] font-medium text-text-primary transition hover:bg-bg-muted'

export function ButtonOutline({
  children,
  to,
  search,
  onClick,
  className = '',
}: ButtonOutlineProps) {
  if (to) {
    return (
      <Link to={to} search={search} className={`${baseClassName} ${className}`}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={`${baseClassName} ${className}`}>
      {children}
    </button>
  )
}
