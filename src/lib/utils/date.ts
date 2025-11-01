export type Priority = "High" | "Medium" | "Low";

/**
 * Returns true if the given date is within the next `hours` hours from now.
 */
export function isWithinHours(date: Date | string, hours = 48): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return false;
  const now = Date.now();
  const ms = hours * 60 * 60 * 1000;
  return d.getTime() - now <= ms && d.getTime() >= now - 5 * 60 * 1000; // allow a small past window
}

export function formatShortDate(date?: Date | string): string {
  if (!date) return "No due date";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "Invalid date";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isImportant(priority: Priority): boolean {
  // Define importance: only High is considered Important for the Eisenhower matrix.
  return priority === "High";
}
