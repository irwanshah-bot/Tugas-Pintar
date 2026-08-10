'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Circle, Plus, Trash2, Music2, Radio } from 'lucide-react';

const starter = [
  { id: 1, text: 'Semak tugasan hari ini', done: false },
  { id: 2, text: 'Siapkan laporan', done: false },
  { id: 3, text: 'Hantar emel penting', done: true },
];

export default function Home() {
  const [tasks, setTasks] = useState(starter); const [text, setText] = useState(''); const [filter, setFilter] = useState('all');
  useEffect(() => { const saved = localStorage.getItem('tugas-pintar'); if (saved) setTasks(JSON.parse(saved)); }, []);
  useEffect(() => localStorage.setItem('tugas-pintar', JSON.stringify(tasks)), [tasks]);
  function addTask(e) { e.preventDefault(); const value=text.trim(); if(!value)return; setTasks([{id:Date.now(),text:value,done:false},...tasks]); setText(''); }
  function toggle(id){setTasks(tasks.map(t=>t.id===id?{...t,done:!t.done}:t));} function remove(id){setTasks(tasks.filter(t=>t.id!==id));}
  const visible=useMemo(()=>tasks.filter(t=>filter==='all'||(filter==='active'?!t.done:t.done)),[tasks,filter]); const remaining=tasks.filter(t=>!t.done).length;
  return <main className="page"><div className="cassette">SIDE A<br/><b>SARJI FM</b><br/>CLASSIC POP • HIP HOP</div><section className="card">
    <header><div><div className="brand"><span className="badge"><Radio size={15}/></span> SARJI FM <span className="stereo">STEREO</span></div><h1>Kerja siap,<br/><em>jiwa pun steady.</em></h1><p className="muted">Klasik pop bertemu hip hop — tugasan kita settle satu-satu.</p></div><div className="count"><strong>{remaining}</strong><span>belum settle</span></div></header>
    <div className="ticker"><Music2 size={14}/> NOW PLAYING — FOKUS DULU, CHILL KEMUDIAN <span>♪ ♫ ♪</span></div>
    <form onSubmit={addTask} className="add-form"><input value={text} onChange={e=>setText(e.target.value)} placeholder="Apa plan hari ni? Tulis sini..."/><button type="submit"><Plus size={18}/> TAMBAH</button></form>
    <nav className="filters">{[['all','SEMUA'],['active','BELUM SETTLE'],['done','SETTLE']].map(([key,label])=><button key={key} className={filter===key?'selected':''} onClick={()=>setFilter(key)}>{label}</button>)}</nav>
    <div className="tasks">{visible.length===0?<div className="empty">Semua settle. Respect. ✌</div>:visible.map(task=><article className={`task ${task.done?'done':''}`} key={task.id}><button className="check" onClick={()=>toggle(task.id)}>{task.done?<Check size={17}/>:<Circle size={19}/>}</button><span>{task.text}</span><button className="delete" onClick={()=>remove(task.id)}><Trash2 size={17}/></button></article>)}</div>
    <footer><span>♪ KLASIK DI HATI · HIP HOP DI JALAN</span><span>{tasks.length} TRACKS</span></footer>
  </section></main>;
}
