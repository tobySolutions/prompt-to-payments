<script setup lang="ts">
// Hands-on segment. `where` says which window to switch to: Editor, Terminal, Browser.
defineProps<{ where?: string }>()
</script>

<template>
  <div class="slidev-layout live">
    <div class="pill"><span class="dot" />LIVE<span v-if="where" class="where">→ {{ where }}</span></div>
    <slot />
  </div>
</template>

<style scoped>
.live { background: radial-gradient(ellipse at 85% 0%, var(--ai-soft), transparent 55%), var(--ground); }
.pill { display: inline-flex; align-items: center; gap: 0.55rem; font-family: var(--mono); font-weight: 700; font-size: var(--fs-sm); color: var(--ai); border: 1px solid var(--ai); border-radius: 999px; padding: 0.25rem 0.9rem; margin-bottom: 1.2rem; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: var(--ai); animation: pulse 1.4s ease-in-out infinite; }
.where { color: var(--text-2); font-weight: 500; }
@keyframes pulse { 50% { opacity: 0.25; transform: scale(0.7); } }
</style>
