<script setup lang="ts">
import { ref } from 'vue'

import CommandRail from '@/components/CommandRail.vue'
import FileDrawer from '@/components/FileDrawer.vue'
import StatusBar from '@/components/StatusBar.vue'
import type { AuthUser } from '@/api/auth'
import { useAppTheme } from '@/composables/useAppTheme'

type WorkspacePanel = 'files' | 'search' | 'categories' | 'storage' | 'settings'
type AppLanguage = 'vi' | 'en'
interface WorkspaceFile {
  id: string
  name: string
  meta: string
  pinned?: boolean
  dirty?: boolean
}

defineProps<{
  user: AuthUser | null
  files: WorkspaceFile[]
  openFiles: WorkspaceFile[]
  activeFileId: string
}>()

const emit = defineEmits<{
  newFile: []
  openFile: [id: string]
  closeFile: [id: string]
  renameFile: [id: string, name: string]
  deleteFile: [id: string]
  logout: []
}>()

const activePanel = ref<WorkspacePanel | null>('files')
const language = ref<AppLanguage>('vi')
const { theme, setTheme } = useAppTheme()

function handlePanelSelect(panel: WorkspacePanel) {
  activePanel.value = activePanel.value === panel ? null : panel
}
</script>

<template>
  <main
    class="flex h-dvh min-h-0 flex-col overflow-hidden bg-smart-bg text-smart-text"
    :class="{ 'theme-light': theme === 'light', 'theme-dark': theme === 'dark' }"
  >
    <div class="flex min-h-0 flex-1 gap-3 overflow-hidden bg-smart-bg p-3">
      <CommandRail
        :user="user"
        :active-panel="activePanel"
        @select-panel="handlePanelSelect"
        @logout="emit('logout')"
      />
      <FileDrawer
        v-if="activePanel"
        :panel="activePanel"
        :files="files"
        :open-files="openFiles"
        :active-file-id="activeFileId"
        :theme="theme"
        :language="language"
        @new-file="emit('newFile')"
        @open-file="emit('openFile', $event)"
        @close-file="emit('closeFile', $event)"
        @rename-file="emit('renameFile', $event.id, $event.name)"
        @delete-file="emit('deleteFile', $event)"
        @update-theme="setTheme"
        @update-language="language = $event"
      />

      <section class="flex min-w-0 flex-1 flex-col overflow-hidden">
        <slot />
      </section>
    </div>

    <StatusBar />
  </main>
</template>
