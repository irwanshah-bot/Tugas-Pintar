'use client';

import { useEffect, useMemo, useState } from 'react';
import { Building2, ChevronDown, Home, Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';

const starterResidents = [
  { id: 1, name: 'Aiman Hakim', unit: 'A-03-08', block: 'A', occupants: 3, status: 'Pemilik' },
  { id: 2, name: 'Siti Nurhaliza', unit: 'A-08-12', block: 'A', occupants: 2, status: 'Pemilik' },
  { id: 3, name: 'Daniel Lim', unit: 'B-05-03', block: 'B', occupants: 4, status: 'Penyewa' },
  { id: 4, name: 'Nur Aisyah', unit: 'B-11-09', block: 'B', occupants: 1, status: 'Pemilik' },
  { id: 5, name: 'Raj Kumar', unit: 'C-02-05', block: 'C', occupants: 3, status: 'Penyewa' },
  { id: 6, name: 'Farah & Hakim', unit: 'C-07-11', block: 'C', occupants: 4, status: 'Pemilik' },
];

const emptyForm = { name: '', unit: '', block: 'A', occupants: 1, status: 'Pemilik' };

export default function Home() {
  const [residents, setResidents] = useState(starterResidents);
  const [query, setQuery] = useState('');
  const [block, setBlock] = useState('Semua blok');
  const [status, setStatus] = useState('Semua status');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const saved = localStorage.getItem('senarai-penduduk-apartment');
    if (saved) setResidents(JSON.parse(saved));
  }, []);

  useEffect(() => localStorage.setItem('senarai-penduduk-apartment', JSON.stringify(residents)), [residents]);

  const filtered = useMemo(() => residents.filter((resident) => {
    const text = query.toLowerCase();
    const matchesQuery = !text || resident.name.toLowerCase().includes(text) || resident.unit.toLowerCase().includes(text);
    const matchesBlock = block === 'Semua blok' || resident.block === block;
    const matchesStatus = status === 'Semua status' || resident.status === status;
    return matchesQuery && matchesBlock && matchesStatus;
  }), [residents, query, block, status]);

  const totalOccupants = residents.reduce((sum, resident) => sum + Number(resident.occupants || 0), 0);
  const owners = residents.filter((resident) => resident.status === 'Pemilik').length;

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setModal(true);
  }

  function openEdit(resident) {
    setEditing(resident.id);
    setForm({ ...resident });
    setModal(true);
  }

  function saveResident(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.unit.trim()) return;
    const clean = { ...form, name: form.name.trim(), unit: form.unit.trim().toUpperCase(), occupants: Number(form.occupants) || 1 };
    if (editing) setResidents((current) => current.map((resident) => resident.id === editing ? { ...resident, ...clean } : resident));
    else setResidents((current) => [{ ...clean, id: Date.now() }, ...current]);
    setModal(false);
  }

  function removeResident(id) {
    if (window.confirm('Padam rekod penduduk ini?')) setResidents((current) => current.filter((resident) => resident.id !== id));
  }

  return (
    <main className="shell">
      <div className="topbar">
        <div className="brand"><span className="brand-mark"><Building2 size={19} /></span><span>JiranKita</span></div>
        <div className="top-note">PANEL PENGURUSAN KEJIRANAN</div>
      </div>

      <section className="hero">
        <div>
          <div className="eyebrow">APARTMENT COMMUNITY · 2026</div>
          <h1>Senarai Penduduk<br /><span>JiranKita.</span></h1>
          <p>Semak siapa tinggal di blok mana, urus rekod unit, dan kekalkan komuniti apartment lebih tersusun.</p>
        </div>
        <button className="primary" onClick={openAdd}><Plus size={18} /> Tambah penduduk</button>
      </section>

      <section className="stats">
        <div className="stat"><span className="stat-icon"><Users size={19} /></span><div><strong>{residents.length}</strong><small>Rekod unit</small></div></div>
        <div className="stat"><span className="stat-icon"><Home size={19} /></span><div><strong>{totalOccupants}</strong><small>Jumlah penghuni</small></div></div>
        <div className="stat"><span className="stat-icon"><Building2 size={19} /></span><div><strong>{new Set(residents.map((r) => r.block)).size}</strong><small>Blok aktif</small></div></div>
        <div className="stat"><span className="stat-icon">✓</span><div><strong>{owners}</strong><small>Pemilik berdaftar</small></div></div>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div><h2>Direktori penduduk</h2><p>{filtered.length} rekod dipaparkan</p></div>
          <div className="controls">
            <label className="search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama atau unit..." /></label>
            <label className="select"><select value={block} onChange={(e) => setBlock(e.target.value)}><option>Semua blok</option><option>A</option><option>B</option><option>C</option></select><ChevronDown size={15} /></label>
            <label className="select"><select value={status} onChange={(e) => setStatus(e.target.value)}><option>Semua status</option><option>Pemilik</option><option>Penyewa</option></select><ChevronDown size={15} /></label>
          </div>
        </div>

        <div className="table-wrap">
          <table><thead><tr><th>PENDUDUK</th><th>UNIT</th><th>BLOK</th><th>PENGHUNI</th><th>STATUS</th><th></th></tr></thead>
            <tbody>{filtered.length ? filtered.map((resident) => (
              <tr key={resident.id}>
                <td><div className="resident"><span className="avatar">{resident.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span><strong>{resident.name}</strong></div></td>
                <td><span className="unit">{resident.unit}</span></td>
                <td><span className="block-pill">Blok {resident.block}</span></td>
                <td>{resident.occupants} orang</td>
                <td><span className={`status ${resident.status === 'Pemilik' ? 'owner' : 'tenant'}`}>{resident.status}</span></td>
                <td><div className="actions"><button onClick={() => openEdit(resident)} aria-label="Edit"><Pencil size={16} /></button><button onClick={() => removeResident(resident.id)} aria-label="Padam"><Trash2 size={16} /></button></div></td>
              </tr>
            )) : <tr><td colSpan="6"><div className="empty">Tiada rekod sepadan dengan carian.</div></td></tr>}</tbody>
          </table>
        </div>
        <div className="privacy">🔒 Data demo disimpan pada pelayar ini sahaja. Untuk penggunaan sebenar, sambungkan pangkalan data + log masuk pengurusan.</div>
      </section>

      <footer><span>JIRANKITA / DIREKTORI KOMUNITI</span><span>BUILT FOR BETTER NEIGHBOURS</span></footer>

      {modal && <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setModal(false)}><form className="modal" onSubmit={saveResident}>
        <div className="modal-head"><div><div className="eyebrow">REKOD PENDUDUK</div><h2>{editing ? 'Kemaskini penduduk' : 'Tambah penduduk'}</h2></div><button type="button" onClick={() => setModal(false)}><X size={20} /></button></div>
        <label>Nama penuh<input autoFocus required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Ahmad Razak" /></label>
        <div className="form-grid"><label>No. unit<input required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="A-03-08" /></label><label>Blok<select value={form.block} onChange={(e) => setForm({ ...form, block: e.target.value })}><option>A</option><option>B</option><option>C</option></select></label></div>
        <div className="form-grid"><label>Jumlah penghuni<input type="number" min="1" max="20" value={form.occupants} onChange={(e) => setForm({ ...form, occupants: e.target.value })} /></label><label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Pemilik</option><option>Penyewa</option></select></label></div>
        <button className="primary full" type="submit">{editing ? 'Simpan perubahan' : 'Simpan penduduk'}</button>
      </form></div>}
    </main>
  );
}
