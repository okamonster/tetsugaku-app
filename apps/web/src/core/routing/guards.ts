import { redirect } from '@tanstack/react-router'
import {
  DEFAULT_BATTLE_DURATION,
  isBattleDurationSeconds,
  type BattleDurationSeconds,
} from '@repo/common/battle'
import { isPhilosopherId } from '@repo/common/philosophers'
import { ROUTES } from '@repo/common/routes'
import { isChrome } from '#/core/browser/is-chrome'

export function requireChrome() {
  if (typeof window !== 'undefined' && !isChrome()) {
    throw redirect({ to: ROUTES.unsupportedBrowser })
  }
}

export function requirePhilosopherId(philosopherId: string | undefined) {
  if (!philosopherId || !isPhilosopherId(philosopherId)) {
    throw redirect({ to: ROUTES.philosophers })
  }
}

export function requireTopic(topic: string | undefined, philosopherId?: string) {
  if (!topic?.trim()) {
    throw redirect({
      to: ROUTES.topics,
      search: philosopherId ? { philosopherId } : {},
    })
  }
}

export function parseBattleDuration(
  value: unknown,
): BattleDurationSeconds {
  if (typeof value === 'number' && isBattleDurationSeconds(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    if (isBattleDurationSeconds(parsed)) {
      return parsed
    }
  }

  return DEFAULT_BATTLE_DURATION
}
