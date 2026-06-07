type SetupStepListProps = {
  steps: string[]
}

export function SetupStepList({ steps }: SetupStepListProps) {
  return (
    <ol className="flex w-full max-w-[520px] flex-col gap-3 rounded-2xl border-2 border-border-strong bg-bg-card p-6">
      {steps.map((step, index) => (
        <li key={step} className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-primary text-[13px] font-bold text-text-inverse">
            {index + 1}
          </span>
          <span className="pt-0.5 text-sm leading-snug text-text-primary">{step}</span>
        </li>
      ))}
    </ol>
  )
}
