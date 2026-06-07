type LogoMarkProps = {
  className?: string
  size?: number
}

export function LogoMark({ className = '', size = 52 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="0"
        y="10"
        width="30"
        height="26"
        rx="10"
        fill="#FF1744"
        stroke="#1A1A1A"
        strokeWidth="3"
        transform="rotate(-14 15 23)"
      />
      <rect
        x="6"
        y="30"
        width="8"
        height="8"
        rx="1"
        fill="#E85D4C"
        stroke="#1A1A1A"
        strokeWidth="2"
        transform="rotate(45 10 34)"
      />
      <rect
        x="22"
        y="4"
        width="30"
        height="26"
        rx="10"
        fill="#FFFFFF"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        transform="rotate(14 37 17)"
      />
      <rect
        x="40"
        y="24"
        width="8"
        height="8"
        rx="1"
        fill="#FFFFFF"
        stroke="#1A1A1A"
        strokeWidth="2"
        transform="rotate(45 44 28)"
      />
      <rect
        x="18"
        y="16"
        width="14"
        height="4"
        rx="2"
        fill="#00E5FF"
        transform="rotate(-35 25 18)"
      />
      <rect
        x="24"
        y="20"
        width="12"
        height="4"
        rx="2"
        fill="#FF6B00"
        transform="rotate(25 30 22)"
      />
      <rect
        x="16"
        y="14"
        width="24"
        height="18"
        rx="4"
        fill="#FFE100"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        transform="rotate(-6 28 23)"
      />
      <text
        x="28"
        y="26"
        textAnchor="middle"
        fill="#1A1A1A"
        fontFamily="M PLUS 1p, sans-serif"
        fontSize="11"
        fontWeight="900"
      >
        VS
      </text>
    </svg>
  )
}
