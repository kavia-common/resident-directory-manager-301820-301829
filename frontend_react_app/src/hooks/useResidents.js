import { useCallback, useEffect, useMemo, useState } from "react";
import { storage } from "../storage";
import { seedResidents } from "../seed/seedData";
import { generateId } from "../utils/id";

/**
 * PUBLIC_INTERFACE
 * Hook to manage resident data, filters, and persistence.
 */
export function useResidents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", apt: "", onlyWithPhone: false });

  // init + seed
  useEffect(() => {
    (async () => {
      await storage.init();
      const seeded = await storage.getMeta("seeded");
      if (!seeded) {
        // seed on first run
        for (const r of seedResidents) {
          await storage.upsert(r);
        }
        await storage.setMeta("seeded", true);
      }
      const all = await storage.getAll();
      setResidents(all);
      setLoading(false);
    })();
  }, []);

  const refresh = useCallback(async () => {
    const all = await storage.getAll();
    setResidents(all);
  }, []);

  const createResident = useCallback(async (payload) => {
    const toSave = { ...payload, id: generateId("res") };
    await storage.upsert(toSave);
    await refresh();
    return toSave;
  }, [refresh]);

  const updateResident = useCallback(async (id, patch) => {
    const existing = residents.find(r => r.id === id);
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    await storage.upsert(updated);
    await refresh();
    return updated;
  }, [residents, refresh]);

  const deleteResident = useCallback(async (id) => {
    await storage.remove(id);
    await refresh();
  }, [refresh]);

  const clearAll = useCallback(async () => {
    await storage.clear();
    await storage.setMeta("seeded", false);
    await refresh();
  }, [refresh]);

  const exportData = useCallback(async () => {
    return storage.export();
  }, []);

  const importData = useCallback(async (jsonString) => {
    await storage.import(jsonString);
    await storage.setMeta("seeded", true);
    await refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const s = filters.search.trim().toLowerCase();
    const apt = filters.apt.trim();
    return residents.filter(r => {
      const matchesSearch = !s || [r.name, r.apartment, r.email, r.phone].filter(Boolean).some(v => String(v).toLowerCase().includes(s));
      const matchesApt = !apt || String(r.apartment || "").toLowerCase().includes(apt.toLowerCase());
      const withPhone = !filters.onlyWithPhone || Boolean(r.phone);
      return matchesSearch && matchesApt && withPhone;
    });
  }, [residents, filters]);

  return {
    residents,
    filtered,
    loading,
    filters,
    setFilters,
    createResident,
    updateResident,
    deleteResident,
    clearAll,
    exportData,
    importData,
    refresh,
  };
}
