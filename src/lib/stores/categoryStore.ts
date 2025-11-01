import { writable } from "svelte/store";
import {
  readFromLocalStorage,
  createDebouncedWriter,
} from "$lib/utils/storage";

const KEY = "task_manager.categories.v1";

const persisted: string[] = readFromLocalStorage<string[]>(KEY, [
  "Work",
  "Personal Projects",
  "Freelance Jobs",
]);

const { subscribe, set, update } = writable<string[]>(persisted);

const save = createDebouncedWriter(KEY, 300);
subscribe((v) => save(v));

export const categoriesStore = {
  subscribe,
  add(category: string) {
    update((list) => (list.includes(category) ? list : [...list, category]));
  },
  remove(category: string) {
    update((list) => list.filter((c) => c !== category));
  },
  replace(list: string[]) {
    set(list);
  },
};

export default categoriesStore;
