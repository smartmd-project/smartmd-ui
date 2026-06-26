<script setup lang="ts">
import { Save, Share2 } from 'lucide-vue-next'

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
    class="flex h-12 shrink-0 items-center justify-between border-b border-smart-border bg-[#071219]"
  >
    <div class="flex h-full min-w-[260px] items-center gap-3 px-5">
      <span
        class="grid h-9 w-12 shrink-0 place-items-center rounded-lg border border-white/20 bg-white/[0.03]"
      >
        <img :src="smartmdLogoUrl" alt="SmartMD" class="h-7 w-9 object-contain" />
      </span>
      <p class="truncate text-[20px] font-extrabold leading-none text-smart-text">Smartmd</p>
    </div>

    <div class="flex items-center gap-2 px-5">
      <button
        type="button"
        class="hidden h-[30px] items-center gap-2 rounded-lg border border-smart-border bg-[#071219] px-2.5 text-xs font-semibold text-smart-text transition hover:border-smart-green/50 hover:text-smart-green-bright focus:outline-none focus:ring-2 focus:ring-smart-green/30 md:inline-flex"
        @click="emit('share')"
      >
        <Share2 :size="20" class="text-[#c9d8df]" :stroke-width="1.5" />
        Share
      </button>

      <button
        type="button"
        class="inline-flex h-[30px] min-w-20 items-center justify-center gap-2 rounded-lg border border-smart-border bg-[#071219] px-2.5 text-xs font-semibold text-smart-text transition hover:border-smart-green/50 hover:text-smart-green-bright focus:outline-none focus:ring-2 focus:ring-smart-green/30"
        @click="emit('save')"
      >
        <Save :size="20" class="text-[#c9d8df]" :stroke-width="1.5" />
        {{ saveLabel }}
      </button>
    </div>
  </header>
</template>
