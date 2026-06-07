import type { Philosopher } from '@repo/common/philosophers'

type PhilosopherAvatarProps = {
  philosopher: Philosopher
  className?: string
  borderWidth?: number
}

export function PhilosopherAvatar({
  philosopher,
  className = 'h-9 w-9',
  borderWidth = 2,
}: PhilosopherAvatarProps) {
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full ${className}`}
      style={{
        backgroundColor: philosopher.avatarBg,
        border: `${borderWidth}px solid ${philosopher.color}`,
      }}
    >
      <img
        src={philosopher.avatarSrc}
        alt=""
        className="h-full w-full object-cover"
        decoding="async"
        aria-hidden="true"
      />
    </div>
  )
}
