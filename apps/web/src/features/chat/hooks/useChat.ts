import { useCallback, useEffect, useRef, useState } from 'react'
import type { PhilosopherId } from '@repo/common/philosophers'
import { checkLlmAvailability } from '#/core/llm/check-availability'
import {
  createLanguageModelSession,
  generateOpeningMessage,
  promptPhilosopherReply,
  type LanguageModelSession,
} from '#/core/llm/session'
import type { ChatMessage } from '#/features/chat/types'

type UseChatState = {
  messages: ChatMessage[]
  input: string
  isInitializing: boolean
  isResponding: boolean
  isDownloadingModel: boolean
  downloadProgress: number | null
  error: string | null
}

type UseChatActions = {
  setInput: (value: string) => void
  sendMessage: () => Promise<void>
  retry: () => Promise<void>
}

function createMessageId(): string {
  return crypto.randomUUID()
}

export function useChat(
  philosopherId: PhilosopherId,
  topic: string,
): UseChatState & UseChatActions {
  const sessionRef = useRef<LanguageModelSession | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const pendingUserMessageRef = useRef<string | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isInitializing, setIsInitializing] = useState(true)
  const [isResponding, setIsResponding] = useState(false)
  const [isDownloadingModel, setIsDownloadingModel] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  const requestPhilosopherReply = useCallback(async (userMessage: string) => {
    const session = sessionRef.current
    if (!session) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsResponding(true)
    setError(null)

    try {
      const reply = await promptPhilosopherReply(
        session,
        topic,
        userMessage,
        controller.signal,
      )
      setMessages((prev) => [
        ...prev,
        { id: createMessageId(), role: 'philosopher', text: reply },
      ])
      pendingUserMessageRef.current = null
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return
      }
      pendingUserMessageRef.current = userMessage
      setError('応答の生成に失敗しました。もう一度試してください。')
    } finally {
      setIsResponding(false)
    }
  }, [topic])

  const requestOpeningMessage = useCallback(
    async (session: LanguageModelSession, signal: AbortSignal) => {
      setIsResponding(true)
      setError(null)

      try {
        const opening = await generateOpeningMessage(session, topic, signal)
        setMessages([{ id: createMessageId(), role: 'philosopher', text: opening }])
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        setError(
          'AI の準備または初回応答に失敗しました。設定を確認してからもう一度お試しください。',
        )
      } finally {
        setIsResponding(false)
      }
    },
    [topic],
  )

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    abortRef.current = controller

    async function initialize() {
      setIsInitializing(true)
      setIsDownloadingModel(false)
      setDownloadProgress(null)
      setError(null)
      setMessages([])

      sessionRef.current?.destroy()
      sessionRef.current = null

      try {
        const availability = await checkLlmAvailability()
        if (cancelled) return

        if (
          availability.status === 'downloading' ||
          availability.status === 'downloadable'
        ) {
          setIsDownloadingModel(true)
        }

        const session = await createLanguageModelSession(philosopherId, topic, {
          signal: controller.signal,
          onDownloadProgress: (progress) => {
            if (cancelled) return
            setIsDownloadingModel(true)
            setDownloadProgress(progress)
          },
        })

        if (cancelled) {
          session.destroy()
          return
        }

        sessionRef.current = session
        setIsDownloadingModel(false)
        setDownloadProgress(null)
        setIsInitializing(false)
        await requestOpeningMessage(session, controller.signal)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        if (!cancelled) {
          setError(
            'AI の準備または初回応答に失敗しました。設定を確認してからもう一度お試しください。',
          )
          setIsInitializing(false)
          setIsDownloadingModel(false)
          setDownloadProgress(null)
        }
      }
    }

    void initialize()

    return () => {
      cancelled = true
      controller.abort()
      sessionRef.current?.destroy()
      sessionRef.current = null
    }
  }, [philosopherId, topic, retryKey, requestOpeningMessage])

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isInitializing || isResponding || !sessionRef.current) return

    setInput('')
    pendingUserMessageRef.current = trimmed
    setMessages((prev) => [
      ...prev,
      { id: createMessageId(), role: 'user', text: trimmed },
    ])

    await requestPhilosopherReply(trimmed)
  }, [input, isInitializing, isResponding, requestPhilosopherReply])

  const retry = useCallback(async () => {
    if (isInitializing || isResponding) return

    const session = sessionRef.current
    const pending = pendingUserMessageRef.current

    if (session && pending) {
      await requestPhilosopherReply(pending)
      return
    }

    if (session && messages.length === 0) {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      await requestOpeningMessage(session, controller.signal)
      return
    }

    setRetryKey((key) => key + 1)
  }, [
    isInitializing,
    isResponding,
    messages.length,
    requestOpeningMessage,
    requestPhilosopherReply,
  ])

  return {
    messages,
    input,
    isInitializing,
    isResponding,
    isDownloadingModel,
    downloadProgress,
    error,
    setInput,
    sendMessage,
    retry,
  }
}
