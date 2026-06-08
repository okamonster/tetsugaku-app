export const BATTLE_DURATIONS = [300, 480, 600] as const

export type BattleDurationSeconds = (typeof BATTLE_DURATIONS)[number]

export const DEFAULT_BATTLE_DURATION: BattleDurationSeconds = 300

export const DEFEAT_MARKER = '【敗北】'

export type BattleWinner = 'user' | 'philosopher'

export type BattleEndReason =
  | 'philosopher_defeat'
  | 'user_surrender'
  | 'time_up'

export function isBattleDurationSeconds(
  value: number,
): value is BattleDurationSeconds {
  return (BATTLE_DURATIONS as readonly number[]).includes(value)
}

export function formatBattleDuration(seconds: BattleDurationSeconds): string {
  return `${seconds / 60}分`
}

export function formatRemainingTime(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds)
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function containsDefeatMarker(text: string): boolean {
  return text.includes(DEFEAT_MARKER)
}

export function stripDefeatMarker(text: string): string {
  return text.replace(DEFEAT_MARKER, '').trim()
}

export function getEndReasonLabel(reason: BattleEndReason): string {
  switch (reason) {
    case 'philosopher_defeat':
      return '敗北宣言 — あなたの勝利'
    case 'user_surrender':
      return '降参 — 哲学者の勝利'
    case 'time_up':
      return '時間切れ — あなたの敗北'
  }
}

export function getDefaultResultComment(
  reason: BattleEndReason,
  _winner: BattleWinner,
): string {
  switch (reason) {
    case 'philosopher_defeat':
      return '哲学者が論点を認め、敗北を宣言した。'
    case 'user_surrender':
      return '論点を深める前に戦線を放棄した。次は最後まで粘って、相手の前提を突け。'
    case 'time_up':
      return '時間内に相手の論理を突き崩せなかった。'
  }
}
