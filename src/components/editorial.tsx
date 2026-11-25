import type { ReactNode } from 'react'
import { Photo } from './media'
import { type EditorialBlock } from '@/lib/content'
import { safeHref, videoEmbed } from '@/lib/urls'

type Node = {
  type: string; text?: string; format?: string | number; tag?: string; listType?: string
  fields?: { url?: string }; url?: string; children?: Node[]
}

function renderNode(node: Node, key: number): ReactNode {
  const children = node.children?.map(renderNode)
  switch (node.type) {
    case 'text': {
      const format = typeof node.format === 'number' ? node.format : 0
      let text: ReactNode = node.text
      if (format & 1) text = <strong>{text}</strong>
      if (format & 2) text = <em>{text}</em>
      if (format & 4) text = <s>{text}</s>
      if (format & 8) text = <u>{text}</u>
      if (format & 16) text = <code>{text}</code>
      return <span key={key}>{text}</span>
    }
    case 'paragraph': return <p key={key}>{children}</p>
    case 'heading': {
      const Tag = node.tag === 'h2' || node.tag === 'h4' ? node.tag : 'h3'
      return <Tag key={key}>{children}</Tag>
    }
    case 'list': return node.listType === 'number' ? <ol key={key}>{children}</ol> : <ul key={key}>{children}</ul>
    case 'listitem': return <li key={key}>{children}</li>
    case 'quote': return <blockquote key={key}>{children}</blockquote>
    case 'linebreak': return <br key={key} />
    case 'link':
    case 'autolink': {
      const href = safeHref(node.fields?.url ?? node.url)
      return href ? <a key={key} href={href}>{children}</a> : <span key={key}>{children}</span>
    }
    default: return <span key={key}>{children}</span>
  }
}

export function RichCopy({ state }: { state?: { root: { children: Node[] } } | null }) {
  return state?.root.children.length ? <div className="rich-copy">{state.root.children.map(renderNode)}</div> : null
}

export function Editorial({ blocks }: { blocks: EditorialBlock[] }) {
  return <div className="editorial-blocks">{blocks.map((block, index) => {
    switch (block.blockType) {
      case 'richText': return <RichCopy key={index} state={block.body} />
      case 'singleImage':
      case 'fullWidthImage': return <figure key={index} className={block.blockType === 'fullWidthImage' ? 'article-wide' : undefined}>
        <Photo media={block.image} sizes="(max-width: 800px) 100vw, 80vw" />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
      case 'twoColumnImages':
      case 'imageGallery': {
        const images = block.blockType === 'twoColumnImages' ? [block.left, block.right] : block.images ?? []
        return <figure key={index} className="article-wide"><div className="article-gallery">{images.map((media, position) => <Photo key={position} media={media} />)}</div>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      }
      case 'quote': return <blockquote key={index}><p>{block.quote}</p>{block.attribution && <cite>{block.attribution}</cite>}</blockquote>
      case 'videoEmbed': {
        const url = videoEmbed(block.url)
        return url && <iframe key={index} className="article-video" src={url} title={block.title || 'Video'} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      }
      case 'divider': return <hr key={index} />
      case 'spacer': return <div key={index} className={block.size === 'large' ? 'spacer-large' : 'spacer-small'} aria-hidden="true" />
    }
  })}</div>
}
