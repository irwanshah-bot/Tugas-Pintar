'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Circle, Plus, Trash2, Sparkles, Zap } from 'lucide-react';

const starter = [
  { id: 1, text: 'Semak tugasan hari ini', done: false },
  { id: 2, text: 'Siapkan laporan', done: false },
  { id: 3, text: 'Hantar emel penting', done: true },
];

export default function Home() {
  const [tasks, setTasks] = useState(starter);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { const saved = localStorage.getItem('tugas-pintar'); if (saved) setTasks(JSON.parse(saved)); }, []);
  useEffect(() => localStorage.setItem('tugas-pintar', JSON.stringify(tasks)), [tasks]);

  function addTask(e) {
    e.preventDefault(); const value = text.trim(); if (!value) return;
    setTasks([{ id: Date.now(), text: value, done: false }, ...tasks]); setText('');
  }
  function toggle(id) { setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
  function remove(id) { setTasks(tasks.filter(t => t.id !== id)); }
  const visible = useMemo(() => tasks.filter(t => filter === 'all' || (filter === 'active' ? !t.done : t.done)), [tasks, filter]);
  const remaining = tasks.filter(t => !t.done).length;
  const completed = tasks.length - remaining;

  return (
    <main className="page">
      <div className="grain" />
      <section className="card">
        <header>
          <div>
            <div className="brand"><span className="logo"><Sparkles size={16}/></span> TUGAS PINTAR <span className="dot">●</span> v2</div>
            <h1>Get stuff done.<br/><em>But make it cool.</em></h1>
            <p className="muted">Your tiny corner of the internet for getting life together.</p>
          </div>
          <div className="count"><strong>{remaining}</strong><span>still vibing</span></div>
        </header>

        <div className="stats"><span><Zap size={14}/> {completed} done</span><span>✦ no stress</span><span>☻ main character mode</span></div>

        <form onSubmit={addTask} className="add-form">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="what's the move? add a task..." aria-label="Tugasan baharu" />
          <button type="submit"><Plus size={18}/> Add it</button>
        </form>

        <nav className="filters" aria-label="Penapis tugasan">
          {[['all','Everything'],['active','In the queue'],['done','Slayed']].map(([key,label]) => <button key={key} className={filter === key ? 'selected' : ''} onClick={() => setFilter(key)}>{label}</button>)}
        </nav>

        <div className="tasks">
          {visible.length === 0 ? <div className="empty">No tasks here. You ate. ✨</div> : visible.map(task => (
            <article className={`task ${task.done ? 'done' : ''}`} key={task.id}>
              <button className="check" onClick={() => toggle(task.id)} aria-label={task.done ? 'Tanda belum selesai' : 'Tanda selesai'}>{task.done ? <Check size={17}/> : <Circle size={19}/>}</button>
              <span>{task.text}</span>
              <button className="delete" onClick={() => remove(task.id)} aria-label="Padam tugasan"><Trash2 size={17}/></button>
            </article>
          ))}
        </div>
        <footer><span>made for chaotic good people ♡</span><span>{tasks.length} tasks total</span></footer>
      </section>
    </main>
  );
}
