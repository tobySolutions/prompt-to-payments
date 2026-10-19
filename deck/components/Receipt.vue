<script setup lang="ts">
// A thermal receipt slip. Lines print one per click; the stamp lands on the last one.
// lines: [label, value, tone?]. tone: ok | bug | ai | chain
import { computed } from 'vue'

type Line = [string, string, string?]
const props = withDefaults(defineProps<{ title?: string, lines: Line[], step?: number, stamp?: string, stampTone?: 'ok' | 'bug' }>(), { step: 99, stampTone: 'ok' })
const shown = computed(() => Math.min(props.step, props.lines.length))
const stamped = computed(() => props.stamp && props.step > props.lines.length)
</script>

<template>
  <div class="slip">
    <div class="paper" :class="{ roomy: stamp }">
      <div v-if="title" class="head">{{ title }}</div>
      <div class="cut" />
      <div v-for="(l, i) in lines" :key="i" class="row" :class="[l[2], { on: i < shown }]">
        <span>{{ l[0] }}</span><b>{{ l[1] }}</b>
      </div>
      <div class="cut" />
      <div v-if="stamp" class="stamp" :class="[stampTone, { on: stamped }]">{{ stamp }}</div>
    </div>
  </div>
</template>

<style scoped>
.slip { display: flex; justify-content: center; }
.paper {
  position: relative; width: 100%; max-width: 360px; background: var(--paper); color: var(--paper-ink);
  font-family: var(--mono); padding: 1rem 1.1rem 1.4rem;
  -webkit-mask: radial-gradient(circle 6px at 50% 100%, transparent 98%, #000) 0 0 / 14px 100% repeat-x;
          mask: radial-gradient(circle 6px at 50% 100%, transparent 98%, #000) 0 0 / 14px 100% repeat-x;
}
.paper.roomy { padding-bottom: 3.4rem; }
.head { text-align: center; font-weight: 800; font-size: var(--fs-sm); letter-spacing: 0.06em; }
.cut { border-top: 1.5px dashed var(--paper-rule); margin: 0.55rem 0; }
.row { display: flex; font-size: var(--fs-sm); justify-content: space-between; gap: 1rem; padding: 0.16rem 0; opacity: 0; transform: translateY(-6px); transition: opacity .35s, transform .35s var(--ease); }
.row.on { opacity: 1; transform: none; }
.row span, .row b { color: var(--paper-ink); }
.row b { font-weight: 700; text-align: right; }
.row.ok b { color: #13804a; } .row.bug b { color: #c0262d; } .row.ai b { color: #b55a12; } .row.chain b { color: #3550b5; }
.stamp {
  position: absolute; right: 16px; bottom: 14px; font-family: var(--font); font-weight: 900; font-stretch: 80%; font-size: var(--fs-lg);
  border: 3px solid; padding: 0.05em 0.35em; border-radius: var(--r-sm); transform: rotate(-12deg) scale(1.8); opacity: 0; transition: all .35s cubic-bezier(.2, 1.6, .4, 1);
}
.stamp.ok { color: #13804a; } .stamp.bug { color: #c0262d; }
.stamp.on { opacity: 0.9; transform: rotate(-12deg) scale(1); }
</style>
