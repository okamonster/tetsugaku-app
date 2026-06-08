import type { BattleDurationSeconds, BattleEndReason, BattleWinner } from '@repo/common/battle'
import type { PhilosopherId } from '@repo/common/philosophers'

const STORAGE_KEY = 'philosophy-resuba-battle-result'

export type BattleResult = {
  philosopherId: PhilosopherId
  topic: string
  duration: BattleDurationSeconds
  winner: BattleWinner
  endReason: BattleEndReason
  comment: string
}

export function saveBattleResult(result: BattleResult): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result))
}

export function loadBattleResult(): BattleResult | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as BattleResult
  } catch {
    return null
  }
}

export function clearBattleResult(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}
