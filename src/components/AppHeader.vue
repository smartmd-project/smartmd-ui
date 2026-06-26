<script setup lang="ts">
import { ref } from 'vue'
import { LogOut, Save, Search, Share2, UserRound } from 'lucide-vue-next'

import AppLogo from '@/components/AppLogo.vue'
import type { AuthUser } from '@/api/auth'

defineProps<{
  user: AuthUser | null
  saveLabel: string
  wordCount: number
}>()

const emit = defineEmits<{
  save: []
  logout: []
}>()

const title = defineModel<string>('title', { required: true })
const menuOpen = ref(false)
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
  <header
    class="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-smart-border bg-[#081720] px-[22px]"
  >
    <div class="flex min-w-0 items-center gap-[30px]">
      <AppLogo compact />
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <input
            v-model="title"
            aria-label="Document title"
            class="w-full min-w-0 max-w-64 truncate border-0 bg-transparent text-base font-bold text-smart-text outline-none transition placeholder:text-smart-muted focus:text-smart-green-bright"
            placeholder="untitled.md"
            @blur="title = title.trim() || 'untitled.md'"
          />
          <span
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#123123] px-2 py-1 font-mono text-[11px] font-semibold text-smart-green-bright"
          >
            <span class="size-1.5 rounded-full bg-smart-green" />
            {{ saveLabel }}
          </span>
        </div>
        <p class="mt-0.5 font-mono text-[11px] font-medium text-smart-muted">
          Words {{ wordCount.toLocaleString() }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2.5">
      <label
        class="hidden h-[34px] w-[220px] items-center gap-2 rounded-lg border border-[#213543] bg-[#0f1f2a] px-3 xl:flex"
      >
        <Search :size="20" class="text-smart-muted" :stroke-width="1.5" />
        <input
          type="search"
          placeholder="Search docs"
          class="min-w-0 flex-1 border-0 bg-transparent text-[13px] font-semibold text-smart-text outline-none placeholder:text-smart-muted"
        />
        <span class="font-mono text-[11px] font-bold text-[#5e7482]">Ctrl K</span>
      </label>
      <button
        type="button"
        class="hidden h-8 items-center gap-2 rounded-[7px] border border-[#213543] bg-smart-surface px-2.5 text-xs font-semibold text-smart-text transition hover:border-smart-green/40 md:inline-flex"
      >
        <Share2 :size="20" class="text-smart-muted" :stroke-width="1.5" />
        Share
      </button>
      <button
        type="button"
        class="inline-flex h-[34px] items-center gap-2 rounded-lg border border-[#294557] bg-[#102332] px-[11px] text-xs font-bold text-smart-green-bright transition hover:border-smart-green hover:bg-[#123123]"
        @click="emit('save')"
      >
        <Save :size="20" :stroke-width="1.5" />
        Save
      </button>

      <div class="relative">
        <button
          type="button"
          aria-label="Open user menu"
          :aria-expanded="menuOpen"
          class="grid size-[34px] place-items-center rounded-full border border-smart-green/40 bg-smart-navy text-xs font-bold text-smart-text transition hover:border-smart-green"
          @click="menuOpen = !menuOpen"
        >
          {{ userInitials(user) }}
        </button>

        <div
          v-if="menuOpen"
          class="absolute right-0 top-12 w-64 rounded-lg border border-smart-border bg-smart-surface p-2 shadow-[0_18px_45px_rgba(0,0,0,.55)]"
        >
          <div class="flex items-center gap-3 border-b border-smart-border px-3 py-3">
            <div
              class="grid size-9 shrink-0 place-items-center rounded-full bg-smart-navy text-smart-green-bright"
            >
              <UserRound :size="20" :stroke-width="1.5" />
            </div>
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-smart-text">{{ user?.name }}</p>
              <p class="truncate text-xs text-smart-muted">{{ user?.email }}</p>
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
      </div>
    </div>
  </header>
</template>
