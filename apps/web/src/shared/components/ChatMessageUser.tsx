type ChatMessageUserProps = {
  text: string
}

export function ChatMessageUser({ text }: ChatMessageUserProps) {
  return (
    <div className="flex w-full max-w-[720px] justify-end">
      <div className="max-w-[min(100%,420px)] rounded-2xl rounded-br-sm bg-accent-primary px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-text-inverse">
        {text}
      </div>
    </div>
  )
}
