/**
 * LocalStorage fallback adapter. Stores residents under 'residentsList'.
 */
const KEY = "residentsList";
const META = "residentsMeta";

// PUBLIC_INTERFACE
export const localStorageAdapter = {
  isAvailable() {
    try {
      const t = "__t__";
      window.localStorage.setItem(t, "1");
      window.localStorage.removeItem(t);
      return true;
    } catch {
      return false;
    }
  },

  async init() {
    if (!window.localStorage.getItem(KEY)) {
      window.localStorage.setItem(KEY, JSON.stringify([]));
    }
  },

  async upsert(resident) {
    const list = await this.getAll();
    const idx = list.findIndex(r => r.id === resident.id);
    if (idx >= 0) list[idx] = resident;
    else list.push(resident);
    window.localStorage.setItem(KEY, JSON.stringify(list));
    return resident;
  },

  async getAll() {
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async remove(id) {
    const list = await this.getAll();
    const next = list.filter(r => r.id !== id);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    return true;
  },

  async clear() {
    window.localStorage.setItem(KEY, JSON.stringify([]));
    return true;
  },

  async export() {
    const all = await this.getAll();
    return JSON.stringify(all);
  },

  async import(jsonString) {
    let data = [];
    try { data = JSON.parse(jsonString) || []; } catch { data = []; }
    window.localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  },

  async getMeta(key) {
    try {
      const meta = JSON.parse(window.localStorage.getItem(META) || "{}");
      return meta[key];
    } catch {
      return undefined;
    }
  },

  async setMeta(key, value) {
    const meta = JSON.parse(window.localStorage.getItem(META) || "{}");
    meta[key] = value;
    window.localStorage.setItem(META, JSON.stringify(meta));
    return true;
  },
};
