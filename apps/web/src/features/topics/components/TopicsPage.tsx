import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  DEFAULT_BATTLE_DURATION,
  formatBattleDuration,
  type BattleDurationSeconds,
} from '@repo/common/battle'
import { getPhilosopherById, type PhilosopherId } from '@repo/common/philosophers'
import { ROUTES } from '@repo/common/routes'
import {
  TOPIC_CATEGORIES,
  getTopicsByCategory,
  type TopicCategoryId,
} from '@repo/common/topics'
import { ButtonOutline } from '#/shared/components/ButtonOutline'
import { ButtonPrimary } from '#/shared/components/ButtonPrimary'
import { CategoryChip } from '#/shared/components/CategoryChip'
import { DurationChip } from '#/shared/components/DurationChip'
import { PhilosopherBadge } from '#/shared/components/PhilosopherBadge'
import { TopicListItem } from '#/shared/components/TopicListItem'

type TopicsPageProps = {
  philosopherId: string
}

const PLACEHOLDER =
  '例：SNSで他人の生活と比べてしまうのは自然なこと？'

const DURATION_OPTIONS = [
  { seconds: 300 as BattleDurationSeconds, minutes: 5 as const, subtitle: 'スタンダード' },
  { seconds: 480 as BattleDurationSeconds, minutes: 8 as const, subtitle: 'じっくり' },
  { seconds: 600 as BattleDurationSeconds, minutes: 10 as const, subtitle: '長期戦' },
] as const

export function TopicsPage({ philosopherId }: TopicsPageProps) {
  const navigate = useNavigate()
  const philosopher = getPhilosopherById(philosopherId as PhilosopherId)
  const [topicText, setTopicText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TopicCategoryId>('relationships')
  const [duration, setDuration] = useState<BattleDurationSeconds>(DEFAULT_BATTLE_DURATION)

  if (!philosopher) return null

  const categoryTopics = getTopicsByCategory(selectedCategory)
  const resolvedTopic = topicText.trim()

  const handleStart = () => {
    if (!resolvedTopic) return
    navigate({
      to: ROUTES.chats,
      search: { philosopherId, topic: resolvedTopic, duration },
    })
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="flex h-[72px] items-center justify-between px-6 md:px-12">
        <ButtonOutline to={ROUTES.philosophers}>← 戻る</ButtonOutline>
        <h1 className="font-display text-[28px] font-black text-text-primary">お題を決めよう</h1>
        <PhilosopherBadge philosopher={philosopher} compact />
      </header>

      <main className="mx-auto flex max-w-[720px] flex-col items-center gap-5 px-6 py-6 md:px-[120px]">
        <section className="flex w-full flex-col gap-3">
          <label htmlFor="topic-input" className="text-[15px] font-semibold text-text-primary">
            自由に書く
          </label>
          <textarea
            id="topic-input"
            value={topicText}
            onChange={(e) => setTopicText(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={4}
            className="w-full resize-none rounded-2xl border border-border-default bg-bg-card p-4 text-[15px] leading-relaxed text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent-primary"
          />
        </section>

        <section className="flex w-full items-center justify-between gap-4">
          <span className="text-[15px] font-semibold text-text-primary">制限時間</span>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {DURATION_OPTIONS.map((option) => (
              <DurationChip
                key={option.seconds}
                minutes={option.minutes}
                seconds={option.seconds}
                subtitle={option.subtitle}
                selected={duration === option.seconds}
                onClick={() => setDuration(option.seconds)}
              />
            ))}
          </div>
        </section>

        <div className="flex w-full items-center gap-4">
          <div className="h-px flex-1 bg-border-default" />
          <span className="text-[13px] text-text-tertiary">お題に困ったらここから</span>
          <div className="h-px flex-1 bg-border-default" />
        </div>

        <section className="flex w-full flex-col gap-4">
          <h2 className="text-[15px] font-semibold text-text-primary">カテゴリから選ぶ</h2>
          <div className="flex flex-wrap gap-2.5">
            {TOPIC_CATEGORIES.map((category) => (
              <CategoryChip
                key={category.id}
                label={category.label}
                selected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {categoryTopics.map((topic) => (
              <TopicListItem
                key={topic.id}
                text={topic.text}
                selected={topicText === topic.text}
                onClick={() => setTopicText(topic.text)}
              />
            ))}
          </div>
        </section>

        <ButtonPrimary
          onClick={handleStart}
          className={resolvedTopic ? '' : 'pointer-events-none opacity-50'}
        >
          {formatBattleDuration(duration)}バトル開始!! →
        </ButtonPrimary>
      </main>
    </div>
  )
}
