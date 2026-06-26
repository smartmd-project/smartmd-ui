<script setup lang="ts">
import { Ellipsis, FileText, FolderOpen, Plus, Search } from 'lucide-vue-next'

const recentFiles = [
  { name: 'product-spec.md', time: 'Edited 18s ago', active: true, menu: true },
  { name: 'api-notes.md', time: 'Updated yesterday' },
  { name: 'release-checklist.md', time: '2,104 words', highlighted: true, menu: true },
]

const spaces = [
  { name: 'main', count: 12, active: true },
  { name: 'docs', count: 8 },
  { name: 'archive', count: 4 },
]
</script>

<template>
  <aside
    class="hidden w-[282px] shrink-0 overflow-hidden rounded-[10px] border border-smart-border bg-smart-surface xl:flex xl:flex-col"
  >
    <div class="shrink-0 space-y-3 border-b border-smart-border bg-[#0c1b25] p-3.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-sm font-bold">
          <FolderOpen :size="20" class="text-smart-green-bright" :stroke-width="1.5" />
          Files
        </div>
        <button
          type="button"
          aria-label="New markdown file"
          class="inline-flex h-[34px] items-center gap-2 rounded-lg border border-smart-green bg-smart-green px-[11px] text-xs font-bold text-smart-bg"
        >
          <Plus :size="20" :stroke-width="1.5" />
          New
        </button>
      </div>
      <label
        class="flex h-[34px] items-center gap-2 rounded-lg border border-smart-border bg-smart-editor px-[11px]"
      >
        <Search :size="20" class="text-smart-muted" :stroke-width="1.5" />
        <input
          type="search"
          placeholder="Search files"
          class="min-w-0 flex-1 bg-transparent text-xs text-smart-text outline-none placeholder:text-smart-muted"
        />
      </label>
    </div>

    <div class="flex-1 space-y-4 overflow-y-auto bg-smart-surface p-3.5">
      <div>
        <p class="mb-2 font-mono text-[11px] font-bold text-[#5e7482]">RECENT FILES</p>
        <div class="space-y-[7px]">
          <button
            v-for="file in recentFiles"
            :key="file.name"
            type="button"
            class="flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-[9px] text-left transition"
            :class="
              file.active
                ? 'border-smart-green/30 bg-[#123123]'
                : file.highlighted
                  ? 'border-transparent bg-[#102332] hover:border-smart-border'
                  : 'border-transparent bg-transparent hover:bg-smart-panel'
            "
          >
            <FileText
              :size="20"
              :stroke-width="1.5"
              class="shrink-0"
              :class="file.active ? 'text-smart-green-bright' : 'text-smart-muted'"
            />
            <span class="min-w-0">
              <span class="block truncate text-[13px] font-semibold text-smart-text">
                {{ file.name }}
              </span>
              <span class="mt-0.5 block font-mono text-[10px] text-smart-muted">
                {{ file.time }}
              </span>
            </span>
            <span
              v-if="file.menu"
              class="ml-auto grid size-6 shrink-0 place-items-center rounded-md border border-[#213543] bg-smart-surface text-smart-muted"
            >
              <Ellipsis :size="20" :stroke-width="1.5" />
            </span>
            <span v-else class="ml-auto size-6 shrink-0" />
          </button>
        </div>
      </div>

      <div class="border-t border-smart-border pt-2.5">
        <p class="mb-2 font-mono text-[11px] font-bold text-[#5e7482]">SPACES</p>
        <button
          v-for="space in spaces"
          :key="space.name"
          type="button"
          class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#c9d8df] transition hover:bg-smart-panel"
          :class="space.active ? 'bg-[#102332] text-smart-text' : ''"
        >
          <span
            class="size-2 shrink-0 rounded-[2px]"
            :class="space.active ? 'bg-smart-green' : 'bg-[#5e7482]'"
          />
          <span>{{ space.name }}</span>
          <span class="ml-auto font-mono text-[11px] text-[#6f8796]">{{ space.count }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>
