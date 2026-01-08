import type { CreateSimpleToken, CreateSpan } from './types'
import Token from 'markdown-it/lib/token.mjs'

const createSimpleToken: CreateSimpleToken = (
  content: string,
  type: 'text' | 'html_inline' = 'text'
) => {
  const token = new Token(type, '', 0)
  token.content = content
  return token
}

/**
 *
 * @param attrName attribute name
 * @param attrV attribute value
 * @param text span tag content
 * @param additionalToken `token` by createSimpleToken
 * @param posi insertion position e.g. \<span>this or this\</span>
 * @returns
 */
const createSpan: CreateSpan = (
  attrName?: string,
  attrV?: string,
  text?: string,
  additionalToken?: Token,
  posi?: 'before' | 'after'
) => {
  const tokens = []
  const open = new Token('span_open', 'span', 1)
  if (attrName) open.attrSet(attrName, attrV || '')
  tokens.push(open)

  if (additionalToken && posi === 'before') tokens.push(additionalToken)

  if (text) {
    const content = new Token('text', '', 0)
    content.content = text
    tokens.push(content)
  }

  if (additionalToken && posi === 'after') tokens.push(additionalToken)

  const close = new Token('span_close', 'span', -1)
  tokens.push(close)
  return tokens
}

export { createSpan, createSimpleToken }
