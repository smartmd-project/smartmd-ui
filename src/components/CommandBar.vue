<script setup lang="ts">
import { Check, Cloud, Share2 } from 'lucide-vue-next'

import smartmdLogoUrl from '@/components/icons/smartmd-logo.png'

defineProps<{
  saveLabel: string
}>()

const emit = defineEmits<{
  save: []
  share: []
}>()
</script>

<template>
  <header
    class="workspace-topbar flex h-12 shrink-0 items-center justify-between border-b border-smart-border bg-[#071219]"
  >
    <div class="flex h-full min-w-[260px] items-center gap-2 px-5">
      <span class="grid h-9 w-12 shrink-0 place-items-center rounded-md bg-white/[0.03]">
        <img :src="smartmdLogoUrl" alt="SmartMD" class="h-7 w-9 object-contain" />
      </span>
    </div>

    <div class="flex items-center gap-2 px-5">
      <button
        type="button"
        class="hidden h-[30px] items-center gap-1.5 rounded-md bg-transparent px-2.5 text-xs font-medium text-smart-muted transition hover:bg-smart-panel hover:text-smart-text focus:outline-none focus:ring-2 focus:ring-smart-green/30 md:inline-flex"
        @click="emit('share')"
      >
        <Share2 :size="17" :stroke-width="1.6" />
        Share
      </button>

      <button
        type="button"
        class="inline-flex h-[30px] min-w-20 items-center justify-center gap-1.5 rounded-md bg-transparent px-2.5 text-xs font-medium text-smart-text transition hover:bg-smart-panel hover:text-smart-green focus:outline-none focus-visible:ring-2 focus-visible:ring-smart-green/25"
        @click="emit('save')"
      >
        <Check v-if="saveLabel === 'Saved'" :size="17" :stroke-width="1.8" />
        <Cloud v-else :size="17" :stroke-width="1.6" />
        {{ saveLabel }}
      </button>
    </div>
  </header>
</template>
