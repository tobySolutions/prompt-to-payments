<script setup lang="ts">
// Live widget: a price in USDC, what `price * 1e6` gives, and what a string parser gives.
import { computed, ref } from 'vue'

const price = ref('2.01')
const decimals = 6

const floaty = computed(() => Number(price.value) * 10 ** decimals)
const floatOk = computed(() => Number.isInteger(floaty.value))

// Decimal string -> bigint base units, no floats anywhere.
const exact = computed(() => {
  const m = /^(\d+)(?:\.(\d*))?$/.exec(price.value.trim())
  if (!m) return null
  const frac = (m[2] ?? '')
  if (frac.length > decimals) return null
  return BigInt(m[1]) * 10n ** BigInt(decimals) + BigInt(frac.padEnd(decimals, '0') || '0')
})
const presets = ['2.50', '2.01', '4.02', '0.10']
</script>

<template>
  <div class="panel bu">
    <div class="top">
      <label for="bu-price">Price in USDC</label>
      <input id="bu-price" v-model="price" inputmode="decimal" />
      <div class="presets"><button v-for="p in presets" :key="p" @click="price = p">{{ p }}</button></div>
    </div>
    <div class="out">
      <div class="col ai">
        <span class="k">AI: <code>price * 1e6</code></span>
        <b class="v mono">{{ floaty }}</b>
        <span class="verdict" :class="floatOk ? 'ok' : 'bug'">{{ floatOk ? 'happens to be fine' : 'not a whole number of base units' }}</span>
      </div>
      <div class="col ok">
        <span class="k">Parse the string as bigint</span>
        <b class="v mono">{{ exact === null ? 'invalid' : exact.toString() + 'n' }}</b>
        <span class="verdict ok">exact, every time</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bu { display: grid; gap: 1rem; }
.top { display: flex; flex-wrap: wrap; gap: 0.8rem; align-items: center; }
.top label { font-size: var(--fs-sm); color: var(--text-2); }
.top input { width: 7em; font-size: var(--fs-md); }
.presets { display: flex; gap: 0.4rem; }
.out { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.col { border-top: 4px solid; padding-top: 0.5rem; display: grid; gap: 0.3rem; }
.col.ai { border-color: var(--ai); } .col.ok { border-color: var(--ok); }
.k { font-size: var(--fs-sm); color: var(--text-2); }
.v { font-size: var(--fs-xl); font-weight: 700; word-break: break-all; }
.col.ai .v { color: var(--ai); } .col.ok .v { color: var(--ok); }
.verdict { font-size: var(--fs-sm); font-weight: 650; }
.verdict.ok { color: var(--ok); } .verdict.bug { color: var(--bug); }
</style>
