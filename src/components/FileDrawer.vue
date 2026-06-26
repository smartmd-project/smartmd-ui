<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Database,
  Ellipsis,
  FileText,
  Folder,
  HardDrive,
  Languages,
  ListTree,
  Moon,
  Palette,
  Plus,
  Search,
  Sun,
} from 'lucide-vue-next'

type WorkspacePanel = 'files' | 'search' | 'categories' | 'storage' | 'settings'
type AppTheme = 'dark' | 'light'
type AppLanguage = 'vi' | 'en'
interface WorkspaceFile {
  id: string
  name: string
  meta: string
  pinned?: boolean
}

const props = defineProps<{
  panel: WorkspacePanel
  files: WorkspaceFile[]
  activeFileId: string
  theme: AppTheme
  language: AppLanguage
}>()

const emit = defineEmits<{
  newFile: []
  openFile: [id: string]
  updateTheme: [theme: AppTheme]
  updateLanguage: [language: AppLanguage]
}>()

const categories = [
  { name: 'Current note', count: 6, active: true },
  { name: 'Implementation', count: 4 },
  { name: 'Release', count: 3 },
  { name: 'Knowledge map', count: 9 },
]

const storageItems = [
  { name: 'Local workspace', meta: '24 markdown files', usage: '68%' },
  { name: 'Pinned notes', meta: '2 quick access files', usage: '18%' },
  { name: 'Archive', meta: '7 older documents', usage: '31%' },
]
const themeOptions = [
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'light', label: 'Light', icon: Sun },
] satisfies Array<{
  value: AppTheme
  label: string
  icon: typeof Moon
}>
const languageOptions = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
] satisfies Array<{
  value: AppLanguage
  label: string
}>

const searchQuery = ref('')
const selectedCategory = ref('Current note')
const selectedStorage = ref('Local workspace')

const pinnedFiles = computed(() => props.files.filter((file) => file.pinned))
const recentFiles = computed(() => props.files.filter((file) => !file.pinned))
const filteredFiles = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return props.files
  }

  return props.files.filter((file) => file.name.toLowerCase().includes(query))
})

const panelTitle = computed(() => {
  if (props.panel === 'search') {
    return 'Search files'
  }

  if (props.panel === 'categories') {
    return 'Open categories'
  }

  if (props.panel === 'storage') {
    return 'Storage'
  }

  if (props.panel === 'settings') {
    return 'Settings'
  }

  return 'Workspace'
})
</script>

<template>
  <aside
    class="hidden w-[260px] shrink-0 overflow-hidden rounded-[10px] border border-smart-border bg-smart-surface lg:flex lg:flex-col"
  >
    <div class="border-b border-smart-border bg-[#071219] p-3">
      <div class="flex items-center justify-between">
        <p class="text-[15px] font-bold text-smart-text">{{ panelTitle }}</p>
        <button
          v-if="panel === 'files'"
          type="button"
          class="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-smart-green bg-smart-green px-2.5 text-xs font-bold text-smart-bg transition hover:bg-smart-green-bright focus:outline-none focus:ring-2 focus:ring-smart-green/30"
          @click="emit('newFile')"
        >
          <Plus :size="20" :stroke-width="1.5" />
          New
        </button>
      </div>
    </div>

    <div class="min-h-0 flex-1 space-y-3.5 overflow-y-auto bg-smart-surface p-3">
      <section v-if="panel === 'files'" class="space-y-1.5">
        <p class="font-mono text-[10px] font-bold uppercase text-smart-green-bright">Pinned</p>

        <button
          v-for="file in pinnedFiles"
          :key="file.name"
          type="button"
          class="flex w-full items-center gap-2 rounded-lg border px-2 py-[9px] text-left transition focus:outline-none focus:ring-2 focus:ring-smart-green/25"
          :class="
            activeFileId === file.id
              ? 'border-smart-green bg-[#071219]'
              : 'border-transparent bg-transparent hover:bg-smart-panel'
          "
          @click="emit('openFile', file.id)"
        >
          <span
            v-if="activeFileId === file.id"
            class="h-[30px] w-[3px] shrink-0 rounded-sm bg-smart-green"
          />
          <FileText
            :size="20"
            :stroke-width="1.5"
            class="shrink-0"
            :class="activeFileId === file.id ? 'text-smart-green-bright' : 'text-smart-muted'"
          />
          <span class="min-w-0 flex-1">
            <span
              class="block truncate text-xs"
              :class="
                activeFileId === file.id
                  ? 'font-bold text-smart-text'
                  : 'font-semibold text-[#c9d8df]'
              "
            >
              {{ file.name }}
            </span>
            <span
              class="mt-0.5 block truncate font-mono text-[10px]"
              :class="activeFileId === file.id ? 'text-smart-green-bright' : 'text-smart-muted'"
            >
              {{ file.meta }}
            </span>
          </span>
          <span
            class="grid size-[22px] shrink-0 place-items-center rounded-md"
            :class="activeFileId === file.id ? 'bg-smart-surface' : 'bg-transparent'"
          >
            <Ellipsis :size="20" class="text-smart-muted" :stroke-width="1.5" />
          </span>
        </button>
      </section>

      <section v-if="panel === 'files'" class="space-y-1.5">
        <p class="font-mono text-[10px] font-bold uppercase text-smart-green-bright">Recent</p>

        <button
          v-for="file in recentFiles"
          :key="file.name"
          type="button"
          class="flex w-full items-center gap-2 rounded-lg border border-transparent px-2 py-[9px] text-left transition hover:bg-smart-panel focus:outline-none focus:ring-2 focus:ring-smart-green/25"
          @click="emit('openFile', file.id)"
        >
          <FileText :size="20" class="shrink-0 text-smart-muted" :stroke-width="1.5" />
          <span class="min-w-0 flex-1">
            <span class="block truncate text-xs font-semibold text-[#c9d8df]">
              {{ file.name }}
            </span>
            <span class="mt-0.5 block truncate font-mono text-[10px] text-smart-muted">
              {{ file.meta }}
            </span>
          </span>
          <Ellipsis :size="20" class="shrink-0 text-smart-muted" :stroke-width="1.5" />
        </button>
      </section>

      <section v-if="panel === 'search'" class="space-y-3">
        <label
          class="flex h-9 items-center gap-2 rounded-lg border border-smart-border bg-[#071219] px-3"
        >
          <Search :size="20" class="text-smart-muted" :stroke-width="1.5" />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search markdown files"
            class="min-w-0 flex-1 border-0 bg-transparent text-xs font-semibold text-smart-text outline-none placeholder:text-smart-muted"
          />
        </label>

        <div class="space-y-1.5">
          <button
            v-for="file in filteredFiles"
            :key="file.name"
            type="button"
            class="flex w-full items-center gap-2 rounded-lg border px-2 py-[9px] text-left transition focus:outline-none focus:ring-2 focus:ring-smart-green/25"
            :class="
              activeFileId === file.id
                ? 'border-smart-green bg-[#071219]'
                : 'border-transparent hover:bg-smart-panel'
            "
            @click="emit('openFile', file.id)"
          >
            <FileText
              :size="20"
              :stroke-width="1.5"
              class="shrink-0"
              :class="activeFileId === file.id ? 'text-smart-green-bright' : 'text-smart-muted'"
            />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-xs font-semibold text-[#c9d8df]">
                {{ file.name }}
              </span>
              <span class="mt-0.5 block truncate font-mono text-[10px] text-smart-muted">
                {{ file.meta }}
              </span>
            </span>
          </button>
        </div>
      </section>

      <section v-if="panel === 'categories'" class="space-y-1.5">
        <p class="font-mono text-[10px] font-bold uppercase text-smart-green-bright">
          Current file map
        </p>
        <button
          v-for="category in categories"
          :key="category.name"
          type="button"
          class="flex w-full items-center gap-2 rounded-lg border px-2 py-[9px] text-left transition focus:outline-none focus:ring-2 focus:ring-smart-green/25"
          :class="
            selectedCategory === category.name
              ? 'border-smart-green bg-[#071219]'
              : 'border-transparent hover:bg-smart-panel'
          "
          @click="selectedCategory = category.name"
        >
          <ListTree
            :size="20"
            :stroke-width="1.5"
            class="shrink-0"
            :class="
              selectedCategory === category.name ? 'text-smart-green-bright' : 'text-smart-muted'
            "
          />
          <span class="min-w-0 flex-1">
            <span class="block truncate text-xs font-semibold text-[#c9d8df]">
              {{ category.name }}
            </span>
            <span class="mt-0.5 block truncate font-mono text-[10px] text-smart-muted">
              {{ category.count }} linked notes
            </span>
          </span>
          <Folder :size="20" class="shrink-0 text-smart-muted" :stroke-width="1.5" />
        </button>
      </section>

      <section v-if="panel === 'storage'" class="space-y-1.5">
        <p class="font-mono text-[10px] font-bold uppercase text-smart-green-bright">
          Storage places
        </p>
        <button
          v-for="item in storageItems"
          :key="item.name"
          type="button"
          class="w-full rounded-lg border px-2.5 py-2.5 text-left transition focus:outline-none focus:ring-2 focus:ring-smart-green/25"
          :class="
            selectedStorage === item.name
              ? 'border-smart-green bg-[#071219]'
              : 'border-transparent hover:bg-smart-panel'
          "
          @click="selectedStorage = item.name"
        >
          <span class="flex items-center gap-2">
            <HardDrive
              :size="20"
              :stroke-width="1.5"
              :class="
                selectedStorage === item.name ? 'text-smart-green-bright' : 'text-smart-muted'
              "
            />
            <span class="min-w-0 flex-1 truncate text-xs font-semibold text-[#c9d8df]">
              {{ item.name }}
            </span>
            <Database :size="20" class="text-smart-muted" :stroke-width="1.5" />
          </span>
          <span class="mt-1 block font-mono text-[10px] text-smart-muted">{{ item.meta }}</span>
          <span class="mt-2 block h-1.5 overflow-hidden rounded-full bg-[#071219]">
            <span class="block h-full rounded-full bg-smart-green" :style="{ width: item.usage }" />
          </span>
        </button>
      </section>

      <section v-if="panel === 'settings'" class="space-y-4">
        <div class="space-y-2">
          <p
            class="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-smart-green-bright"
          >
            <Palette :size="20" :stroke-width="1.5" />
            Theme
          </p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="option in themeOptions"
              :key="option.value"
              type="button"
              class="flex h-10 items-center justify-center gap-2 rounded-lg border text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-smart-green/25"
              :class="
                theme === option.value
                  ? 'border-smart-green bg-[#071219] text-smart-green-bright'
                  : 'border-smart-border bg-transparent text-smart-muted hover:bg-smart-panel hover:text-smart-text'
              "
              @click="emit('updateTheme', option.value)"
            >
              <component :is="option.icon" :size="20" :stroke-width="1.5" />
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="space-y-2 border-t border-smart-border pt-4">
          <p
            class="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-smart-green-bright"
          >
            <Languages :size="20" :stroke-width="1.5" />
            Language
          </p>
          <div class="space-y-1.5">
            <button
              v-for="option in languageOptions"
              :key="option.value"
              type="button"
              class="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-smart-green/25"
              :class="
                language === option.value
                  ? 'border-smart-green bg-[#071219] text-smart-green-bright'
                  : 'border-transparent text-[#c9d8df] hover:bg-smart-panel'
              "
              @click="emit('updateLanguage', option.value)"
            >
              {{ option.label }}
              <span
                class="size-2 rounded-full"
                :class="language === option.value ? 'bg-smart-green' : 'bg-smart-muted'"
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  </aside>
</template>
