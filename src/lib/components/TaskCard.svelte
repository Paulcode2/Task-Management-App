<script lang="ts">
  import type { Task } from '$lib/stores/taskStore';
  import { tasksStore } from '$lib/stores/taskStore';
  import { formatShortDate } from '$lib/utils/date';
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  export let task: Task;

  const dispatch = createEventDispatcher();

  // Format category for display
    $: displayCategory = task.category === "Personal Projects" ? "Personal Projects" :
                        task.category === "Freelance Jobs" ? "Freelance Jobs" :
                        task.category;

  function toggle() {
    tasksStore.toggleComplete(task.id);
  }

  function remove() {
    tasksStore.deleteTask(task.id);
    dispatch('deleted', { id: task.id });
  }

  function edit() {
    dispatch('edit', { id: task.id });
    goto(`/tasks/${task.id}`);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggle();
    } else if (e.key === 'Delete') {
      e.preventDefault();
      remove();
    } else if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      edit();
    }
  }
</script>

<article class="task-card" role="article" aria-label={`Task ${task.title}`} tabindex="0" on:keydown={onKeydown} in:fade out:fade>
  <div class="left">
    <input aria-label={`Toggle ${task.title}`} type="checkbox" checked={task.isComplete} on:change={toggle} />
  </div>
  <div class="content">
    <h3 class:complete={task.isComplete}>{task.title}</h3>
    <p class="meta">{displayCategory} • {task.priority} • {formatShortDate(task.dueDate)}</p>
    {#if task.description}
      <p class="desc">{task.description}</p>
    {/if}
  </div>
  <div class="actions">
    <button aria-label="Edit task" on:click={edit}>Edit</button>
    <button aria-label="Delete task" on:click={remove}>Delete</button>
  </div>
</article>

<style>
.task-card{display:flex;align-items:flex-start;padding:0.6rem;border-radius:6px;border:1px solid #e6e6e6;margin:0.4rem 0}
.task-card .left{margin-right:0.6rem}
.task-card h3{margin:0;font-size:1rem}
.task-card h3.complete{text-decoration:line-through;color:#888}
.task-card .meta{font-size:0.8rem;color:#666;margin:0.2rem 0}
.task-card .desc{font-size:0.9rem;color:#333;margin-top:0.3rem}
.actions{margin-left:auto;display:flex;flex-direction:column;gap:0.3rem}
.actions button{background:none;border:1px solid #ddd;padding:0.3rem 0.4rem;border-radius:4px;cursor:pointer}
</style>
