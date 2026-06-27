<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import { parseMarkdown, renderInlineMarkdown } from '@/utils/markdownPreview'

interface EditorDocument {
  id: string
  content: string
}

const props = defineProps<{
  document: EditorDocument
  mode: 'edit' | 'preview'
}>()

const emit = defineEmits<{
  updateContent: [value: string]
}>()

const editorElement = ref<HTMLElement | null>(null)
const blocks = computed(() => parseMarkdown(props.document.content))
const highlightedMarkdown = computed(() => renderHighlightedMarkdown(props.document.content))

watch(
  () => [props.document.id, props.mode] as const,
  async () => {
    if (props.mode !== 'edit') {
      return
    }

    await nextTick()
    renderEditorContent()
  },
  { immediate: true },
)

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function renderInlineHighlight(value: string) {
  return value
    .replace(/`([^`]+)`/g, '<span class="md-inline-code">`$1`</span>')
    .replace(/\*\*([^*]+)\*\*/g, '<span class="md-strong">**$1**</span>')
    .replace(/\*([^*]+)\*/g, '<span class="md-emphasis">*$1*</span>')
    .replace(
      /(\[[^\]]+\])(\([^)]+\))/g,
      '<span class="md-link-label">$1</span><span class="md-link-url">$2</span>',
    )
}

function renderHighlightedMarkdown(content: string) {
  return content
    .split('\n')
    .map((line) => {
      const escapedLine = escapeHtml(line)

      if (escapedLine.startsWith('```')) {
        return `<span class="md-fence">${escapedLine}</span>`
      }

      const heading = /^(#{1,6})(\s.*)?$/.exec(escapedLine)

      if (heading) {
        return `<span class="md-heading-marker">${heading[1]}</span><span class="md-heading-text">${heading[2] ?? ''}</span>`
      }

      if (/^>\s?/.test(escapedLine)) {
        return escapedLine.replace(
          /^(>\s?)(.*)$/,
          '<span class="md-quote-marker">$1</span><span class="md-quote-text">$2</span>',
        )
      }

      if (/^(\s*)([-*+])(\s+)/.test(escapedLine)) {
        return renderInlineHighlight(
          escapedLine.replace(/^(\s*)([-*+])(\s+)/, '$1<span class="md-list-marker">$2</span>$3'),
        )
      }

      if (/^(\s*)(\d+\.)(\s+)/.test(escapedLine)) {
        return renderInlineHighlight(
          escapedLine.replace(/^(\s*)(\d+\.)(\s+)/, '$1<span class="md-list-marker">$2</span>$3'),
        )
      }

      return renderInlineHighlight(escapedLine)
    })
    .join('\n')
}

function renderEditorContent() {
  if (!editorElement.value) {
    return
  }

  editorElement.value.innerHTML = highlightedMarkdown.value
}

function normalizeEditorText(value: string) {
  return value.replace(/\u00a0/g, ' ').replace(/\n$/, '')
}

function handleEditorInput(event: Event) {
  const target = event.currentTarget as HTMLElement
  emit('updateContent', normalizeEditorText(target.innerText))
}

function handleEditorBlur() {
  renderEditorContent()
}
</script>

<template>
  <article
    class="editor-pane min-h-0 flex-1 overflow-y-auto bg-smart-editor px-5 py-8 sm:px-8 lg:px-[34px]"
  >
    <div class="editor-page mx-auto flex w-full max-w-[840px] flex-col gap-6 bg-smart-editor">
      <div
        v-if="mode === 'edit'"
        ref="editorElement"
        class="markdown-edit-input min-h-[560px] pb-10 font-mono text-[16px] leading-[1.75] outline-none"
        contenteditable="true"
        role="textbox"
        aria-label="Markdown document content"
        data-placeholder="Start writing Markdown..."
        spellcheck="false"
        @input="handleEditorInput"
        @blur="handleEditorBlur"
      />

      <article v-else class="markdown-preview pb-12 text-base leading-[1.75] text-smart-text">
        <template v-for="(block, index) in blocks" :key="index">
          <h1
            v-if="block.type === 'heading' && block.level === 1"
            class="mb-4 mt-7 text-[27px] font-bold leading-tight text-smart-text first:mt-0"
            v-html="renderInlineMarkdown(block.content)"
          />
          <h2
            v-else-if="block.type === 'heading' && block.level === 2"
            class="mb-[14px] mt-[18px] text-[21px] font-bold text-smart-text"
            v-html="renderInlineMarkdown(block.content)"
          />
          <h3
            v-else-if="block.type === 'heading'"
            class="mb-3 mt-6 text-lg font-bold text-smart-text"
            v-html="renderInlineMarkdown(block.content)"
          />
          <p
            v-else-if="block.type === 'paragraph'"
            class="my-4 text-base leading-[1.75]"
            v-html="renderInlineMarkdown(block.content)"
          />
          <blockquote
            v-else-if="block.type === 'quote'"
            class="my-[18px] rounded border-l-4 border-smart-green/70 bg-smart-surface px-[18px] py-[15px] text-base leading-[1.75] text-smart-muted"
            v-html="renderInlineMarkdown(block.content)"
          />
          <ul
            v-else-if="block.type === 'unordered-list'"
            class="my-[18px] space-y-2.5 text-base leading-[1.75]"
          >
            <li v-for="item in block.items" :key="item" class="flex gap-3">
              <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-smart-green" />
              <span v-html="renderInlineMarkdown(item)" />
            </li>
          </ul>
          <ol
            v-else-if="block.type === 'ordered-list'"
            class="my-[18px] list-decimal space-y-2.5 pl-6 text-base leading-[1.75] marker:text-smart-green-bright"
          >
            <li v-for="item in block.items" :key="item" v-html="renderInlineMarkdown(item)" />
          </ol>
          <pre
            v-else-if="block.type === 'code'"
            class="my-[18px] overflow-x-auto rounded-lg border border-smart-border bg-smart-surface p-4 font-mono text-[13px] leading-6 text-smart-code"
          ><code>{{ block.content }}</code></pre>
          <div
            v-else-if="block.type === 'table'"
            class="my-7 overflow-hidden rounded-lg border border-smart-border"
          >
            <table class="w-full border-collapse text-left text-[13px]">
              <thead class="bg-smart-panel font-mono text-[11px] text-smart-green">
                <tr>
                  <th
                    v-for="header in block.headers"
                    :key="header"
                    class="border-r border-smart-border px-4 py-3 last:border-r-0"
                    v-html="renderInlineMarkdown(header)"
                  />
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rowIndex) in block.rows"
                  :key="rowIndex"
                  class="border-t border-smart-border"
                >
                  <td
                    v-for="(cell, cellIndex) in row"
                    :key="cellIndex"
                    class="border-r border-smart-border px-4 py-3 last:border-r-0"
                    v-html="renderInlineMarkdown(cell)"
                  />
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <p v-if="blocks.length === 0" class="font-mono text-sm text-smart-muted">
          Start writing to see the preview.
        </p>
      </article>
    </div>
  </article>
</template>

<style scoped>
.markdown-edit-input {
  overflow-wrap: break-word;
  white-space: pre-wrap;
  word-break: normal;
  font-variant-ligatures: none;
  letter-spacing: 0;
  margin: 0;
  padding: 0 0 2.5rem;
  tab-size: 2;
  color: #111827;
  caret-color: #00b781;
}

.markdown-edit-input:empty::before {
  content: attr(data-placeholder);
  color: #8a8f98;
}

.markdown-edit-input::selection {
  background: rgba(0, 183, 129, 0.16);
}

.markdown-edit-input :deep(.md-heading-marker) {
  color: #00b781;
}

.markdown-edit-input :deep(.md-heading-text) {
  color: #111827;
}

.markdown-edit-input :deep(.md-quote-marker),
.markdown-edit-input :deep(.md-list-marker) {
  color: #00b781;
}

.markdown-edit-input :deep(.md-quote-text) {
  color: #4b5563;
}

.markdown-edit-input :deep(.md-fence),
.markdown-edit-input :deep(.md-inline-code) {
  color: #00a876;
}

.markdown-edit-input :deep(.md-strong) {
  color: #111827;
}

.markdown-edit-input :deep(.md-emphasis) {
  color: #374151;
}

.markdown-edit-input :deep(.md-link-label) {
  color: #00a876;
}

.markdown-edit-input :deep(.md-link-url) {
  color: #8a8f98;
}

.markdown-preview :deep(strong) {
  color: #111827;
  font-weight: 700;
}

.markdown-preview :deep(code) {
  border-radius: 4px;
  background: #f4f4f5;
  padding: 0.12rem 0.35rem;
  color: #047857;
  font-family: 'JetBrains Mono', 'SF Mono', 'SFMono-Regular', ui-monospace, monospace;
}

.markdown-preview :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

.markdown-preview :deep(a) {
  color: #047857;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.markdown-preview :deep(img) {
  display: block;
  max-width: 100%;
  margin: 1rem 0;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
}
</style>
