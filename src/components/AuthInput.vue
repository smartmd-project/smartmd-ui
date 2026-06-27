<script setup lang="ts">
defineProps<{
  id: string
  label: string
  type?: string
  placeholder?: string
  autocomplete?: string
  compact?: boolean
  error?: string
  hideLabel?: boolean
  borderless?: boolean
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <label :for="id" class="block">
    <span
      class="mb-2 block font-mono text-xs font-medium text-smart-code"
      :class="hideLabel ? 'sr-only' : ''"
    >
      {{ label }}
    </span>
    <span
      class="flex items-center gap-2.5 rounded bg-smart-editor px-3.5 transition focus-within:ring-2 focus-within:ring-smart-green/10"
      :class="[
        compact ? 'h-[46px]' : 'h-12',
        borderless
          ? 'shadow-[inset_0_0_0_1px_rgba(255,255,255,.04),0_1px_2px_rgba(0,0,0,.18)]'
          : 'border border-smart-border focus-within:border-smart-green/70',
        error
          ? borderless
            ? 'ring-1 ring-red-400/60 focus-within:ring-red-400/20'
            : 'border-red-400/70 focus-within:border-red-400 focus-within:ring-red-400/10'
          : '',
      ]"
    >
      <slot name="icon" />
      <input
        :id="id"
        v-model="model"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-smart-text outline-none placeholder:text-smart-muted"
      />
    </span>
    <span v-if="error" class="mt-1.5 block text-xs text-red-300">{{ error }}</span>
  </label>
</template>
