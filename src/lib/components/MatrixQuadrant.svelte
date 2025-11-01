<script lang="ts">
  import { quadrants } from '$lib/stores/taskStore';
  import TaskCard from './TaskCard.svelte';
  import { fly, fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  let q = get(quadrants);

  const unsub = quadrants.subscribe((v) => (q = v));

  onMount(() => {
    return () => unsub();
  });
</script>

<section class="matrix">
  <div class="quadrant">
    <h4>Important & Urgent</h4>
    {#each q.importantUrgent as task (task.id)}
      <div animate:flip in:fly={{ y: 8, duration: 200 }} out:fade>
        <TaskCard {task} />
      </div>
    {:else}
      <p class="empty">No tasks</p>
    {/each}
  </div>

  <div class="quadrant">
    <h4>Important & Not Urgent</h4>
    {#each q.importantNotUrgent as task (task.id)}
      <div animate:flip in:fly={{ y: 8, duration: 200 }} out:fade>
        <TaskCard {task} />
      </div>
    {:else}
      <p class="empty">No tasks</p>
    {/each}
  </div>

  <div class="quadrant">
    <h4>Not Important & Urgent</h4>
    {#each q.notImportantUrgent as task (task.id)}
      <div animate:flip in:fly={{ y: 8, duration: 200 }} out:fade>
        <TaskCard {task} />
      </div>
    {:else}
      <p class="empty">No tasks</p>
    {/each}
  </div>

  <div class="quadrant">
    <h4>Not Important & Not Urgent</h4>
    {#each q.notImportantNotUrgent as task (task.id)}
      <div animate:flip in:fly={{ y: 8, duration: 200 }} out:fade>
        <TaskCard {task} />
      </div>
    {:else}
      <p class="empty">No tasks</p>
    {/each}
  </div>
</section>

<style>
.matrix{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.quadrant{background:#fbfbfb;padding:0.8rem;border-radius:8px;border:1px solid #f0f0f0;min-height:6rem}
.quadrant h4{margin:0 0 0.6rem 0}
.empty{color:#999;font-style:italic}
</style>
