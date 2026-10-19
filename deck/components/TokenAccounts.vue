<script setup lang="ts">
// Wallet -> token account. Step 1: the wallet. 2: its USDC account, derived.
// 3: the same owner + a Token-2022 mint gives a different program and address.
withDefaults(defineProps<{ step?: number }>(), { step: 99 })
</script>

<template>
  <div class="ta">
    <div class="node wallet" :class="{ on: step >= 1 }">
      <span class="k">Your wallet</span>
      <b class="mono">AMX5…6DoC</b>
      <span class="s">holds SOL, signs</span>
    </div>

    <div class="arrow" :class="{ on: step >= 2 }">
      <span>owner + mint + token program</span>
      <i />
    </div>

    <div class="stack">
      <div class="node chain" :class="{ on: step >= 2 }">
        <span class="k">USDC token account</span>
        <b class="mono">Ajb4…BjVd</b>
        <span class="s">mint 4zMM… · Token program · balance in base units</span>
      </div>
      <div class="node warn" :class="{ on: step >= 3 }">
        <span class="k">PYUSD token account</span>
        <b class="mono">F99W…QdmF</b>
        <span class="s">Token-2022 program. Code that assumes the classic program derives the wrong account.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ta { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 0.8fr) minmax(0, 1.3fr); gap: 1rem; align-items: center; margin-top: 1.5rem; }
.node { border: 1.5px solid var(--line); border-radius: var(--r-md); padding: 0.8rem 1rem; display: grid; gap: 0.2rem; background: var(--ground-2); opacity: 0.12; transform: translateY(8px); transition: all .45s var(--ease); }
.node.on { opacity: 1; transform: none; }
.node .k { font-size: var(--fs-sm); color: var(--text-2); }
.node b { font-size: var(--fs-lg); }
.node .s { font-size: var(--fs-xs); color: var(--muted); }
.wallet { border-color: var(--text-2); }
.chain { border-color: var(--chain); } .chain b { color: var(--chain); }
.warn { border-color: var(--ai); } .warn b { color: var(--ai); }
.stack { display: grid; gap: 0.8rem; }
.arrow { position: relative; text-align: center; opacity: 0.12; transition: opacity .4s; }
.arrow.on { opacity: 1; }
.arrow span { font-family: var(--mono); font-size: var(--fs-xs); color: var(--chain); display: block; margin-bottom: 0.4rem; }
.arrow i { display: block; height: 2px; background: var(--chain); position: relative; }
.arrow i::after { content: ''; position: absolute; right: -2px; top: -5px; border: 6px solid transparent; border-left: 9px solid var(--chain); }
</style>
