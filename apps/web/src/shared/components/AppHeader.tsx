import { BrandingImage } from '#/shared/components/BrandingImage'

type AppHeaderProps = {
  showChromeNote?: boolean
}

export function AppHeader({ showChromeNote = true }: AppHeaderProps) {
  return (
    <header className="flex h-[72px] items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-2.5 py-1">
        <BrandingImage
          src="/branding/logo-mark.png"
          alt=""
          width={1024}
          height={1024}
          className="h-[52px] w-[52px] shrink-0"
        />
        <BrandingImage
          src="/branding/wordmark.png"
          alt="哲学レスバ!!"
          width={1632}
          height={656}
          className="h-[52px] w-auto max-w-[min(249px,50vw)]"
        />
      </div>
      {showChromeNote ? (
        <p className="text-xs font-medium text-text-tertiary">Chrome 専用</p>
      ) : null}
    </header>
  )
}
