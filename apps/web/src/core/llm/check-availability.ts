import { LANGUAGE_MODEL_OPTIONS } from '#/core/llm/options'

export type LlmAvailability =
  | { status: 'available' }
  | { status: 'downloadable' }
  | { status: 'downloading' }
  | { status: 'unsupported-browser' }
  | { status: 'api-unavailable' }
  | { status: 'checking' }

function hasLanguageModelApi(): boolean {
  return 'LanguageModel' in globalThis
}

export async function checkLlmAvailability(): Promise<LlmAvailability> {
  if (typeof window === 'undefined') {
    return { status: 'checking' }
  }

  if (!hasLanguageModelApi()) {
    return { status: 'api-unavailable' }
  }

  try {
    const result = await LanguageModel.availability(LANGUAGE_MODEL_OPTIONS)

    if (result === 'available') {
      return { status: 'available' }
    }

    if (result === 'downloadable') {
      return { status: 'downloadable' }
    }

    if (result === 'downloading') {
      return { status: 'downloading' }
    }

    return { status: 'api-unavailable' }
  } catch {
    return { status: 'api-unavailable' }
  }
}

export function isLlmReadyForChat(
  availability: LlmAvailability,
): availability is
  | { status: 'available' }
  | { status: 'downloadable' }
  | { status: 'downloading' } {
  return (
    availability.status === 'available' ||
    availability.status === 'downloadable' ||
    availability.status === 'downloading'
  )
}
