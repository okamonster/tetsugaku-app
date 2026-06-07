import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { PHILOSOPHERS } from '@repo/common/philosophers'
import { ROUTES } from '@repo/common/routes'
import { BrandingImage } from '#/shared/components/BrandingImage'
import { ButtonPrimary } from '#/shared/components/ButtonPrimary'
import { GrungeOverlay } from '#/shared/components/GrungeOverlay'
import { PageBackHeader } from '#/shared/components/PageBackHeader'
import { PhilosopherCard } from '#/shared/components/PhilosopherCard'

export function PhilosophersPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleNext = () => {
    if (!selectedId) return
    navigate({
      to: ROUTES.topics,
      search: { philosopherId: selectedId },
    })
  }

  const [row1, row2] = [PHILOSOPHERS.slice(0, 2), PHILOSOPHERS.slice(2, 4)]

  return (
    <div className="relative min-h-screen bg-bg-hero">
      <GrungeOverlay />
      <PageBackHeader backTo={ROUTES.home} />

      <main className="mx-auto flex max-w-[1152px] flex-col items-center gap-3 px-6 py-3 md:px-16">
        <BrandingImage
          src="/branding/select-title.png"
          alt="対戦相手を選べ!!"
          width={1792}
          height={592}
          className="h-auto w-full max-w-[560px] -rotate-1"
        />


        <p className="max-w-[600px] text-center text-sm font-bold text-text-primary">
          4人の哲学者から、今日の対戦相手を選べ
        </p>

        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap justify-center gap-4">
            {row1.map((philosopher) => (
              <PhilosopherCard
                key={philosopher.id}
                philosopher={philosopher}
                selected={selectedId === philosopher.id}
                onSelect={() => setSelectedId(philosopher.id)}
              />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {row2.map((philosopher) => (
              <PhilosopherCard
                key={philosopher.id}
                philosopher={philosopher}
                selected={selectedId === philosopher.id}
                onSelect={() => setSelectedId(philosopher.id)}
              />
            ))}
          </div>
        </div>

        <ButtonPrimary
          onClick={handleNext}
          className={selectedId ? '' : 'pointer-events-none opacity-50'}
        >
          この相手とバトル!! →
        </ButtonPrimary>
      </main>
    </div>
  )
}
