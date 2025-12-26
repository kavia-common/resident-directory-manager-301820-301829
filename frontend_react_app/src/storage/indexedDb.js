/**
 * IndexedDB wrapper for residents.
 * The database name is 'residentDirectoryDB', store 'residents'.
 */
const DB_NAME = "residentDirectoryDB";
const STORE = "residents";
const META = "meta";
const VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(META)) {
        db.createObjectStore(META, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(mode, storeName = STORE) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([storeName], mode);
    const store = tx.objectStore(storeName);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    resolve({ tx, store, db });
  });
}

// PUBLIC_INTERFACE
export const indexedDbAdapter = {
  /** Return true if IndexedDB is available. */
  isAvailable() {
    try {
      return typeof indexedDB !== "undefined";
    } catch {
      return false;
    }
  },

  /** Initialize database (noop but triggers open/upgrade). */
  async init() {
    await openDb();
  },

  /** Create or update a resident. */
  async upsert(resident) {
    const { tx, store } = await withStore("readwrite");
    store.put(resident);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(resident);
      tx.onerror = () => reject(tx.error);
    });
  },

  /** Get all residents as array. */
  async getAll() {
    const { store } = await withStore("readonly");
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  /** Delete resident by id. */
  async remove(id) {
    const { tx, store } = await withStore("readwrite");
    store.delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },

  /** Clear all residents. */
  async clear() {
    const { tx, store } = await withStore("readwrite");
    store.clear();
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },

  /** Export all residents as JSON string. */
  async export() {
    const all = await this.getAll();
    return JSON.stringify(all);
  },

  /** Import from JSON string, replace all. */
  async import(jsonString) {
    let data = [];
    try { data = JSON.parse(jsonString) || []; } catch { data = []; }
    const { tx, store } = await withStore("readwrite");
    store.clear();
    data.forEach(rec => store.put(rec));
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },

  /** Meta seed flag helpers */
  async getMeta(key) {
    const { store } = await withStore("readonly", META);
    return new Promise((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : undefined);
      req.onerror = () => reject(req.error);
    });
  },

  async setMeta(key, value) {
    const { tx, store } = await withStore("readwrite", META);
    store.put({ key, value });
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },
};
