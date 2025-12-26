import React, { useEffect, useRef, useState } from "react";
import { captureFromCamera, fileToDataUrl } from "../utils/image";

const emptyForm = { name: "", apartment: "", phone: "", email: "", notes: "", photo: "" };

// PUBLIC_INTERFACE
export function ResidentModal({ open, initial, onClose, onSubmit }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [errors, setErrors] = useState({});
  const dlgRef = useRef();

  useEffect(() => {
    setForm(initial || emptyForm);
    setErrors({});
  }, [initial, open]);

  useEffect(() => {
    if (open && dlgRef.current) {
      // Focus first input when modal opens
      const input = dlgRef.current.querySelector("input, select, textarea, button");
      input?.focus();
    }
  }, [open]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.apartment.trim()) e.apartment = "Apartment is required.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email.";
    if (form.phone && !/^[\d\s()+-]{7,}$/.test(form.phone)) e.phone = "Invalid phone.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFile = async (file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm(prev => ({ ...prev, photo: dataUrl }));
  };

  const handleCamera = async () => {
    try {
      const dataUrl = await captureFromCamera();
      setForm(prev => ({ ...prev, photo: dataUrl }));
    } catch (err) {
      alert("Camera not available or permission denied.");
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modalTitle" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" ref={dlgRef}>
        <div className="modal-header">
          <div className="modal-title" id="modalTitle">{initial ? "Edit Resident" : "Add Resident"}</div>
          <button className="btn ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="field">
              <label className="label" htmlFor="name">Name</label>
              <input id="name" className="input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined}/>
              {errors.name && <div id="err-name" className="small" style={{color: "var(--color-error)"}}>{errors.name}</div>}
            </div>
            <div className="field">
              <label className="label" htmlFor="apt">Apartment</label>
              <input id="apt" className="input" value={form.apartment} onChange={(e)=>setForm({...form, apartment:e.target.value})} aria-invalid={!!errors.apartment} aria-describedby={errors.apartment ? "err-apt" : undefined}/>
              {errors.apartment && <div id="err-apt" className="small" style={{color: "var(--color-error)"}}>{errors.apartment}</div>}
            </div>
            <div className="field">
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" className="input" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "err-phone" : undefined}/>
              {errors.phone && <div id="err-phone" className="small" style={{color: "var(--color-error)"}}>{errors.phone}</div>}
            </div>
            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <input id="email" className="input" type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined}/>
              {errors.email && <div id="err-email" className="small" style={{color: "var(--color-error)"}}>{errors.email}</div>}
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="notes">Notes</label>
            <textarea id="notes" className="textarea" value={form.notes || ""} onChange={(e)=>setForm({...form, notes:e.target.value})}/>
          </div>
          <div className="field">
            <label className="label">Photo</label>
            <div className="toolbar">
              <label className="btn ghost" aria-label="Upload photo">
                Upload
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e)=>handleFile(e.target.files?.[0])}/>
              </label>
              <button className="btn secondary" onClick={handleCamera} aria-label="Capture from camera">Use Camera</button>
              {form.photo && <button className="btn ghost" onClick={()=>setForm({...form, photo:""})} aria-label="Remove photo">Remove</button>}
            </div>
            {form.photo && <div className="hr" />}
            {form.photo && (
              <div style={{display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px", alignItems: "center"}}>
                <img src={form.photo} alt="Preview" style={{width:120, height:90, objectFit:"cover", borderRadius:8, border:"1px solid var(--color-border)"}} />
                <div className="small mono" style={{wordBreak:"break-all"}}>{(form.photo || "").slice(0, 96)}{form.photo.length>96 ? "…" : ""}</div>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={()=>{
            if(!validate()) return;
            onSubmit(form);
          }}>{initial ? "Save" : "Add"}</button>
        </div>
      </div>
    </div>
  );
}
