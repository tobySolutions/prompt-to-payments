<script setup lang="ts">
// "Who wrote this?" tag for code. Class names are prefixed so UnoCSS doesn't
// read them as utilities (`fixed` would become position: fixed).
const props = defineProps<{ by: 'ai' | 'fixed' | 'bug' }>()
const label = { ai: 'AI first draft', fixed: 'reviewed fix', bug: 'the bug' }[props.by]
</script>

<template>
  <span class="tag" :class="`who-${by}`">{{ label }}</span>
</template>

<style scoped>
.tag { display: block; width: fit-content; margin: 0 0 0.6rem; }
.who-ai { color: var(--ai); } .who-fixed { color: var(--ok); } .who-bug { color: var(--bug); }
</style>
