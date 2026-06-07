import { TriangleAlert } from 'lucide-react'

type AlertWarningProps = {
  message: string
}

export function AlertWarning({ message }: AlertWarningProps) {
  return (
    <div className="flex items-center gap-2.5 border border-accent-primary bg-[#FFF7ED] px-4 py-3 text-[13px] font-medium text-[#92400E]">
      <TriangleAlert className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}
