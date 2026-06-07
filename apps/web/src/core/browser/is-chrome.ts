export function isChrome(): boolean {
  if (typeof navigator === 'undefined') return true

  const ua = navigator.userAgent
  const isChromium = /Chrome|CriOS/i.test(ua)
  const isEdge = /Edg/i.test(ua)
  const isOpera = /OPR/i.test(ua)

  return isChromium && !isEdge && !isOpera
}
