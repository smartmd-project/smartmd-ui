import type { Ref } from 'vue'
import { nextTick } from 'vue'

export type MarkdownAction =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bulletList'
  | 'numberedList'
  | 'quote'
  | 'inlineCode'
  | 'codeBlock'
  | 'link'
  | 'table'
  | 'image'

interface Replacement {
  text: string
  selectionStart: number
  selectionEnd: number
}

function wrapSelection(
  selected: string,
  prefix: string,
  suffix: string,
  placeholder: string,
): Replacement {
  const value = selected || placeholder

  return {
    text: `${prefix}${value}${suffix}`,
    selectionStart: prefix.length,
    selectionEnd: prefix.length + value.length,
  }
}

function prefixLines(selected: string, prefix: string, placeholder: string): Replacement {
  const value = selected || placeholder
  const text = value
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n')

  return {
    text,
    selectionStart: prefix.length,
    selectionEnd: text.length,
  }
}

function createReplacement(action: MarkdownAction, selected: string): Replacement {
  switch (action) {
    case 'bold':
      return wrapSelection(selected, '**', '**', 'bold text')
    case 'italic':
      return wrapSelection(selected, '*', '*', 'italic text')
    case 'strikethrough':
      return wrapSelection(selected, '~~', '~~', 'strikethrough text')
    case 'h1':
      return prefixLines(selected, '# ', 'Heading 1')
    case 'h2':
      return prefixLines(selected, '## ', 'Heading 2')
    case 'h3':
      return prefixLines(selected, '### ', 'Heading 3')
    case 'bulletList':
      return prefixLines(selected, '- ', 'List item')
    case 'numberedList': {
      const value = selected || 'List item'
      const text = value
        .split('\n')
        .map((line, index) => `${index + 1}. ${line}`)
        .join('\n')

      return { text, selectionStart: 3, selectionEnd: text.length }
    }
    case 'quote':
      return prefixLines(selected, '> ', 'Quote')
    case 'inlineCode':
      return wrapSelection(selected, '`', '`', 'code')
    case 'codeBlock':
      return wrapSelection(selected, '```ts\n', '\n```', 'code')
    case 'link': {
      const label = selected || 'link text'
      return {
        text: `[${label}](https://example.com)`,
        selectionStart: 1,
        selectionEnd: label.length + 1,
      }
    }
    case 'table':
      return {
        text: '| Metric | Value | Note |\n| --- | --- | --- |\n| BP | 124/78 | seated |',
        selectionStart: 2,
        selectionEnd: 8,
      }
    case 'image': {
      const label = selected || 'clinical diagram'
      return {
        text: `![${label}](https://example.com/image.png)`,
        selectionStart: 2,
        selectionEnd: label.length + 2,
      }
    }
  }
}

export function useMarkdownActions(
  content: Ref<string>,
  textarea: Ref<HTMLTextAreaElement | null>,
) {
  async function applyMarkdownAction(action: MarkdownAction) {
    const element = textarea.value

    if (!element) {
      return
    }

    const start = element.selectionStart
    const end = element.selectionEnd
    const selected = content.value.slice(start, end)
    const replacement = createReplacement(action, selected)

    content.value = content.value.slice(0, start) + replacement.text + content.value.slice(end)

    await nextTick()
    element.focus()
    element.setSelectionRange(start + replacement.selectionStart, start + replacement.selectionEnd)
  }

  return { applyMarkdownAction }
}
