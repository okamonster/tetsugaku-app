type StepCardProps = {
  step: number
  title: string
  description: string
}

export function StepCard({ step, title, description }: StepCardProps) {
  return (
    <article className="flex h-full w-full items-center gap-4 rounded-2xl border-2 border-border-strong bg-bg-card p-5">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-battle-red text-base font-black text-text-inverse"
        aria-hidden="true"
      >
        {step}
      </div>
      <div className="min-w-0 space-y-1">
        <h3 className="font-display text-[17px] font-extrabold text-text-primary">
          {title}
        </h3>
        <p className="text-sm leading-snug text-text-secondary">{description}</p>
      </div>
    </article>
  )
}
