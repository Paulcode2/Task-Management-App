<script lang="ts">
  import categoriesStore from '$lib/stores/categoryStore';
  import { get } from 'svelte/store';

  let categories: string[] = [];
  const unsub = categoriesStore.subscribe((v) => (categories = v));

  let newCategory = '';

  function normalizeCategory(category: string): string {
    const s = (category || '').trim();
    const lower = s.toLowerCase();
    if (lower === 'personal projects' || lower === 'personal project') return 'Personal Projects';
    if (lower === 'freelance jobs' || lower === 'freelance job') return 'Freelance Jobs';
    // title-case default
    return s
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }


  function add() {
    const c = normalizeCategory(newCategory.trim());
    if (!c) return;
    categoriesStore.add(c);
    newCategory = '';
  }

  function remove(c: string) {
    categoriesStore.remove(c);
  }

  $: current = categories;

  // cleanup
  import { onDestroy } from 'svelte';
  onDestroy(() => unsub());
</script>

<section>
  <h2>Manage Categories</h2>
  <div class="row">
    <input placeholder="New category" bind:value={newCategory} />
    <button on:click={add}>Add</button>
  </div>

  <ul>
    {#each categories as c}
      <li>{c} <button aria-label={`Remove ${c}`} on:click={() => remove(c)}>Remove</button></li>
    {/each}
  </ul>
</section>

<style>
.row{display:flex;gap:0.5rem;margin-bottom:1rem}
input{flex:1;padding:0.4rem;border:1px solid #ddd;border-radius:4px}
button{padding:0.4rem 0.6rem}
ul{list-style:none;padding:0}
li{padding:0.3rem 0}
</style>
