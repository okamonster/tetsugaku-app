import type { PhilosopherId } from '@repo/common/philosophers'
import {
  buildOpeningUserPrompt,
  buildPhilosopherSystemPrompt,
  buildUserDebatePrompt,
} from '@repo/common/prompts'
import { LANGUAGE_MODEL_OPTIONS } from '#/core/llm/options'

export type LanguageModelSession = LanguageModel

export type CreateSessionOptions = {
  onDownloadProgress?: (progress: number) => void
  signal?: AbortSignal
}

async function readStream(stream: ReadableStream<string>): Promise<string> {
  const reader = stream.getReader()
  let result = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    result += value
  }

  return result.trim()
}

export async function createLanguageModelSession(
  philosopherId: PhilosopherId,
  topic: string,
  options?: CreateSessionOptions,
): Promise<LanguageModelSession> {
  return LanguageModel.create({
    ...LANGUAGE_MODEL_OPTIONS,
    signal: options?.signal,
    initialPrompts: [
      {
        role: 'system',
        content: buildPhilosopherSystemPrompt(philosopherId, topic),
      },
    ],
    monitor: options?.onDownloadProgress
      ? (monitor) => {
          monitor.addEventListener('downloadprogress', (event) => {
            options.onDownloadProgress!(Math.round(event.loaded * 100))
          })
        }
      : undefined,
  })
}

export async function promptAndCollect(
  session: LanguageModelSession,
  prompt: string,
  signal?: AbortSignal,
): Promise<string> {
  const stream = session.promptStreaming(prompt, { signal })
  return readStream(stream)
}

export async function generateOpeningMessage(
  session: LanguageModelSession,
  topic: string,
  signal?: AbortSignal,
): Promise<string> {
  return promptAndCollect(session, buildOpeningUserPrompt(topic), signal)
}

export async function promptPhilosopherReply(
  session: LanguageModelSession,
  topic: string,
  userMessage: string,
  signal?: AbortSignal,
): Promise<string> {
  return promptAndCollect(session, buildUserDebatePrompt(topic, userMessage), signal)
}
