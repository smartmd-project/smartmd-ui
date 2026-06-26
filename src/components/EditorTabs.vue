<script setup lang="ts">
import { BookOpen, Ellipsis, Pencil, Plus, X } from 'lucide-vue-next'

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
}>()

const emit = defineEmits<{
  selectTab: [id: string]
  closeTab: [id: string]
  newTab: []
  toggleMode: []
}>()
</script>

<template>
  <div
    class="flex h-[42px] shrink-0 items-end justify-between border-b border-smart-border bg-[#071219]"
  >
    <div class="flex min-w-0 items-end overflow-hidden">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        type="button"
        class="flex h-10 max-w-[220px] shrink-0 items-center gap-2 border-b px-3.5 text-[13px] transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-smart-green/30"
        :class="
          activeTabId === tab.id
            ? 'border-smart-green bg-[#071219] font-semibold text-smart-green-bright'
            : 'border-smart-border bg-smart-surface font-medium text-[#c9d8df] hover:text-smart-text'
        "
        @click="emit('selectTab', tab.id)"
      >
        <span class="truncate">{{ tab.name }}</span>
        <span v-if="tab.dirty" class="size-1.5 shrink-0 rounded-full bg-smart-green" />
        <span
          aria-label="Close tab"
          class="grid size-4 shrink-0 place-items-center rounded text-current hover:bg-smart-panel"
          @click.stop="emit('closeTab', tab.id)"
        >
          <X :size="20" :stroke-width="1.5" />
        </span>
      </button>

      <button
        type="button"
        aria-label="New tab"
        class="grid h-10 w-[42px] shrink-0 place-items-center bg-[#071219] text-[#c9d8df] transition hover:text-smart-green-bright focus:outline-none focus:ring-2 focus:ring-inset focus:ring-smart-green/30"
        @click="emit('newTab')"
      >
        <Plus :size="20" :stroke-width="1.5" />
      </button>
    </div>

    <div class="flex shrink-0 items-center gap-3.5 px-4 pb-1.5">
      <button
        type="button"
        :aria-label="mode === 'edit' ? 'Switch to preview mode' : 'Switch to edit mode'"
        :aria-pressed="mode === 'edit'"
        class="grid h-8 min-w-8 place-items-center rounded-full px-2.5 transition focus:outline-none focus:ring-2 focus:ring-smart-green/30"
        :class="
          mode === 'edit'
            ? 'bg-[#123123] text-smart-green-bright hover:bg-[#163525]'
            : 'bg-smart-surface text-smart-muted hover:text-smart-text'
        "
        @click="emit('toggleMode')"
      >
        <Pencil v-if="mode === 'edit'" :size="20" :stroke-width="1.5" />
        <BookOpen v-else :size="20" :stroke-width="1.5" />
      </button>
      <button
        type="button"
        aria-label="More actions"
        class="text-smart-muted transition hover:text-smart-text focus:outline-none focus:ring-2 focus:ring-smart-green/30"
      >
        <Ellipsis :size="20" :stroke-width="1.5" />
      </button>
    </div>
  </div>
</template>
