/**
 * Storage adapter facade choosing IndexedDB with fallback to localStorage.
 */
import { indexedDbAdapter } from "./indexedDb";
import { localStorageAdapter } from "./localStorage";

// Select adapter
const adapter = (typeof window !== "undefined" && indexedDbAdapter.isAvailable())
  ? indexedDbAdapter
  : localStorageAdapter;

// PUBLIC_INTERFACE
export const storage = {
  /**
   * Initialize the underlying storage.
   */
  async init() {
    if (adapter.isAvailable && !adapter.isAvailable()) {
      // If selected adapter not available (edge), fallback to localStorage
      return localStorageAdapter.init();
    }
    return adapter.init();
  },

  /**
   * Get all residents.
   * @returns {Promise<Array>}
   */
  async getAll() {
    return adapter.getAll();
  },

  /**
   * Create or update a resident.
   * @param {Object} resident
   * @returns {Promise<Object>}
   */
  async upsert(resident) {
    return adapter.upsert(resident);
  },

  /**
   * Remove resident by id.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async remove(id) {
    return adapter.remove(id);
  },

  /**
   * Clear all residents.
   * @returns {Promise<boolean>}
   */
  async clear() {
    return adapter.clear();
  },

  /**
   * Export all residents as JSON string.
   * @returns {Promise<string>}
   */
  async export() {
    return adapter.export();
  },

  /**
   * Import residents from JSON string, replacing existing.
   * @param {string} jsonString
   * @returns {Promise<boolean>}
   */
  async import(jsonString) {
    return adapter.import(jsonString);
  },

  /**
   * Seed meta flag helpers.
   */
  async getMeta(key) {
    return adapter.getMeta(key);
  },

  async setMeta(key, value) {
    return adapter.setMeta(key, value);
  },
};
