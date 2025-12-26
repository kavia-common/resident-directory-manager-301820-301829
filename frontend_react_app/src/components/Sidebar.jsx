import React from "react";

// PUBLIC_INTERFACE
export function Sidebar({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className="sidebar" aria-label="Filters">
      <h3>Filters</h3>
      <div className="field">
        <label className="label" htmlFor="search">Search</label>
        <input
          id="search"
          className="input"
          type="search"
          placeholder="Search name, apt, email, phone"
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>
      <div className="field">
        <label className="label" htmlFor="apt">Apartment</label>
        <input
          id="apt"
          className="input"
          type="text"
          placeholder="e.g. 204"
          value={filters.apt}
          onChange={(e) => update("apt", e.target.value)}
        />
      </div>
      <div className="field">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={filters.onlyWithPhone}
            onChange={(e) => update("onlyWithPhone", e.target.checked)}
          />
          Only with phone
        </label>
      </div>
      <div className="hr" />
      <div className="small">Tip: Use Export to backup your data locally and Import to restore.</div>
    </aside>
  );
}
