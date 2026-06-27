<script setup lang="ts">
import smartmdLogoUrl from '@/components/icons/smartmd-logo.png'

withDefaults(
  defineProps<{
    compact?: boolean
    lowercase?: boolean
    hideTagline?: boolean
    iconOnly?: boolean
    large?: boolean
  }>(),
  {
    compact: false,
    lowercase: false,
    hideTagline: false,
    iconOnly: false,
    large: false,
  },
)
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="relative flex shrink-0 items-center justify-center"
      :class="compact ? 'h-9 w-12' : large ? 'h-24 w-32' : 'h-12 w-16'"
    >
      <img :src="smartmdLogoUrl" alt="SmartMD" class="h-full w-full object-contain" />
    </div>

    <div v-if="!compact && !iconOnly" class="min-w-0">
      <p class="text-[23px] font-bold leading-none text-smart-text">
        {{ lowercase ? 'smartmd' : 'SmartMD' }}
      </p>
      <p
        v-if="!hideTagline"
        class="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-smart-muted"
      >
        Clinical Markdown
      </p>
    </div>
  </div>
</template>
