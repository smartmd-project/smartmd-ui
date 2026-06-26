export type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'quote'; content: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'code'; language: string; content: string }
  | { type: 'table'; headers: string[]; rows: string[][] }

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function renderInlineMarkdown(value: string) {
  let output = escapeHtml(value)

  output = output.replace(/`([^`]+)`/g, '<code>$1</code>')
  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  output = output.replace(/~~([^~]+)~~/g, '<del>$1</del>')
  output = output.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  output = output.replace(/!\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_match, label, href) => {
    return `<img src="${href}" alt="${label}" loading="lazy" />`
  })
  output = output.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_match, label, href) => {
    return `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`
  })

  return output
}

function isTableDivider(line: string) {
  return /^\s*\|?[\s:-]+\|[\s|:-]*\|?\s*$/.test(line)
}

function parseTableRow(line: string) {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim())
}

export function parseMarkdown(content: string): MarkdownBlock[] {
  const lines = content.split('\n')
  const blocks: MarkdownBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index] ?? ''

    if (!line.trim()) {
      index += 1
      continue
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim()
      const codeLines: string[] = []
      index += 1

      while (index < lines.length && !(lines[index] ?? '').startsWith('```')) {
        codeLines.push(lines[index] ?? '')
        index += 1
      }

      blocks.push({ type: 'code', language, content: codeLines.join('\n') })
      index += 1
      continue
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line)
    if (heading) {
      blocks.push({
        type: 'heading',
        level: heading[1]?.length as 1 | 2 | 3,
        content: heading[2] ?? '',
      })
      index += 1
      continue
    }

    if (line.startsWith('> ')) {
      blocks.push({ type: 'quote', content: line.slice(2) })
      index += 1
      continue
    }

    if (/^-\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^-\s+/.test(lines[index] ?? '')) {
        items.push((lines[index] ?? '').replace(/^-\s+/, ''))
        index += 1
      }
      blocks.push({ type: 'unordered-list', items })
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^\d+\.\s+/.test(lines[index] ?? '')) {
        items.push((lines[index] ?? '').replace(/^\d+\.\s+/, ''))
        index += 1
      }
      blocks.push({ type: 'ordered-list', items })
      continue
    }

    if (line.includes('|') && isTableDivider(lines[index + 1] ?? '')) {
      const headers = parseTableRow(line)
      const rows: string[][] = []
      index += 2

      while (index < lines.length && (lines[index] ?? '').includes('|')) {
        rows.push(parseTableRow(lines[index] ?? ''))
        index += 1
      }

      blocks.push({ type: 'table', headers, rows })
      continue
    }

    const paragraphLines = [line]
    index += 1

    while (index < lines.length && (lines[index] ?? '').trim()) {
      const nextLine = lines[index] ?? ''
      if (/^(#{1,3})\s+|^>\s+|^-\s+|^\d+\.\s+|^```/.test(nextLine)) {
        break
      }
      paragraphLines.push(nextLine)
      index += 1
    }

    blocks.push({ type: 'paragraph', content: paragraphLines.join(' ') })
  }

  return blocks
}
