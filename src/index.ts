import type MarkdownIt from 'markdown-it'
import type { MarkdownItBeautifulLinkOptions, Capturer } from './types'
import { createSpan, createSimpleToken } from './utils'
import {
  captureGithubLink,
  captureUnocssLink,
  captureShikiLink,
  captureNpmjsLink,
  capturePnpmLink,
  captureVitejsLink
} from './capturers'

let EXCLUSION_PLUGINS_ATTR = ['markdown-magic-link']

let CAPTURERS: Record<string, Capturer> = {
  'github.com': captureGithubLink,
  'unocss.dev': captureUnocssLink,
  'shiki.style': captureShikiLink,
  'npmjs.com': captureNpmjsLink,
  'pnpm.io': capturePnpmLink,
  'vite.dev': captureVitejsLink
}

/**
 * get the processing function corresponding to the link.
 */
const getCapturer = (link: string) => {
  const groups = link.match(/^https?:\/\/(?:[^\/?#]+\.)*(?<domain>[^\/?#]+\.[^\/?#]+)/)?.groups
  if (groups) return CAPTURERS[groups['domain']]
}

function beautifulLink(md: MarkdownIt, options?: MarkdownItBeautifulLinkOptions) {
  if (options?.excludeHitAttrs) {
    EXCLUSION_PLUGINS_ATTR = EXCLUSION_PLUGINS_ATTR.concat(options.excludeHitAttrs)
  }
  if (options?.excludes) {
    options.excludes.forEach(slug => delete CAPTURERS[slug])
  }
  if (options?.capturers) {
    CAPTURERS = Object.assign({}, CAPTURERS, options.capturers(createSpan, createSimpleToken))
  }

  md.core.ruler.push('beautiful-link', state => {
    state.tokens.forEach(blockToken => {
      if (blockToken.type === 'inline' && blockToken.children) {
        let children = blockToken.children
        let startIdx = -1
        let link = ''
        let capturer = null

        for (let i = 0; i < children.length; i++) {
          const token = children[i]

          if (token.type === 'link_open') {
            const href = token.attrGet('href')
            if (!href) {
              continue
            }
            capturer = getCapturer(href)
            if (!capturer) {
              continue
            }
            const linkClass = token.attrGet('class')
            if (!linkClass || EXCLUSION_PLUGINS_ATTR.some(attr => !linkClass.includes(attr))) {
              startIdx = i
              link = href
              token.attrJoin('class', 'prose-link')
              token.attrJoin('class', options?.class ?? '')
            }
          } else if (token.type === 'link_close' && startIdx !== -1 && capturer) {
            const insertTokens = capturer(link)
            children.splice(startIdx + 1, 1)
            children.splice(startIdx + 1, 0, ...insertTokens)
            i += insertTokens.length
            startIdx = -1
          }
        }
      }
    })
  })
}

export type {
  Capturer,
  CapturersFactory,
  CreateSpan,
  CreateSimpleToken,
  MarkdownItBeautifulLinkOptions
} from './types'
export default beautifulLink
