<script setup lang="ts">
import {
  Bold,
  Code,
  Columns2,
  Eye,
  Heading1,
  Heading2,
  Image,
  Italic,
  Link,
  List,
  Quote,
  SquarePen,
  Table2,
} from 'lucide-vue-next'

import type { MarkdownAction } from '@/composables/useMarkdownActions'

export type EditorViewMode = 'write' | 'split' | 'preview'

defineProps<{
  viewMode: EditorViewMode
}>()

const emit = defineEmits<{
  action: [action: MarkdownAction]
  'update:viewMode': [mode: EditorViewMode]
}>()

const toolGroups: Array<{
  label: string
  tools: Array<{
    label: string
    title: string
    icon: typeof Bold
    action: MarkdownAction
    active?: boolean
  }>
}> = [
  {
    label: 'Text',
    tools: [
      { label: 'H1', title: 'Heading 1', icon: Heading1, action: 'h1' },
      { label: 'H2', title: 'Heading 2', icon: Heading2, action: 'h2' },
      { label: 'Bold', title: 'Bold', icon: Bold, action: 'bold' },
      { label: 'Italic', title: 'Italic', icon: Italic, action: 'italic' },
    ],
  },
  {
    label: 'Insert',
    tools: [
      { label: 'Link', title: 'Link', icon: Link, action: 'link' },
      { label: 'Quote', title: 'Quote', icon: Quote, action: 'quote' },
      { label: 'Code', title: 'Code block', icon: Code, action: 'codeBlock' },
    ],
  },
  {
    label: 'Block',
    tools: [
      { label: 'List', title: 'Bullet list', icon: List, action: 'bulletList' },
      { label: 'Table', title: 'Insert table', icon: Table2, action: 'table' },
      { label: 'Image', title: 'Insert image', icon: Image, action: 'image' },
    ],
  },
]

const views: Array<{
  label: string
  mode: EditorViewMode
  icon: typeof SquarePen
}> = [
  { label: 'Write', mode: 'write', icon: SquarePen },
  { label: 'Split', mode: 'split', icon: Columns2 },
  { label: 'Preview', mode: 'preview', icon: Eye },
]
</script>

<template>
  <div
    class="relative z-20 flex h-11 shrink-0 items-center justify-between gap-3 overflow-x-auto border-b border-smart-border bg-smart-surface px-3"
  >
    <div class="flex items-center gap-1.5">
      <template v-for="(group, groupIndex) in toolGroups" :key="group.label">
        <div class="flex items-center gap-1">
          <button
            v-for="tool in group.tools"
            :key="tool.title"
            type="button"
            :aria-label="tool.title"
            :title="tool.title"
            class="inline-flex size-8 shrink-0 items-center justify-center rounded-md border text-xs font-semibold transition active:scale-95"
            :class="
              tool.active
                ? 'border-smart-green bg-smart-green text-smart-bg'
                : 'border-[#213543] bg-smart-panel text-smart-text hover:border-smart-green/50 hover:bg-[#163525] hover:text-smart-green-bright'
            "
            @click="emit('action', tool.action)"
          >
            <component
              :is="tool.icon"
              :size="20"
              :stroke-width="1.5"
              :class="tool.active ? '' : 'text-smart-muted'"
            />
          </button>
        </div>
        <span v-if="groupIndex < toolGroups.length - 1" class="h-5 w-px shrink-0 bg-smart-border" />
      </template>
    </div>

    <div
      class="flex shrink-0 items-center gap-1 rounded-md border border-[#213543] bg-[#071219] p-0.5"
    >
      <button
        v-for="view in views"
        :key="view.mode"
        type="button"
        class="flex h-7 items-center gap-1.5 rounded px-2 text-xs font-semibold transition"
        :class="
          viewMode === view.mode
            ? 'bg-smart-green text-smart-bg'
            : 'text-smart-muted hover:bg-smart-panel hover:text-smart-text'
        "
        @click="emit('update:viewMode', view.mode)"
      >
        <component
          :is="view.icon"
          :size="20"
          :stroke-width="1.5"
          :class="viewMode === view.mode ? '' : 'text-smart-muted'"
        />
        {{ view.label }}
      </button>
    </div>
  </div>
</template>
