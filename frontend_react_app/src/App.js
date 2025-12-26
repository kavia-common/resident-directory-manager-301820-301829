import React, { useMemo, useState } from "react";
import "./theme.css";
import { TopNav } from "./components/TopNav";
import { Sidebar } from "./components/Sidebar";
import { ResidentGrid } from "./components/ResidentCard";
import { ResidentModal } from "./components/ResidentModal";
import { useResidents } from "./hooks/useResidents";

// PUBLIC_INTERFACE
function App() {
  const {
    filtered,
    residents,
    loading,
    filters,
    setFilters,
    createResident,
    updateResident,
    deleteResident,
    clearAll,
    exportData,
    importData,
  } = useResidents();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const title = useMemo(() => {
    const count = filtered.length;
    return count ? `Residents (${count})` : "Residents";
  }, [filtered]);

  const handleAdd = () => { setEditing(null); setModalOpen(true); };
  const handleEdit = (r) => { setEditing(r); setModalOpen(true); };
  const handleSubmit = async (form) => {
    if (editing) await updateResident(editing.id, form);
    else await createResident(form);
    setModalOpen(false);
  };
  const handleDelete = (r) => {
    if (window.confirm(`Delete ${r.name || "this resident"}? This cannot be undone.`)) {
      deleteResident(r.id);
    }
  };

  const handleExport = async () => {
    const json = await exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "residents.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "application/json";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      await importData(text);
      alert("Import complete.");
    };
    input.click();
  };

  return (
    <div className="app-shell">
      <TopNav
        onAdd={handleAdd}
        onExport={handleExport}
        onImport={handleImport}
        onClear={async ()=>{ if (window.confirm("Clear all demo data?")) await clearAll(); }}
      />
      <main className="content">
        <Sidebar filters={filters} onChange={setFilters} />
        <section className="panel" aria-live="polite">
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12}}>
            <h2 style={{margin:0}}>{title}</h2>
            <div className="small">{loading ? "Loading..." : `${residents.length} total`}</div>
          </div>
          <ResidentGrid residents={filtered} onEdit={handleEdit} onDelete={handleDelete} />
        </section>
      </main>

      <ResidentModal
        open={modalOpen}
        initial={editing}
        onClose={()=>setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
