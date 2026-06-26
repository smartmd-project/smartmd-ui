<script setup lang="ts">
import { ref } from 'vue'
import {
  Database,
  FolderOpen,
  ListTree,
  LogOut,
  Search,
  Settings,
  UserRound,
} from 'lucide-vue-next'

import type { AuthUser } from '@/api/auth'

type WorkspacePanel = 'files' | 'search' | 'categories' | 'storage' | 'settings'

defineProps<{
  user: AuthUser | null
  activePanel: WorkspacePanel | null
}>()

const emit = defineEmits<{
  selectPanel: [panel: WorkspacePanel]
  logout: []
}>()

const menuOpen = ref(false)

const railItems = [
  { id: 'files', label: 'Files', icon: FolderOpen },
  { id: 'search', label: 'Search files', icon: Search },
  { id: 'categories', label: 'Open categories', icon: ListTree },
  { id: 'storage', label: 'Storage', icon: Database },
] satisfies Array<{
  id: WorkspacePanel
  label: string
  icon: typeof FolderOpen
}>

function userInitials(user: AuthUser | null) {
  const source = user?.name || user?.email || 'SmartMD User'

  return source
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
</script>

<template>
  <aside
    class="relative flex w-[62px] shrink-0 flex-col items-center justify-between rounded-[10px] border border-smart-border bg-smart-bg px-2 py-2.5"
  >
    <nav class="flex flex-col gap-1.5" aria-label="Workspace tools">
      <button
        v-for="item in railItems"
        :key="item.label"
        type="button"
        :aria-label="item.label"
        :title="item.label"
        class="grid size-[42px] place-items-center rounded-[10px] border transition focus:outline-none focus:ring-2 focus:ring-smart-green/30"
        :class="
          activePanel === item.id
            ? 'border-smart-green bg-smart-surface text-smart-green-bright'
            : 'border-transparent bg-transparent text-smart-muted hover:border-smart-border hover:bg-smart-surface hover:text-smart-text'
        "
        @click="emit('selectPanel', item.id)"
      >
        <component :is="item.icon" :size="20" :stroke-width="1.5" />
      </button>
    </nav>

    <div class="flex flex-col items-center gap-1.5">
      <button
        type="button"
        aria-label="Settings"
        title="Settings"
        class="grid size-[42px] place-items-center rounded-[10px] border border-transparent text-smart-muted transition hover:border-smart-border hover:bg-smart-surface hover:text-smart-text focus:outline-none focus:ring-2 focus:ring-smart-green/30"
        :class="
          activePanel === 'settings'
            ? 'border-smart-green bg-smart-surface text-smart-green-bright'
            : ''
        "
        @click="emit('selectPanel', 'settings')"
      >
        <Settings :size="20" :stroke-width="1.5" />
      </button>

      <button
        type="button"
        aria-label="Account"
        :aria-expanded="menuOpen"
        class="grid size-8 place-items-center rounded-full bg-smart-navy text-xs font-bold text-smart-text transition hover:ring-1 hover:ring-smart-green focus:outline-none focus:ring-2 focus:ring-smart-green/40"
        @click="menuOpen = !menuOpen"
      >
        {{ userInitials(user) }}
      </button>
    </div>

    <div
      v-if="menuOpen"
      class="absolute bottom-2 left-[calc(100%+10px)] z-40 w-64 rounded-lg border border-smart-border bg-smart-surface p-2 shadow-[0_18px_45px_rgba(0,0,0,.55)]"
    >
      <div class="flex items-center gap-3 border-b border-smart-border px-3 py-3">
        <div class="grid size-9 shrink-0 place-items-center rounded-full bg-smart-navy">
          <UserRound :size="20" class="text-smart-green-bright" :stroke-width="1.5" />
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-smart-text">
            {{ user?.name || 'SmartMD User' }}
          </p>
          <p class="truncate text-xs text-smart-muted">
            {{ user?.email || 'local@smartmd.app' }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-smart-muted transition hover:bg-smart-panel hover:text-smart-text"
        @click="emit('logout')"
      >
        <LogOut :size="20" :stroke-width="1.5" />
        Log out
      </button>
    </div>
  </aside>
</template>
