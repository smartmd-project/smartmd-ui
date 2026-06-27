<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  Check,
  Cloud,
  Copy,
  Database,
  FileText,
  Folder,
  HardDrive,
  Languages,
  ListTree,
  Moon,
  Palette,
  PencilLine,
  Plus,
  Search,
  Server,
  Sun,
  Trash2,
  X,
} from 'lucide-vue-next'

type WorkspacePanel = 'files' | 'search' | 'categories' | 'storage' | 'settings'
type AppTheme = 'dark' | 'light'
type AppLanguage = 'vi' | 'en'

interface WorkspaceFile {
  id: string
  name: string
  meta: string
  pinned?: boolean
  dirty?: boolean
  content?: string
}

const props = defineProps<{
  panel: WorkspacePanel
  files: WorkspaceFile[]
  openFiles: WorkspaceFile[]
  activeFileId: string
  theme: AppTheme
  language: AppLanguage
}>()

const emit = defineEmits<{
  newFile: []
  openFile: [id: string]
  closeFile: [id: string]
  renameFile: [payload: { id: string; name: string }]
  deleteFile: [id: string]
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
  { name: 'SmartMD server', meta: 'Synced workspace', usage: '72%', icon: Server },
  { name: 'Google Drive', meta: 'Ready to connect', usage: '0%', icon: Cloud },
  { name: 'Local storage', meta: '24 markdown files', usage: '68%', icon: HardDrive },
]

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
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
const focusedSearchIndex = ref(0)
const selectedCategory = ref('Current note')
const selectedStorage = ref('SmartMD server')
const editingFileId = ref<string | null>(null)
const editingName = ref('')
const contextMenu = ref<{
  file: WorkspaceFile
  x: number
  y: number
} | null>(null)

const normalizedSearchQuery = computed(() => searchQuery.value.trim())
const userFiles = computed(() => props.files)
const searchResults = computed(() => {
  const query = normalizedSearchQuery.value.toLowerCase()

  if (!query) {
    return []
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

  return 'Files'
})

function isUnsaved(file: WorkspaceFile) {
  return file.dirty || file.meta === 'Unsaved changes'
}

function startRename(file: WorkspaceFile) {
  editingFileId.value = file.id
  editingName.value = file.name
  contextMenu.value = null
}

function cancelRename() {
  editingFileId.value = null
  editingName.value = ''
}

function saveRename(id: string) {
  const name = editingName.value.trim()

  if (!name) {
    return
  }

  emit('renameFile', { id, name })
  cancelRename()
}

function openFileContextMenu(event: MouseEvent, file: WorkspaceFile) {
  const menuWidth = 176
  const menuHeight = 124
  const viewportPadding = 8

  contextMenu.value = {
    file,
    x: Math.min(event.clientX, window.innerWidth - menuWidth - viewportPadding),
    y: Math.min(event.clientY, window.innerHeight - menuHeight - viewportPadding),
  }
}

function closeContextMenu() {
  contextMenu.value = null
}

function copyFileContent(file: WorkspaceFile) {
  void navigator.clipboard?.writeText(file.content ?? '')
  closeContextMenu()
}

function deleteFile(file: WorkspaceFile) {
  emit('deleteFile', file.id)
  closeContextMenu()
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeContextMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', closeContextMenu)
  document.addEventListener('keydown', handleDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeContextMenu)
  document.removeEventListener('keydown', handleDocumentKeydown)
})

function getHighlightedSegments(value: string) {
  const query = normalizedSearchQuery.value

  if (!query) {
    return [{ value, match: false }]
  }

  const segments: Array<{ value: string; match: boolean }> = []
  const source = value.toLowerCase()
  const needle = query.toLowerCase()
  let cursor = 0
  let matchIndex = source.indexOf(needle)

  while (matchIndex !== -1) {
    if (matchIndex > cursor) {
      segments.push({ value: value.slice(cursor, matchIndex), match: false })
    }

    segments.push({ value: value.slice(matchIndex, matchIndex + query.length), match: true })
    cursor = matchIndex + query.length
    matchIndex = source.indexOf(needle, cursor)
  }

  if (cursor < value.length) {
    segments.push({ value: value.slice(cursor), match: false })
  }

  return segments.length ? segments : [{ value, match: false }]
}

function handleSearchInput() {
  focusedSearchIndex.value = 0
}

function moveSearchFocus(direction: 1 | -1) {
  if (!searchResults.value.length) {
    return
  }

  focusedSearchIndex.value =
    (focusedSearchIndex.value + direction + searchResults.value.length) % searchResults.value.length
}

function openFocusedSearchResult() {
  const file = searchResults.value[focusedSearchIndex.value]

  if (file) {
    emit('openFile', file.id)
  }
}
</script>

<template>
  <aside
    class="workspace-sidebar hidden w-[260px] shrink-0 overflow-hidden rounded-lg border border-smart-border bg-smart-surface lg:flex lg:flex-col"
  >
    <div class="border-b border-smart-border bg-smart-surface px-3 py-3">
      <div class="flex items-center justify-between gap-3">
        <p class="text-lg font-semibold tracking-[-0.01em] text-smart-text">{{ panelTitle }}</p>
      </div>
    </div>

    <div
      class="file-list-surface relative min-h-0 flex-1 space-y-4 overflow-y-auto bg-smart-surface p-3"
      @click="closeContextMenu"
    >
      <section v-if="panel === 'files'" class="space-y-2">
        <p class="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-smart-muted">
          Open now
        </p>
        <div
          v-for="file in openFiles"
          :key="`open-${file.id}`"
          class="group flex w-full items-center gap-2 rounded-md px-2 py-2 transition hover:bg-smart-panel"
          :class="activeFileId === file.id ? 'text-smart-green' : 'text-smart-text'"
        >
          <button
            type="button"
            class="flex min-w-0 flex-1 items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-smart-green/25"
            @click="emit('openFile', file.id)"
          >
            <span class="size-1.5 shrink-0 rounded-full bg-smart-green" />
            <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ file.name }}</span>
          </button>
          <span v-if="isUnsaved(file)" class="text-[11px] text-smart-muted">edited</span>
          <button
            type="button"
            class="grid size-6 shrink-0 place-items-center rounded text-smart-muted opacity-0 transition hover:bg-smart-surface hover:text-smart-text focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-smart-green/25 group-hover:opacity-100"
            :aria-label="`Close ${file.name}`"
            @click="emit('closeFile', file.id)"
          >
            <X :size="15" :stroke-width="1.8" />
          </button>
        </div>
      </section>

      <section
        v-if="panel === 'files'"
        class="group/your-files space-y-2 border-t border-smart-border pt-3"
      >
        <div class="flex items-center justify-between gap-2">
          <p
            class="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-smart-muted"
          >
            Your files
          </p>
          <button
            type="button"
            aria-label="New Markdown file"
            title="New Markdown file"
            class="grid size-6 place-items-center rounded text-smart-muted opacity-0 transition hover:bg-smart-panel hover:text-smart-text focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-smart-green/25 group-hover/your-files:opacity-100"
            @click="emit('newFile')"
          >
            <Plus :size="15" :stroke-width="1.8" />
          </button>
        </div>

        <div v-for="file in userFiles" :key="file.id" class="group">
          <div
            class="relative flex w-full items-center gap-2 rounded-md border px-2 py-2 text-left transition"
            :class="
              activeFileId === file.id
                ? 'border-transparent'
                : 'border-transparent hover:bg-smart-panel'
            "
            @contextmenu.prevent.stop="openFileContextMenu($event, file)"
          >
            <FileText
              :size="18"
              :stroke-width="1.6"
              class="shrink-0"
              :class="activeFileId === file.id ? 'text-smart-green' : 'text-smart-muted'"
            />

            <form
              v-if="editingFileId === file.id"
              class="flex min-w-0 flex-1 items-center gap-1"
              @submit.prevent="saveRename(file.id)"
            >
              <input
                v-model="editingName"
                class="min-w-0 flex-1 rounded border border-smart-border bg-smart-bg px-2 py-1 text-sm font-medium text-smart-text outline-none focus-visible:border-smart-green"
                aria-label="Rename file"
                @keydown.esc.prevent="cancelRename"
              />
              <button
                type="submit"
                aria-label="Save file name"
                class="grid size-7 place-items-center rounded text-smart-green hover:bg-smart-surface"
              >
                <Check :size="15" :stroke-width="1.8" />
              </button>
              <button
                type="button"
                aria-label="Cancel rename"
                class="grid size-7 place-items-center rounded text-smart-muted hover:bg-smart-surface hover:text-smart-text"
                @click="cancelRename"
              >
                <X :size="15" :stroke-width="1.8" />
              </button>
            </form>

            <button
              v-else
              type="button"
              class="min-w-0 flex-1 text-left"
              @click="emit('openFile', file.id)"
            >
              <span class="block truncate text-sm font-medium text-smart-text">{{
                file.name
              }}</span>
              <span class="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-smart-muted">
                <span
                  v-if="isUnsaved(file)"
                  class="size-1.5 shrink-0 rounded-full bg-smart-green"
                  aria-label="Unsaved changes"
                />
                <Cloud v-else :size="12" class="shrink-0" :stroke-width="1.7" aria-label="Synced" />
                <span class="truncate">{{ file.meta }}</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      <Teleport to="body">
        <div
          v-if="contextMenu"
          class="fixed z-[9999] w-44 overflow-hidden rounded-md border border-smart-border bg-smart-editor p-1 shadow-[0_16px_36px_rgba(0,0,0,.28)]"
          :class="theme === 'dark' ? 'theme-dark' : 'theme-light'"
          :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
          role="menu"
          @click.stop
        >
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs font-medium text-smart-text transition hover:bg-smart-panel focus:outline-none focus-visible:ring-2 focus-visible:ring-smart-green/25"
            role="menuitem"
            @click="startRename(contextMenu.file)"
          >
            <PencilLine :size="15" :stroke-width="1.7" />
            Rename
          </button>
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs font-medium text-smart-text transition hover:bg-smart-panel focus:outline-none focus-visible:ring-2 focus-visible:ring-smart-green/25"
            role="menuitem"
            @click="copyFileContent(contextMenu.file)"
          >
            <Copy :size="15" :stroke-width="1.7" />
            Copy content
          </button>
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs font-medium text-red-500 transition hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/25"
            role="menuitem"
            @click="deleteFile(contextMenu.file)"
          >
            <Trash2 :size="15" :stroke-width="1.7" />
            Delete
          </button>
        </div>
      </Teleport>

      <section v-if="panel === 'search'" class="space-y-3">
        <label
          class="flex h-10 items-center gap-2 rounded-md border border-smart-border bg-smart-bg px-3"
        >
          <Search :size="17" class="text-smart-muted" :stroke-width="1.6" />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search markdown files"
            class="min-w-0 flex-1 border-0 bg-transparent text-sm font-medium text-smart-text outline-none placeholder:text-smart-muted"
            @input="handleSearchInput"
            @keydown.down.prevent="moveSearchFocus(1)"
            @keydown.up.prevent="moveSearchFocus(-1)"
            @keydown.enter.prevent="openFocusedSearchResult"
          />
        </label>

        <p v-if="!normalizedSearchQuery" class="px-1 text-xs leading-5 text-smart-muted">
          Find files by name and open them directly into the editor tabs.
        </p>

        <div v-if="normalizedSearchQuery && searchResults.length" class="space-y-1">
          <button
            v-for="(file, index) in searchResults"
            :key="file.id"
            type="button"
            class="relative flex w-full items-center gap-2 rounded-md border border-transparent px-2 py-2 text-left transition hover:bg-smart-panel focus:outline-none focus-visible:ring-2 focus-visible:ring-smart-green/25"
            @mouseenter="focusedSearchIndex = index"
            @click="emit('openFile', file.id)"
          >
            <FileText
              :size="18"
              :stroke-width="1.6"
              class="shrink-0"
              :class="activeFileId === file.id ? 'text-smart-green' : 'text-smart-muted'"
            />
            <span class="min-w-0 flex-1 truncate text-sm font-medium text-smart-text">
              <template
                v-for="(segment, segmentIndex) in getHighlightedSegments(file.name)"
                :key="`${file.id}-name-${segmentIndex}`"
              >
                <mark v-if="segment.match" class="bg-transparent px-0 text-smart-green">
                  {{ segment.value }}
                </mark>
                <span v-else>{{ segment.value }}</span>
              </template>
            </span>
          </button>
        </div>

        <p
          v-else-if="normalizedSearchQuery"
          class="rounded-md border border-dashed border-smart-border px-3 py-4 text-sm text-smart-muted"
        >
          No files found.
        </p>
      </section>

      <section v-if="panel === 'categories'" class="space-y-2">
        <p class="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-smart-muted">
          Current file map
        </p>
        <button
          v-for="category in categories"
          :key="category.name"
          type="button"
          class="flex w-full items-center gap-2 rounded-md border px-2 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-smart-green/25"
          :class="
            selectedCategory === category.name
              ? 'border-transparent'
              : 'border-transparent hover:bg-smart-panel'
          "
          @click="selectedCategory = category.name"
        >
          <ListTree
            :size="18"
            :stroke-width="1.6"
            class="shrink-0"
            :class="selectedCategory === category.name ? 'text-smart-green' : 'text-smart-muted'"
          />
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-medium text-smart-text">
              {{ category.name }}
            </span>
            <span class="mt-0.5 block truncate text-[11px] text-smart-muted">
              {{ category.count }} linked notes
            </span>
          </span>
          <Folder :size="18" class="shrink-0 text-smart-muted" :stroke-width="1.6" />
        </button>
      </section>

      <section v-if="panel === 'storage'" class="space-y-2">
        <p class="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-smart-muted">
          Storage places
        </p>
        <button
          v-for="item in storageItems"
          :key="item.name"
          type="button"
          class="w-full rounded-md border px-2.5 py-2.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-smart-green/25"
          :class="
            selectedStorage === item.name
              ? 'border-transparent'
              : 'border-transparent hover:bg-smart-panel'
          "
          @click="selectedStorage = item.name"
        >
          <span class="flex items-center gap-2">
            <component
              :is="item.icon"
              :size="18"
              :stroke-width="1.6"
              :class="selectedStorage === item.name ? 'text-smart-green' : 'text-smart-muted'"
            />
            <span class="min-w-0 flex-1 truncate text-sm font-medium text-smart-text">
              {{ item.name }}
            </span>
            <Database :size="17" class="text-smart-muted" :stroke-width="1.6" />
          </span>
          <span class="mt-1 block text-[11px] text-smart-muted">{{ item.meta }}</span>
          <span class="mt-2 block h-1.5 overflow-hidden rounded-full bg-smart-bg">
            <span class="block h-full rounded-full bg-smart-green" :style="{ width: item.usage }" />
          </span>
        </button>
      </section>

      <section v-if="panel === 'settings'" class="space-y-4">
        <div class="space-y-2">
          <p
            class="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-smart-muted"
          >
            <Palette :size="15" :stroke-width="1.6" />
            Theme
          </p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="option in themeOptions"
              :key="option.value"
              type="button"
              class="flex h-9 items-center justify-center gap-1.5 rounded-md border text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-smart-green/25"
              :class="
                theme === option.value
                  ? 'border-smart-green bg-smart-panel text-smart-green'
                  : 'border-smart-border bg-transparent text-smart-muted hover:bg-smart-panel hover:text-smart-text'
              "
              @click="emit('updateTheme', option.value)"
            >
              <component :is="option.icon" :size="15" :stroke-width="1.6" />
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="space-y-2 border-t border-smart-border pt-4">
          <p
            class="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-smart-muted"
          >
            <Languages :size="15" :stroke-width="1.6" />
            Language
          </p>
          <div class="space-y-1.5">
            <button
              v-for="option in languageOptions"
              :key="option.value"
              type="button"
              class="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-smart-green/25"
              :class="
                language === option.value
                  ? 'border-smart-green bg-smart-panel text-smart-green'
                  : 'border-transparent text-smart-text hover:bg-smart-panel'
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
