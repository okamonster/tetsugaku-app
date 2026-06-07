export type PhilosopherId = 'socrates' | 'plato' | 'kant' | 'nietzsche'

export type Philosopher = {
  id: PhilosopherId
  name: string
  quote: string
  description: string
  color: string
  avatarBg: string
  avatarSrc: string
  rotation: number
}

export const PHILOSOPHERS: Philosopher[] = [
  {
    id: 'socrates',
    name: 'ソクラテス',
    quote: '「本当にそれ、わかってる？」',
    description: '問答法で論点を剥がす',
    color: '#2563EB',
    avatarBg: '#DBEAFE',
    avatarSrc: '/philosophers/ソクラテス.png',
    rotation: -3,
  },
  {
    id: 'plato',
    name: 'プラトン',
    quote: '「理想の答え、あると思う？」',
    description: 'イデア論・正義を軸に論じる',
    color: '#7C3AED',
    avatarBg: '#EDE9FE',
    avatarSrc: '/philosophers/プラトン.png',
    rotation: 0,
  },
  {
    id: 'kant',
    name: 'カント',
    quote: '「それ、理性で説明できる？」',
    description: '義務論・理性を重視',
    color: '#475569',
    avatarBg: '#F1F5F9',
    avatarSrc: '/philosophers/カント.png',
    rotation: 2,
  },
  {
    id: 'nietzsche',
    name: 'ニーチェ',
    quote: '「その常識、もう古くない？」',
    description: '挑発的に価値観を問い直す',
    color: '#DC2626',
    avatarBg: '#FEE2E2',
    avatarSrc: '/philosophers/ニーチェ.png',
    rotation: -2,
  },
]

export function getPhilosopherById(id: PhilosopherId): Philosopher | undefined {
  return PHILOSOPHERS.find((p) => p.id === id)
}

export function isPhilosopherId(value: string): value is PhilosopherId {
  return PHILOSOPHERS.some((p) => p.id === value)
}
