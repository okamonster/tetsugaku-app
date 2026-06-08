import { useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import type { BattleDurationSeconds } from '@repo/common/battle'
import { getPhilosopherById, type PhilosopherId } from '@repo/common/philosophers'
import { ROUTES } from '@repo/common/routes'
import { useBattle } from '#/features/chat/hooks/useBattle'
import { AlertWarning } from '#/shared/components/AlertWarning'
import { ButtonOutline } from '#/shared/components/ButtonOutline'
import { ButtonSurrender } from '#/shared/components/ButtonSurrender'
import { ChatLoadingBubble } from '#/shared/components/ChatLoadingBubble'
import { ModelDownloadPanel } from '#/shared/components/ModelDownloadPanel'
import { ChatMessagePhilosopher } from '#/shared/components/ChatMessagePhilosopher'
import { ChatMessageUser } from '#/shared/components/ChatMessageUser'
import { TimerBadge } from '#/shared/components/TimerBadge'
import { TopicBadge } from '#/shared/components/TopicBadge'

type ChatPageProps = {
  philosopherId: PhilosopherId
  topic: string
  duration: BattleDurationSeconds
}

const INPUT_MIN_HEIGHT = 52
const INPUT_MAX_HEIGHT = 160

export function ChatPage({ philosopherId, topic, duration }: ChatPageProps) {
  const philosopher = getPhilosopherById(philosopherId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isComposingRef = useRef(false)
  const skipEnterForImeRef = useRef(false)

  const {
    messages,
    input,
    remainingSeconds,
    phase,
    isTimerActive,
    isInitializing,
    isResponding,
    isDownloadingModel,
    downloadProgress,
    error,
    setInput,
    sendMessage,
    surrender,
    retry,
  } = useBattle(philosopherId, topic, duration)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isResponding, isInitializing])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const nextHeight = Math.min(
      Math.max(textarea.scrollHeight, INPUT_MIN_HEIGHT),
      INPUT_MAX_HEIGHT,
    )
    textarea.style.height = `${nextHeight}px`
  }, [input])

  useEffect(() => {
    if (phase !== 'fighting') return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [phase])

  if (!philosopher) return null

  const isInputDisabled =
    phase !== 'fighting' || isInitializing || isResponding || Boolean(error)
  const canSend = input.trim().length > 0 && !isInputDisabled
  const showTimerUrgent = isTimerActive && remainingSeconds <= 30

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg-primary">
      <div className="z-20 shrink-0 bg-bg-primary">
        <header className="flex min-h-[88px] items-center justify-between gap-4 border-b-2 border-border-strong px-6 py-3 md:px-12">
          <ButtonOutline
            to={ROUTES.topics}
            search={{ philosopherId }}
          >
            ← 終了
          </ButtonOutline>

          <div className="flex flex-col items-center gap-1.5">
            <p
              className="text-base font-extrabold"
              style={{ color: philosopher.color }}
            >
              vs {philosopher.name}
            </p>
            <TimerBadge
              remainingSeconds={remainingSeconds}
              urgent={showTimerUrgent}
              preparing={!isTimerActive && phase === 'fighting'}
            />
          </div>

          <TopicBadge topic={topic} />
        </header>

        <AlertWarning message="⚠ 会話は保存されません。降参・時間切れは即敗北" />
      </div>

      <main className="mx-auto flex w-full max-w-[960px] flex-1 flex-col gap-5 overflow-y-auto px-6 py-6 md:px-[120px]">
        {messages.map((message) =>
          message.role === 'user' ? (
            <ChatMessageUser key={message.id} text={message.text} />
          ) : (
            <ChatMessagePhilosopher
              key={message.id}
              philosopher={philosopher}
              text={message.text}
            />
          ),
        )}

        {isDownloadingModel ? (
          <ModelDownloadPanel progress={downloadProgress} />
        ) : null}

        {!isDownloadingModel && (isInitializing || isResponding) ? (
          <ChatLoadingBubble philosopher={philosopher} />
        ) : null}

        {error ? (
          <div className="rounded-xl border border-[#DC2626] bg-[#FEE2E2] px-4 py-3 text-sm text-[#991B1B]">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void retry()}
              className="mt-2 font-semibold underline"
            >
              再試行
            </button>
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </main>

      <footer className="z-20 shrink-0 border-t border-border-default bg-bg-primary px-6 py-4 md:px-12">
        <form
          className="mx-auto max-w-[960px]"
          onSubmit={(event) => {
            event.preventDefault()
            void sendMessage()
          }}
        >
          <div className="flex items-end gap-3">
            <ButtonSurrender
              onClick={surrender}
              disabled={isInputDisabled || !isTimerActive}
            />

            <label htmlFor="chat-input" className="sr-only">
              反論を送る
            </label>
            <textarea
              ref={textareaRef}
              id="chat-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onCompositionStart={() => {
                isComposingRef.current = true
              }}
              onCompositionEnd={() => {
                isComposingRef.current = false
                skipEnterForImeRef.current = true
              }}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' || event.shiftKey) return

                if (
                  event.nativeEvent.isComposing ||
                  isComposingRef.current ||
                  event.keyCode === 229
                ) {
                  return
                }

                if (skipEnterForImeRef.current) {
                  skipEnterForImeRef.current = false
                  return
                }

                event.preventDefault()
                if (canSend) void sendMessage()
              }}
              placeholder="反論を送る..."
              disabled={isInputDisabled}
              className="min-h-[52px] flex-1 resize-none overflow-y-auto rounded-2xl border border-border-default bg-bg-card px-4 py-3 text-[15px] leading-relaxed text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent-primary disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!canSend}
              aria-label="送信"
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 border-border-strong bg-accent-primary text-text-inverse shadow-[2px_2px_0_#1A1A1A] transition enabled:hover:translate-y-px enabled:active:translate-y-0.5 disabled:opacity-60"
            >
              <Send className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-text-tertiary">
            Enter で送信 · Shift+Enter で改行
          </p>
        </form>
      </footer>
    </div>
  )
}
