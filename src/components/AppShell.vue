<script setup lang="ts">
import { ref } from 'vue'

import CommandBar from '@/components/CommandBar.vue'
import CommandRail from '@/components/CommandRail.vue'
import FileDrawer from '@/components/FileDrawer.vue'
import StatusBar from '@/components/StatusBar.vue'
import type { AuthUser } from '@/api/auth'

type WorkspacePanel = 'files' | 'search' | 'categories' | 'storage' | 'settings'
type AppTheme = 'dark' | 'light'
type AppLanguage = 'vi' | 'en'
interface WorkspaceFile {
  id: string
  name: string
  meta: string
  pinned?: boolean
}

defineProps<{
  user: AuthUser | null
  saveLabel: string
  files: WorkspaceFile[]
  activeFileId: string
}>()

const emit = defineEmits<{
  save: []
  share: []
  newFile: []
  openFile: [id: string]
  logout: []
}>()

const activePanel = ref<WorkspacePanel | null>('files')
const theme = ref<AppTheme>('dark')
const language = ref<AppLanguage>('vi')

function handlePanelSelect(panel: WorkspacePanel) {
  activePanel.value = activePanel.value === panel ? null : panel
}
</script>

<template>
  <main
    class="flex h-dvh min-h-0 flex-col overflow-hidden bg-smart-bg text-smart-text"
    :class="{ 'theme-light': theme === 'light' }"
  >
    <CommandBar :save-label="saveLabel" @save="emit('save')" @share="emit('share')" />

    <div class="flex min-h-0 flex-1 gap-3.5 overflow-hidden bg-smart-bg p-3.5">
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
        :active-file-id="activeFileId"
        :theme="theme"
        :language="language"
        @new-file="emit('newFile')"
        @open-file="emit('openFile', $event)"
        @update-theme="theme = $event"
        @update-language="language = $event"
      />

      <section class="flex min-w-0 flex-1 flex-col overflow-hidden">
        <slot />
      </section>
    </div>

    <StatusBar />
  </main>
</template>
