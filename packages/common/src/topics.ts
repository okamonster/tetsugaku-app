export type TopicCategoryId =
  | 'relationships'
  | 'career'
  | 'sns'
  | 'self'
  | 'love'

export type TopicCategory = {
  id: TopicCategoryId
  label: string
}

export type Topic = {
  id: string
  categoryId: TopicCategoryId
  text: string
}

export const TOPIC_CATEGORIES: TopicCategory[] = [
  { id: 'relationships', label: '人間関係' },
  { id: 'career', label: '仕事・キャリア' },
  { id: 'sns', label: 'SNS・現代生活' },
  { id: 'self', label: '自分自身' },
  { id: 'love', label: '恋愛・性' },
]

export const TOPICS: Topic[] = [
  {
    id: 'friend-distance',
    categoryId: 'relationships',
    text: '友人との距離感、どこまで許容すべき？',
  },
  {
    id: 'line-read',
    categoryId: 'relationships',
    text: 'LINEの既読スルーは許される？',
  },
  {
    id: 'parent-values',
    categoryId: 'relationships',
    text: '親との価値観の違い、どう向き合う？',
  },
  {
    id: 'sns-compare',
    categoryId: 'sns',
    text: 'SNSで他人と比べること',
  },
  {
    id: 'sns-natural',
    categoryId: 'sns',
    text: 'SNSで他人の生活と比べてしまうのは自然なこと？',
  },
  {
    id: 'work-meaning',
    categoryId: 'career',
    text: '仕事に意味を見出すのは自分の責任？',
  },
  {
    id: 'self-acceptance',
    categoryId: 'self',
    text: '完璧じゃない自分を許すのは妥協？',
  },
  {
    id: 'love-honesty',
    categoryId: 'love',
    text: '恋愛では正直さと優しさ、どっちが先？',
  },
]

export function getTopicsByCategory(categoryId: TopicCategoryId): Topic[] {
  return TOPICS.filter((topic) => topic.categoryId === categoryId)
}
