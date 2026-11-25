/* eslint-disable @next/next/no-img-element -- Payload supplies optimized responsive image variants. */
import type { CSSProperties, ReactNode } from 'react'
import { imageAsset, type MediaRef } from '@/lib/content'

export function sources(ref: MediaRef) {
  const media = imageAsset(ref)
  if (!media?.url || (media.mimeType && !media.mimeType.startsWith('image/'))) return undefined
  const variants = Object.values(media.sizes ?? {}).filter(item => item.url && item.width)
  return { src: media.url, srcSet: variants.length ? variants.map(item => `${item.url} ${item.width}w`).join(', ') : undefined, alt: media.alt ?? '' }
}

export function Photo({ media, sizes = '(max-width: 700px) 100vw, 50vw', className, children }: {
  media: MediaRef; sizes?: string; className?: string; children?: ReactNode
}) {
  const source = sources(media)
  const asset = imageAsset(media)
  const focalPosition = asset?.focalX != null && asset.focalY != null && (asset.focalX !== 50 || asset.focalY !== 50)
    ? `${asset.focalX}% ${asset.focalY}%` : undefined
  return <div className={`photo ${className ?? ''}`} style={{ '--photo-position': focalPosition } as CSSProperties}>
    {source && <img {...source} alt={source.alt} sizes={sizes} loading="lazy" decoding="async" />}
    {children}
  </div>
}
