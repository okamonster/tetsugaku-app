type BrandingImageProps = {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export function BrandingImage({
  src,
  alt,
  className = '',
  width,
  height,
}: BrandingImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      decoding="async"
    />
  )
}
