<script setup lang="ts">
import { BookOpen, Check, Cloud, Ellipsis, Pencil, Plus, Share2, X } from 'lucide-vue-next'

interface EditorTab {
  id: string
  name: string
  dirty?: boolean
}

type EditorMode = 'edit' | 'preview'

defineProps<{
  tabs: EditorTab[]
  activeTabId: string
  mode: EditorMode
  saveLabel: string
}>()

const emit = defineEmits<{
  selectTab: [id: string]
  closeTab: [id: string]
  newTab: []
  toggleMode: []
  share: []
  save: []
}>()
</script>

<template>
  <div
    class="flex h-[38px] shrink-0 items-end justify-between border-b border-smart-border bg-smart-editor"
  >
    <div class="flex min-w-0 items-end overflow-hidden">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        type="button"
        class="flex h-9 max-w-[190px] shrink-0 items-center gap-1.5 border-b px-2.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-smart-green/25"
        :class="
          activeTabId === tab.id
            ? 'border-smart-green bg-smart-editor font-medium text-smart-green'
            : 'border-transparent bg-smart-surface font-medium text-smart-muted hover:text-smart-text'
        "
        @click="emit('selectTab', tab.id)"
      >
        <span class="truncate">{{ tab.name }}</span>
        <span v-if="tab.dirty" class="size-1.5 shrink-0 rounded-full bg-smart-green" />
        <span
          aria-label="Close tab"
          class="grid size-3.5 shrink-0 place-items-center rounded text-current hover:bg-smart-panel"
          @click.stop="emit('closeTab', tab.id)"
        >
          <X :size="18" :stroke-width="1.5" />
        </span>
      </button>

      <button
        type="button"
        aria-label="New tab"
        class="grid h-9 w-[38px] shrink-0 place-items-center bg-smart-editor text-smart-muted transition hover:text-smart-green focus:outline-none focus:ring-2 focus:ring-inset focus:ring-smart-green/25"
        @click="emit('newTab')"
      >
        <Plus :size="18" :stroke-width="1.5" />
      </button>
    </div>

    <div class="flex shrink-0 items-center gap-1.5 px-3.5 pb-1">
      <button
        type="button"
        :aria-label="mode === 'edit' ? 'Switch to preview mode' : 'Switch to edit mode'"
        :aria-pressed="mode === 'edit'"
        class="grid h-7 min-w-7 place-items-center rounded-full px-2 transition focus:outline-none focus:ring-2 focus:ring-smart-green/25"
        :class="
          mode === 'edit'
            ? 'bg-smart-panel text-smart-green hover:bg-smart-panel-soft'
            : 'bg-smart-surface text-smart-muted hover:text-smart-text'
        "
        @click="emit('toggleMode')"
      >
        <Pencil v-if="mode === 'edit'" :size="18" :stroke-width="1.5" />
        <BookOpen v-else :size="18" :stroke-width="1.5" />
      </button>
      <button
        type="button"
        class="hidden h-7 items-center gap-1.5 rounded-md bg-transparent px-2 text-xs font-medium text-smart-muted transition hover:bg-smart-panel hover:text-smart-text focus:outline-none focus:ring-2 focus:ring-smart-green/25 md:inline-flex"
        @click="emit('share')"
      >
        <Share2 :size="16" :stroke-width="1.6" />
        Share
      </button>
      <button
        type="button"
        class="inline-flex h-7 min-w-20 items-center justify-center gap-1.5 rounded-md bg-transparent px-2 text-xs font-medium text-smart-text transition hover:bg-smart-panel hover:text-smart-green focus:outline-none focus-visible:ring-2 focus-visible:ring-smart-green/25"
        @click="emit('save')"
      >
        <Check v-if="saveLabel === 'Saved'" :size="16" :stroke-width="1.8" />
        <Cloud v-else :size="16" :stroke-width="1.6" />
        {{ saveLabel }}
      </button>
      <button
        type="button"
        aria-label="More actions"
        class="text-smart-muted transition hover:text-smart-text focus:outline-none focus:ring-2 focus:ring-smart-green/25"
      >
        <Ellipsis :size="18" :stroke-width="1.5" />
      </button>
    </div>
  </div>
</template>
