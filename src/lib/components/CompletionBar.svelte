<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { completionPercentage } from '$lib/stores/taskStore';
  import { onDestroy } from 'svelte';

  const animated = tweened(0, { duration: 400 });

  const unsub = completionPercentage.subscribe((v) => {
    animated.set(v);
  });

  onDestroy(() => unsub());
</script>

<div class="completion-bar" aria-hidden="false" role="progressbar" aria-valuemin="0" aria-valuemax="100">
  <div class="track">
    <div class="fill" style="width:{$animated}%"></div>
  </div>
  <div class="label">{Math.round($animated)}% complete</div>
</div>

<style>
.completion-bar{display:flex;align-items:center;gap:0.6rem}
.track{flex:1;background:#eee;height:10px;border-radius:999px;overflow:hidden}
.fill{height:100%;background:linear-gradient(90deg,#4ade80,#06b6d4);transition:width 0.25s ease}
.label{min-width:110px;text-align:right;font-size:0.9rem;color:#333}
</style>
