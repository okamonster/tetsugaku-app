import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  containsDefeatMarker,
  getDefaultResultComment,
  judgeBattleFast,
  stripDefeatMarker,
  type BattleDurationSeconds,
  type BattleEndReason,
  type BattleWinner,
} from '@repo/common/battle'
import type { PhilosopherId } from '@repo/common/philosophers'
import { ROUTES } from '@repo/common/routes'
import { checkLlmAvailability } from '#/core/llm/check-availability'
import {
  createLanguageModelSession,
  generateOpeningMessage,
  promptPhilosopherReply,
  type LanguageModelSession,
} from '#/core/llm/session'
import { saveBattleResult } from '#/features/battle/battle-result-storage'
import type { ChatMessage } from '#/features/chat/types'

type BattlePhase = 'fighting' | 'ended'

type UseBattleState = {
  messages: ChatMessage[]
  input: string
  remainingSeconds: number
  phase: BattlePhase
  isTimerActive: boolean
  isInitializing: boolean
  isResponding: boolean
  isDownloadingModel: boolean
  downloadProgress: number | null
  error: string | null
}

type UseBattleActions = {
  setInput: (value: string) => void
  sendMessage: () => Promise<void>
  surrender: () => void
  retry: () => Promise<void>
}

function createMessageId(): string {
  return crypto.randomUUID()
}

export function useBattle(
  philosopherId: PhilosopherId,
  topic: string,
  durationSeconds: BattleDurationSeconds,
): UseBattleState & UseBattleActions {
  const navigate = useNavigate()
  const sessionRef = useRef<LanguageModelSession | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const pendingUserMessageRef = useRef<string | null>(null)
  const phaseRef = useRef<BattlePhase>('fighting')
  const messagesRef = useRef<ChatMessage[]>([])
  const endBattleRef = useRef<
    (winner: BattleWinner, reason: BattleEndReason, comment: string) => void
  >(() => {})

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [remainingSeconds, setRemainingSeconds] = useState<number>(durationSeconds)
  const [phase, setPhase] = useState<BattlePhase>('fighting')
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isResponding, setIsResponding] = useState(false)
  const [isDownloadingModel, setIsDownloadingModel] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  const finishBattle = useCallback(
    (winner: BattleWinner, endReason: BattleEndReason, comment: string) => {
      if (phaseRef.current !== 'fighting') return

      phaseRef.current = 'ended'
      setPhase('ended')
      abortRef.current?.abort()
      setIsResponding(false)

      saveBattleResult({
        philosopherId,
        topic,
        duration: durationSeconds,
        winner,
        endReason,
        comment,
      })

      void navigate({ to: ROUTES.results })
    },
    [durationSeconds, navigate, philosopherId, topic],
  )

  useEffect(() => {
    endBattleRef.current = finishBattle
  }, [finishBattle])

  const runJudgeAndFinish = useCallback(() => {
    if (phaseRef.current !== 'fighting') return

    abortRef.current?.abort()

    const debateMessages = messagesRef.current.map((message) => ({
      role: message.role,
      text: message.text,
    }))

    const verdict = judgeBattleFast(debateMessages)
    endBattleRef.current(verdict.winner, 'time_up_judge', verdict.reason)
  }, [])

  useEffect(() => {
    if (phase !== 'fighting' || !isTimerActive) return

    const timerId = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timerId)
          runJudgeAndFinish()
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [isTimerActive, phase, runJudgeAndFinish])

  const handlePhilosopherReply = useCallback(
    (reply: string) => {
      if (containsDefeatMarker(reply)) {
        const comment =
          stripDefeatMarker(reply) ||
          getDefaultResultComment('philosopher_defeat', 'user')

        setMessages((prev) => [
          ...prev,
          { id: createMessageId(), role: 'philosopher', text: reply },
        ])

        endBattleRef.current('user', 'philosopher_defeat', comment)
        return true
      }

      setMessages((prev) => [
        ...prev,
        { id: createMessageId(), role: 'philosopher', text: reply },
      ])
      return false
    },
    [],
  )

  const requestPhilosopherReply = useCallback(
    async (userMessage: string) => {
      const session = sessionRef.current
      if (!session || phaseRef.current !== 'fighting') return

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

        if (phaseRef.current !== 'fighting') return

        const ended = handlePhilosopherReply(reply)
        if (!ended) {
          pendingUserMessageRef.current = null
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        pendingUserMessageRef.current = userMessage
        setError('応答の生成に失敗しました。もう一度試してください。')
      } finally {
        if (phaseRef.current === 'fighting') {
          setIsResponding(false)
        }
      }
    },
    [handlePhilosopherReply, topic],
  )

  const requestOpeningMessage = useCallback(
    async (session: LanguageModelSession, signal: AbortSignal) => {
      setIsResponding(true)
      setError(null)

      try {
        const opening = await generateOpeningMessage(session, topic, signal)
        if (phaseRef.current !== 'fighting') return

        const ended = handlePhilosopherReply(opening)
        if (!ended) {
          setIsTimerActive(true)
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        setError(
          'AI の準備または初回応答に失敗しました。設定を確認してからもう一度お試しください。',
        )
      } finally {
        if (phaseRef.current === 'fighting') {
          setIsResponding(false)
        }
      }
    },
    [handlePhilosopherReply, topic],
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
      setRemainingSeconds(durationSeconds)
      setPhase('fighting')
      phaseRef.current = 'fighting'
      setIsTimerActive(false)

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
  }, [durationSeconds, philosopherId, topic, retryKey, requestOpeningMessage])

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (
      !trimmed ||
      isInitializing ||
      isResponding ||
      phase !== 'fighting' ||
      !sessionRef.current
    ) {
      return
    }

    setInput('')
    pendingUserMessageRef.current = trimmed
    setMessages((prev) => [
      ...prev,
      { id: createMessageId(), role: 'user', text: trimmed },
    ])

    await requestPhilosopherReply(trimmed)
  }, [input, isInitializing, isResponding, phase, requestPhilosopherReply])

  const surrender = useCallback(() => {
    if (phase !== 'fighting' || !isTimerActive) return

    const confirmed = window.confirm('降参すると即敗北です。本当に降参しますか？')
    if (!confirmed) return

    endBattleRef.current(
      'philosopher',
      'user_surrender',
      getDefaultResultComment('user_surrender', 'philosopher'),
    )
  }, [isTimerActive, phase])

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
    phase,
    requestOpeningMessage,
    requestPhilosopherReply,
  ])

  return {
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
  }
}
