export function GrungeOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.14]"
      aria-hidden="true"
    >
      <img
        src="/branding/grunge-noise.svg"
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
  )
}
