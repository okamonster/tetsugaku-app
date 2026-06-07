import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

type ButtonPrimaryProps = {
  children: ReactNode
  to?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  className?: string
}

const baseClassName =
  'inline-flex items-center justify-center rounded-full border-[3px] border-border-strong bg-battle-red px-8 py-4 text-base font-extrabold text-text-inverse shadow-[4px_4px_0_#1A1A1A] transition hover:-translate-y-0.5'

export function ButtonPrimary({
  children,
  to,
  type = 'button',
  onClick,
  className = '',
}: ButtonPrimaryProps) {
  if (to) {
    return (
      <Link to={to} className={`${baseClassName} ${className}`}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={`${baseClassName} ${className}`}>
      {children}
    </button>
  )
}
