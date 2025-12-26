/**
 * PUBLIC_INTERFACE
 * Generates a short, reasonably unique id string.
 */
export function generateId(prefix = "res") {
  /** Generate an id using time and random, base36 for compactness. */
  const rand = Math.random().toString(36).slice(2, 7);
  const ts = Date.now().toString(36);
  return `${prefix}_${ts}${rand}`;
}
