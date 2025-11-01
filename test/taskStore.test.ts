import { describe, it, expect, beforeEach } from "vitest";
import tasksStore, {
  quadrants,
  completionPercentage,
  selectedCategory,
  type Task,
} from "$lib/stores/taskStore";
import { get } from "svelte/store";

function makeTask(
  overrides: Partial<Task> = {}
): Omit<Task, "id" | "createdAt"> {
  const now = new Date();
  return {
    title: "Test",
    description: "desc",
    isComplete: false,
    dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24h => urgent
    priority: "High",
    category: "Work",
    ...overrides,
  };
}

beforeEach(() => {
  // reset store
  tasksStore.replaceAll([] as Task[]);
  selectedCategory.set(null);
});

describe("tasksStore basic CRUD and matrix", () => {
  it("normalizes category names on task creation", () => {
    const t1 = tasksStore.add(makeTask({ category: "Personal Projects" }));
    const t2 = tasksStore.add(makeTask({ category: "Freelance Jobs" }));
    const tasks = get(tasksStore) as Task[];
    expect(tasks.find((x: Task) => x.id === t1.id)?.category).toBe(
      "Personal projects"
    );
    expect(tasks.find((x: Task) => x.id === t2.id)?.category).toBe(
      "Freelance jobs"
    );
  });

  it("normalizes category names on task updates", () => {
    const t = tasksStore.add(makeTask({ category: "Work" }));
    tasksStore.updateTask(t.id, { category: "Personal Projects" });
    const tasks = get(tasksStore) as Task[];
    const updated = tasks.find((x: Task) => x.id === t.id);
    expect(updated?.category).toBe("Personal projects");
  });

  it("adds a task and places it into the important & urgent quadrant", () => {
    const t = tasksStore.add(makeTask());
    const q = get(quadrants);
    expect(q.importantUrgent.find((x: Task) => x.id === t.id)).toBeTruthy();
  });

  it("calculates completion percentage for category", () => {
    const a = tasksStore.add(makeTask({ category: "A" }));
    const b = tasksStore.add(makeTask({ category: "A", isComplete: true }));
    const c = tasksStore.add(makeTask({ category: "B", isComplete: true }));

    selectedCategory.set("A");
    const pct = get(completionPercentage);
    expect(pct).toBe(50);
  });

  it("optimistic toggle flips completion immediately", () => {
    const t = tasksStore.add(makeTask({ isComplete: false }));
    tasksStore.toggleComplete(t.id);
    const list = get(tasksStore) as Task[];
    const found = list.find((x: Task) => x.id === t.id);
    expect(found?.isComplete).toBe(true);
  });
});
