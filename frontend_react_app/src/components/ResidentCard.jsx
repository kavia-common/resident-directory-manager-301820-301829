import React from "react";

// PUBLIC_INTERFACE
export function ResidentCard({ resident, onEdit, onDelete }) {
  const initials = resident.name?.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase() || "RD";

  return (
    <div className="card" role="group" aria-label={`Resident ${resident.name || initials}`}>
      <div className="card-media" aria-hidden={!resident.photo}>
        {resident.photo ? (
          <img src={resident.photo} alt={`${resident.name}'s photo`} />
        ) : (
          <div className="placeholder" aria-hidden>{initials}</div>
        )}
      </div>
      <div className="card-body">
        <div className="card-title">{resident.name || "Unnamed"}</div>
        <div className="card-sub">Apt {resident.apartment || "—"}</div>
        <div className="badge">
          <span aria-hidden>📞</span>
          <span>{resident.phone || "No phone"}</span>
        </div>
        <div className="badge">
          <span aria-hidden>✉️</span>
          <span>{resident.email || "No email"}</span>
        </div>
        <div className="card-actions" role="toolbar" aria-label="Card actions">
          <button className="btn ghost" onClick={() => onEdit(resident)} aria-label={`Edit ${resident.name}`}>Edit</button>
          <button className="btn danger" onClick={() => onDelete(resident)} aria-label={`Delete ${resident.name}`}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function ResidentGrid({ residents, onEdit, onDelete }) {
  if (!residents.length) {
    return <div className="empty" role="status">No residents found.</div>;
  }
  return (
    <div className="grid" role="list">
      {residents.map(r => (
        <div role="listitem" key={r.id}>
          <ResidentCard resident={r} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
