<script lang="ts">
  import { onMount } from 'svelte';
  import { categoriesStore } from '$lib/stores/categoryStore';
  import { selectedCategory } from '$lib/stores/taskStore';
  import { get } from 'svelte/store';

  let categories: string[] = [];
  const unsub = categoriesStore.subscribe((v) => (categories = v));

  let localSelected = get(selectedCategory);

  function selectCategory(c: string | null) {
    selectedCategory.set(c);
    localSelected = c;
  }

  onMount(() => {
    return () => unsub();
  });
</script>

<div class="app-root">
  <aside class="sidebar" aria-label="Sidebar">
    <h2>Categories</h2>
    <ul>
      <li><button class:active={!localSelected} on:click={() => selectCategory(null)}>All</button></li>
      {#each categories as c}
        <li>
          <button class:active={localSelected === c} on:click={() => selectCategory(c)}>{c}</button>
        </li>
      {/each}
    </ul>
  </aside>

  <main class="main" aria-live="polite">
    <header class="header">
      <h1>Task Management Application</h1>
    </header>

    <slot />
  </main>
</div>

<style>
.app-root{display:flex;min-height:100vh;font-family:system-ui,Segoe UI,Roboto,Ubuntu}
.sidebar{width:200px;padding:1rem;border-right:1px solid #eee}
.sidebar h2{margin-top:0}
.sidebar ul{list-style:none;padding:0}
.sidebar button{display:block;width:100%;text-align:left;padding:0.4rem;border:none;background:none;cursor:pointer}
.sidebar button.active{font-weight:600}
.main{flex:1;padding:1rem}
.header{display:flex;align-items:center;justify-content:space-between}
</style>
