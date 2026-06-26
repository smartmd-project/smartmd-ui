<script setup lang="ts">
import { computed, ref } from 'vue'

import { useMarkdownActions, type MarkdownAction } from '@/composables/useMarkdownActions'

const content = defineModel<string>({ required: true })
withDefaults(
  defineProps<{
    expanded?: boolean
  }>(),
  {
    expanded: false,
  },
)
const textarea = ref<HTMLTextAreaElement | null>(null)
const cursorLine = ref(1)
const cursorColumn = ref(1)

const lineCount = computed(() => Math.max(content.value.split('\n').length, 25))
const { applyMarkdownAction } = useMarkdownActions(content, textarea)

function updateCursor() {
  const position = textarea.value?.selectionStart ?? 0
  const beforeCursor = content.value.slice(0, position)
  const lines = beforeCursor.split('\n')
  cursorLine.value = lines.length
  cursorColumn.value = (lines.at(-1)?.length ?? 0) + 1
}

async function applyAction(action: MarkdownAction) {
  await applyMarkdownAction(action)
  updateCursor()
}

defineExpose({ applyAction })
</script>

<template>
  <section
    class="flex min-w-[320px] flex-col overflow-hidden rounded-md border border-smart-border bg-smart-editor sm:min-w-[440px]"
    :class="expanded ? 'flex-1' : 'w-[590px] shrink-0'"
  >
    <div
      class="flex h-9 shrink-0 items-center justify-between border-b border-smart-border bg-[#0c1b25] px-3"
    >
      <p class="text-[13px] font-semibold text-smart-text">Editor</p>
      <div class="flex items-center gap-2 font-mono">
        <span class="text-[11px] font-medium text-smart-muted">
          {{ content.trim().match(/\S+/g)?.length ?? 0 }} words
        </span>
      </div>
    </div>

    <div class="relative flex min-h-0 flex-1 overflow-hidden">
      <div
        class="w-[50px] shrink-0 overflow-hidden border-r border-smart-border bg-[#081720] py-3 pr-[18px] text-right font-mono text-[13px] leading-6 text-[#516674]"
        aria-hidden="true"
      >
        <div v-for="line in lineCount" :key="line" class="pr-3">
          {{ line }}
        </div>
      </div>
      <textarea
        ref="textarea"
        v-model="content"
        aria-label="Markdown editor"
        spellcheck="false"
        class="h-full min-h-[540px] flex-1 resize-none border-0 bg-smart-editor px-5 py-[18px] font-mono text-sm leading-6 text-smart-code outline-none selection:bg-smart-green/30"
        @click="updateCursor"
        @input="updateCursor"
        @keyup="updateCursor"
      />
    </div>
  </section>
</template>
