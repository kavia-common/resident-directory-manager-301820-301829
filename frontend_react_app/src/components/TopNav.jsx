import React from "react";

// PUBLIC_INTERFACE
export function TopNav({ onAdd, onExport, onImport, onClear }) {
  /** Accessible top navigation with brand and actions */
  return (
    <header className="topnav" role="banner">
      <div className="brand" aria-label="Resident Directory">
        <div className="brand-badge" aria-hidden>RD</div>
        <div>
          <div>Resident Directory</div>
          <div className="small mono">Local only</div>
        </div>
      </div>
      <div className="top-actions" role="toolbar" aria-label="Global actions">
        <button className="btn ghost" onClick={onImport} aria-label="Import residents from JSON">Import</button>
        <button className="btn ghost" onClick={onExport} aria-label="Export residents as JSON">Export</button>
        <button className="btn danger" onClick={onClear} aria-label="Clear demo data">Clear</button>
        <button className="btn icon" onClick={onAdd} aria-label="Add resident">
          <span aria-hidden>＋</span> Add
        </button>
      </div>
    </header>
  );
}
