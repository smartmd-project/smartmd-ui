<script setup lang="ts">
import { computed } from 'vue'
import { parseMarkdown, renderInlineMarkdown } from '@/utils/markdownPreview'

const props = defineProps<{
  content: string
  expanded?: boolean
}>()

const blocks = computed(() => parseMarkdown(props.content))
const readingMinutes = computed(() => {
  const words = props.content.trim().match(/\S+/g)?.length ?? 0
  return Math.max(1, Math.ceil(words / 220))
})
</script>

<template>
  <section
    class="flex min-w-[320px] flex-col overflow-hidden rounded-md border border-smart-border bg-[#0d1821] sm:min-w-[440px]"
    :class="expanded ? 'flex-1' : 'flex-1'"
  >
    <div
      class="flex h-9 shrink-0 items-center justify-between border-b border-smart-border bg-[#0c1b25] px-3"
    >
      <div class="flex items-center gap-2.5">
        <p class="text-[13px] font-semibold text-smart-text">Preview</p>
      </div>
      <span class="font-mono text-[11px] font-medium text-smart-muted">
        {{ readingMinutes }} min read
      </span>
    </div>

    <article
      class="markdown-preview min-h-0 flex-1 overflow-y-auto px-5 py-6 text-[#c9d8df] sm:px-[38px] sm:py-7"
    >
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
          class="my-4 text-[15px] leading-7"
          v-html="renderInlineMarkdown(block.content)"
        />
        <blockquote
          v-else-if="block.type === 'quote'"
          class="my-[18px] rounded-lg border-l-4 border-smart-green/60 bg-[#102332] px-[18px] py-[15px] text-[15px] leading-7 text-smart-code"
          v-html="renderInlineMarkdown(block.content)"
        />
        <ul v-else-if="block.type === 'unordered-list'" class="my-[18px] space-y-[9px] text-[15px]">
          <li v-for="item in block.items" :key="item" class="flex gap-3">
            <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-smart-green" />
            <span v-html="renderInlineMarkdown(item)" />
          </li>
        </ul>
        <ol
          v-else-if="block.type === 'ordered-list'"
          class="my-[18px] list-decimal space-y-[9px] pl-6 text-[15px] marker:text-smart-green-bright"
        >
          <li v-for="item in block.items" :key="item" v-html="renderInlineMarkdown(item)" />
        </ol>
        <pre
          v-else-if="block.type === 'code'"
          class="my-[18px] overflow-x-auto rounded-lg border border-smart-border bg-smart-editor p-4 font-mono text-[13px] leading-6 text-smart-code"
        ><code>{{ block.content }}</code></pre>
        <div
          v-else-if="block.type === 'table'"
          class="my-7 overflow-hidden rounded-lg border border-smart-border"
        >
          <table class="w-full border-collapse text-left text-[13px]">
            <thead class="bg-smart-panel font-mono text-[11px] text-smart-green-bright">
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
  </section>
</template>

<style scoped>
.markdown-preview :deep(strong) {
  color: #eef7f4;
  font-weight: 700;
}

.markdown-preview :deep(code) {
  border-radius: 4px;
  background: #142432;
  padding: 0.12rem 0.35rem;
  color: #67e8a8;
  font-family: 'JetBrains Mono', 'SF Mono', 'SFMono-Regular', ui-monospace, monospace;
}

.markdown-preview :deep(pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

.markdown-preview :deep(a) {
  color: #67e8a8;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.markdown-preview :deep(img) {
  display: block;
  max-width: 100%;
  margin: 1rem 0;
  border: 1px solid #20303b;
  border-radius: 8px;
}
</style>
