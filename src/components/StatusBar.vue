<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle2, CircleOff } from 'lucide-vue-next'

const grammarCheckEnabled = ref(true)
</script>

<template>
  <footer
    class="flex h-7 shrink-0 items-center justify-end border-t border-smart-border bg-smart-editor px-4 font-mono text-[11px] font-semibold text-smart-text"
  >
    <div class="flex items-center gap-3.5">
      <span>Markdown</span>
      <span>UTF-8</span>
      <span>Ln 42, Col 18</span>
      <button
        type="button"
        class="inline-flex h-6 items-center gap-[7px] rounded-md px-1.5 transition hover:bg-smart-surface focus:outline-none focus:ring-2 focus:ring-smart-green/30"
        :class="grammarCheckEnabled ? 'text-smart-green' : 'text-smart-muted'"
        :aria-pressed="grammarCheckEnabled"
        @click="grammarCheckEnabled = !grammarCheckEnabled"
      >
        <span
          class="size-1.5 rounded-full"
          :class="grammarCheckEnabled ? 'bg-smart-green' : 'bg-smart-muted'"
        />
        {{ grammarCheckEnabled ? 'Grammar check active' : 'Grammar check off' }}
        <CheckCircle2 v-if="grammarCheckEnabled" :size="20" :stroke-width="1.5" />
        <CircleOff v-else :size="20" :stroke-width="1.5" />
      </button>
    </div>
  </footer>
</template>
