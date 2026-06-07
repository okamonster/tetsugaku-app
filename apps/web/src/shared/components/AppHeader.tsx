import { BrandingImage } from '#/shared/components/BrandingImage'
import { LogoMark } from '#/shared/components/LogoMark'

type AppHeaderProps = {
  showChromeNote?: boolean
}

export function AppHeader({ showChromeNote = true }: AppHeaderProps) {
  return (
    <header className="flex h-[72px] items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-2.5 py-1">
        <LogoMark size={52} />
        <BrandingImage
          src="/branding/wordmark.png"
          alt="哲学レスバ!!"
          width={518}
          height={204}
          className="h-[52px] w-auto max-w-[min(249px,50vw)]"
        />
      </div>
      {showChromeNote ? (
        <p className="text-xs font-medium text-text-tertiary">Chrome 専用</p>
      ) : null}
    </header>
  )
}
