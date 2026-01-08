import Token from 'markdown-it/lib/token.mjs'

type Capturer = (link: string) => Token[]

type CapturersFactory = (
  createSpan: CreateSpan,
  createSimpleToken: CreateSimpleToken
) => Record<string, Capturer>

type CreateSpan = (
  attrName?: string,
  attrV?: string,
  text?: string,
  additionalToken?: Token,
  posi?: 'before' | 'after'
) => Token[]

type CreateSimpleToken = (content: string, type: 'text' | 'html_inline') => Token

interface MarkdownItBeautifulLinkOptions {
  /**
   * provide processing rules for different urls.
   * @see https://github.com/naiheyoung/markdown-it-beautiful-link/blob/main/src/capturers.ts
   */
  capturers: CapturersFactory

  /**
   * links that do not need to be processed.
   */
  excludes: Array<string>

  /**
   * exclude links whose `class` attribute contains a specified value.
   *
   * This plugin will not process the data after other plugins have finished processing it.<br/>
   * Therefore, some identification information from other plugins is needed.
   */
  excludeHitAttrs: Array<string>

  /**
   * link `class`
   */
  class: string
}

export {
  Capturer,
  CapturersFactory,
  CreateSpan,
  CreateSimpleToken,
  MarkdownItBeautifulLinkOptions
}
