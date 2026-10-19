<script setup lang="ts">
// The attendee's prompt, typed out like a chat box. `typed` starts the typing.
import { computed, onUnmounted, ref, watch } from 'vue'
import { useNav } from '@slidev/client'

const props = withDefaults(defineProps<{ text: string, typed?: boolean, speed?: number, who?: string }>(), { typed: true, speed: 22, who: 'You' })
// PDF/PPTX export snapshots the slide, so show the whole prompt there.
const { isPrintMode } = useNav()
const n = ref(props.typed && !isPrintMode.value ? 0 : props.text.length)
let timer: ReturnType<typeof setInterval> | undefined

function run() {
  clearInterval(timer)
  n.value = 0
  timer = setInterval(() => {
    n.value++
    if (n.value >= props.text.length) clearInterval(timer)
  }, props.speed)
}
watch(() => props.typed, t => (t && !isPrintMode.value ? run() : (n.value = props.text.length)), { immediate: true })
onUnmounted(() => clearInterval(timer))
const shown = computed(() => props.text.slice(0, n.value))
const done = computed(() => n.value >= props.text.length)
</script>

<template>
  <div class="prompt">
    <div class="who">{{ who }}</div>
    <p class="body">{{ shown }}<span class="caret" :class="{ done }" /></p>
  </div>
</template>

<style scoped>
.prompt { border: 1px solid var(--ai); border-radius: var(--r-md); background: var(--ai-soft); padding: 1rem 1.2rem 1.1rem; }
.who { font-family: var(--mono); font-size: var(--fs-xs); color: var(--ai); margin-bottom: 0.4rem; }
.body { font-size: var(--fs-md) !important; line-height: 1.5; margin: 0; color: var(--text); min-height: 3em; }
.caret { display: inline-block; width: 0.55em; height: 1.1em; vertical-align: -0.15em; margin-left: 2px; background: var(--ai); animation: blink 1s steps(1) infinite; }
.caret.done { opacity: 0.5; }
@keyframes blink { 50% { opacity: 0; } }
</style>
