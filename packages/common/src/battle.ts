export const BATTLE_DURATIONS = [300, 480, 600] as const

export type BattleDurationSeconds = (typeof BATTLE_DURATIONS)[number]

export const DEFAULT_BATTLE_DURATION: BattleDurationSeconds = 300

export const DEFEAT_MARKER = '【敗北】'

export type BattleWinner = 'user' | 'philosopher'

export type BattleEndReason =
  | 'philosopher_defeat'
  | 'user_surrender'
  | 'time_up_judge'

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
    case 'time_up_judge':
      return '時間切れ — 審判判定'
  }
}

type JudgeMessage = {
  role: 'user' | 'philosopher'
  text: string
}

const REBUTTAL_PATTERN =
  /(おかしい|矛盾|なぜ|どうして|違う|例えば|つまり|では|ないのか|根拠)/

export function judgeBattleFast(
  messages: ReadonlyArray<JudgeMessage>,
): { winner: BattleWinner; reason: string } {
  const userMsgs = messages.filter((message) => message.role === 'user')
  const philMsgs = messages.filter((message) => message.role === 'philosopher')

  if (userMsgs.length === 0) {
    return { winner: 'philosopher', reason: '反論なく終了' }
  }

  let userScore = 0
  let philScore = 1

  userScore += Math.min(userMsgs.length * 2, 8)

  let rebuttalCount = 0
  for (const message of userMsgs) {
    const length = message.text.trim().length
    if (length >= 20) userScore += 1
    if (length >= 60) userScore += 1
    if (REBUTTAL_PATTERN.test(message.text)) {
      userScore += 2
      rebuttalCount += 1
    }
    if (/[？?]/.test(message.text)) userScore += 1
  }

  for (const message of philMsgs) {
    if (message.text.trim().length >= 80) philScore += 1
  }

  const lastUser = userMsgs[userMsgs.length - 1]!.text.trim()
  const lastPhil = philMsgs[philMsgs.length - 1]?.text.trim() ?? ''

  if (lastUser.length >= 30 && lastUser.length >= lastPhil.length * 0.5) {
    userScore += 2
  } else if (lastPhil.length > lastUser.length) {
    philScore += 2
  }

  if (userScore > philScore) {
    if (rebuttalCount >= 2) {
      return { winner: 'user', reason: '鋭い反論が多かった' }
    }
    if (userMsgs.length >= 4) {
      return { winner: 'user', reason: '粘り強く論じた' }
    }
    return { winner: 'user', reason: '反論が優勢' }
  }

  if (philMsgs.length >= userMsgs.length + 2) {
    return { winner: 'philosopher', reason: '論点を整理し続けた' }
  }
  return { winner: 'philosopher', reason: '立場が一貫していた' }
}

export function getDefaultResultComment(
  reason: BattleEndReason,
  winner: BattleWinner,
): string {
  switch (reason) {
    case 'philosopher_defeat':
      return '哲学者が論点を認め、敗北を宣言した。'
    case 'user_surrender':
      return '論点を深める前に戦線を放棄した。次は最後まで粘って、相手の前提を突け。'
    case 'time_up_judge':
      return winner === 'user'
        ? 'お題への反論がより一貫していた。'
        : '哲学者の立場がより筋道立っていた。'
  }
}
