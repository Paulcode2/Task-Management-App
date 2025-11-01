<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import tasksStore from '$lib/stores/taskStore';
  import categoriesStore from '$lib/stores/categoryStore';
  import { get } from 'svelte/store';

  let id: string;
  let task: any = null;
  let categories: string[] = [];
  let dueDate = '';

  const unsubCategories = categoriesStore.subscribe(c => categories = c);

  const unsub = page.subscribe(($page) => {
    id = ($page.params as any).id;
    task = tasksStore.getById(id);
    if (task?.dueDate) {
      // Convert ISO string to local datetime-local value
      const d = new Date(task.dueDate);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      dueDate = d.toISOString().slice(0, 16);
    }
  });

  onDestroy(() => {
    unsub();
    unsubCategories();
  });

  function saveChanges() {
    if (!task) return;
    const updated = {
      ...task,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
    };
    tasksStore.updateTask(task.id, updated);
    goto('/');
  }

  function remove() {
    if (!task) return;
    tasksStore.deleteTask(task.id);
    goto('/');
  }
</script>

{#if task}
  <article>
    <h2>Task Details</h2>
    <form on:submit|preventDefault={saveChanges} class="edit-form">
      <div class="field">
        <label for="title">Title</label>
        <input id="title" bind:value={task.title} required />
      </div>

      <div class="field">
        <label for="description">Description</label>
        <textarea id="description" bind:value={task.description} rows="3"></textarea>
      </div>

      <div class="field">
        <label for="category">Category</label>
        <select id="category" bind:value={task.category} required>
          {#each categories as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>

      <div class="field">
        <label for="priority">Priority</label>
        <select id="priority" bind:value={task.priority}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div class="field">
        <label for="due">Due Date</label>
        <input id="due" type="datetime-local" bind:value={dueDate} />
      </div>

      <div class="field">
        <label>
          <input type="checkbox" bind:checked={task.isComplete} />
          Complete
        </label>
      </div>

      <div class="actions">
        <button type="submit">Save Changes</button>
        <button type="button" on:click={() => goto('/')}>Cancel</button>
        <button type="button" class="danger" on:click={remove}>Delete Task</button>
      </div>
    </form>
  </article>
{:else}
  <p>Task not found.</p>
{/if}

<style>
.edit-form{max-width:600px;margin:1rem auto;padding:1rem}
.field{margin-bottom:1rem}
.field label{display:block;margin-bottom:0.3rem;color:#333}
input[type="text"],input[type="datetime-local"],textarea,select{
  display:block;width:100%;padding:0.5rem;
  border:1px solid #ddd;border-radius:4px;
  font-size:1rem;
}
.actions{display:flex;gap:0.5rem;margin-top:1.5rem}
button{padding:0.5rem 1rem;border-radius:4px;border:1px solid #ddd;background:#fff;cursor:pointer}
button[type="submit"]{background:#4f46e5;color:#fff;border:none}
button.danger{background:#fee2e2;color:#dc2626;border-color:#fecaca}
</style>
