// This file implements a strongly-typed Task store with localStorage persistence, debounced saves, quadrants derived store, completionPercentage derived store, and optimistic toggle.
import { writable, derived, get, type Writable } from "svelte/store";
import type { Priority } from "$lib/utils/date";
import { isWithinHours, isImportant } from "$lib/utils/date";
import {
  readFromLocalStorage,
  createDebouncedWriter,
} from "$lib/utils/storage";
export type Task = {
  id: string;
  title: string;
  description?: string;
  isComplete: boolean;
  dueDate?: string;
  priority: Priority;
  category: string;
  createdAt: string;
};
const STORAGE_KEY = "task_manager.tasks.v1";
const persisted: Task[] = readFromLocalStorage<Task[]>(STORAGE_KEY, []);
// Migrate any existing tasks to use normalized category names
const normalizedTasks = persisted.map((task) => ({
  ...task,
  category: normalizeCategory(task.category),
}));

const { subscribe, set, update } = writable<Task[]>(normalizedTasks);
// debounce writes to localStorage to avoid thrashing on bulk updates
const save = createDebouncedWriter(STORAGE_KEY, 300);
subscribe((v) => save(v));
function generateId() {
  return Math.random().toString(36).slice(2, 9);
}
export const selectedCategory: Writable<string | null> = writable(null);
// Helper to normalize category names
function normalizeCategory(category: string): string {
  const key = (category || "").trim();
  const lower = key.toLowerCase();
  const categoryMap: Record<string, string> = {
    // map common existing variants to canonical labels (lowercased keys)
    "personal projects": "Personal Projects",
    "freelance jobs": "Freelance Jobs",
  };
  if (categoryMap[lower]) return categoryMap[lower];
  // default: title-case each word
  return key
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const tasksStore = {
  subscribe,
  add(task: Omit<Task, "id" | "createdAt">) {
    const t: Task = {
      ...task,
      category: normalizeCategory(task.category),
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    update((list) => [t, ...list]);
    return t;
  },
  updateTask(id: string, patch: Partial<Task>) {
    const normalizedPatch = patch.category
      ? { ...patch, category: normalizeCategory(patch.category) }
      : patch;
    update((list) =>
      list.map((t) => (t.id === id ? { ...t, ...normalizedPatch } : t))
    );
  },
  deleteTask(id: string) {
    update((list) => list.filter((t) => t.id !== id));
  },
  getById(id: string) {
    const list = get({ subscribe });
    return list.find((t) => t.id === id) ?? null;
  },
  // Optimistic toggle: update immediately then attempt to persist (localStorage persist is synchronous here).
  toggleComplete(id: string) {
    let previous: Task | null = null;
    update((list) =>
      list.map((t) => {
        if (t.id === id) {
          previous = { ...t };
          return { ...t, isComplete: !t.isComplete };
        }
        return t;
      })
    );
    // localStorage write happens via subscription debounced writer; in case of need to revert, we could implement revert logic.
    return previous;
  },
  replaceAll(list: Task[]) {
    set(list);
  },
};
// Derived store: quadrants based on urgency (within 48h) and importance (priority)
export const quadrants = derived(
  [tasksStore, selectedCategory],
  ([$tasks, $category]) => {
    const q = {
      importantUrgent: [] as Task[],
      importantNotUrgent: [] as Task[],
      notImportantUrgent: [] as Task[],
      notImportantNotUrgent: [] as Task[],
    };
    // Filter by category first if one is selected
    const filtered = $category
      ? $tasks.filter((t) => t.category === $category)
      : $tasks;
    for (const t of filtered) {
      const urgent = !!t.dueDate && isWithinHours(new Date(t.dueDate), 48);
      const important = isImportant(t.priority);
      if (important && urgent) q.importantUrgent.push(t);
      else if (important && !urgent) q.importantNotUrgent.push(t);
      else if (!important && urgent) q.notImportantUrgent.push(t);
      else q.notImportantNotUrgent.push(t);
    }
    // sort by due date then priority
    const sortFn = (a: Task, b: Task) => {
      const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return da - db;
    };
    return {
      importantUrgent: q.importantUrgent.sort(sortFn),
      importantNotUrgent: q.importantNotUrgent.sort(sortFn),
      notImportantUrgent: q.notImportantUrgent.sort(sortFn),
      notImportantNotUrgent: q.notImportantNotUrgent.sort(sortFn),
    };
  }
);
// Derived store for completion percentage for the currently selected category (or all if none)
export const completionPercentage = derived(
  [tasksStore, selectedCategory],
  ([$tasks, $category]) => {
    const filtered = $category
      ? $tasks.filter((t) => t.category === $category)
      : $tasks;
    if (filtered.length === 0) return 0;
    const completed = filtered.filter((t) => t.isComplete).length;
    return Math.round((completed / filtered.length) * 100);
  }
);
export default tasksStore;
