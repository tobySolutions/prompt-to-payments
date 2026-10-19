<script setup lang="ts">
// A short aside. tone: chain | bug | ok | warn | ai
withDefaults(defineProps<{ tone?: 'chain' | 'bug' | 'ok' | 'warn' | 'ai', title?: string }>(), { tone: 'chain' })
</script>

<template>
  <aside class="callout" :class="tone">
    <strong v-if="title">{{ title }}</strong>
    <div><slot /></div>
  </aside>
</template>

<style scoped>
.callout { border-left: 5px solid; padding: 0.6rem 1rem; border-radius: 0 var(--r-sm) var(--r-sm) 0; font-size: var(--fs-sm); color: var(--text-2); }
.callout strong { display: block; font-size: var(--fs-base); margin-bottom: 0.15rem; color: var(--text); }
.callout :deep(p) { margin: 0; font-size: var(--fs-sm); }
.chain { border-color: var(--chain); background: var(--chain-soft); }
.bug { border-color: var(--bug); background: var(--bug-soft); }
.ok { border-color: var(--ok); background: var(--ok-soft); }
.warn, .ai { border-color: var(--ai); background: var(--ai-soft); }
</style>
