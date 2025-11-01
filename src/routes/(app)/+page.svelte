<script lang="ts">
  import MatrixQuadrant from '$lib/components/MatrixQuadrant.svelte';
  import CompletionBar from '$lib/components/CompletionBar.svelte';
  import { tasksStore } from '$lib/stores/taskStore';
  import { categoriesStore } from '$lib/stores/categoryStore';
  import { onMount } from 'svelte';

  let title = '';
  let description = '';
  let dueDate = '';
  let priority: 'High' | 'Medium' | 'Low' = 'Medium';
  let category = '';

  let categories: string[] = [];
  const unsub = categoriesStore.subscribe((v) => (categories = v));

  onMount(() => {
    if (categories.length > 0) category = categories[0];
    return () => unsub();
  });

  let titleInput: HTMLInputElement | null = null;

  function focusTitle() {
    titleInput?.focus();
  }

  function addTask() {
    if (!title.trim()) return;
    tasksStore.add({
      title: title.trim(),
      description: description.trim(),
      isComplete: false,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      priority,
      category: category || 'General'
    });

    // reset
    title = '';
    description = '';
    dueDate = '';
    // return focus to title for quick entry
    focusTitle();
  }
</script>

<section aria-labelledby="add-task">
  <h2 id="add-task">Add Task</h2>
  <form on:submit|preventDefault={addTask} class="add-form">
    <div>
      <label for="title">Title</label>
      <input id="title" bind:value={title} bind:this={titleInput} required />
    </div>
    <div>
      <label for="description">Description</label>
      <input id="description" bind:value={description} />
    </div>
    <div>
      <label for="due">Due</label>
      <input id="due" type="datetime-local" bind:value={dueDate} />
    </div>
    <div>
      <label for="priority">Priority</label>
      <select id="priority" bind:value={priority}>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
    </div>
    <div>
      <label for="category">Category</label>
      <select id="category" bind:value={category}>
        {#each categories as c}
          <option value={c}>{c}</option>
        {/each}
      </select>
    </div>
    <div>
      <button type="submit">Add</button>
    </div>
  </form>
</section>

<hr />

<div class="dashboard-top">
  <CompletionBar />
</div>

<MatrixQuadrant />

<style>
.add-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.6rem;margin-bottom:1rem}
.add-form label{display:block;font-size:0.85rem;color:#333}
.add-form input,.add-form select{width:100%;padding:0.4rem;border:1px solid #ddd;border-radius:4px}
.add-form button{padding:0.6rem 0.8rem}
</style>
