import { useEffect, useState } from 'react';
import { useApp } from '@/app/Core/Context/usar-app.js';
import '../paginas-estudiante.css';

const STORAGE_KEY = 'physicsplay_student_notes';

const DEFAULT_NOTES = [
  {
    id: 'formula-newton',
    title: 'Segunda ley de Newton',
    body: 'F = m x a. Multiplica masa por aceleracion para hallar la fuerza neta.'
  }
];

function readNotes() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_NOTES;
  } catch {
    return DEFAULT_NOTES;
  }
}

export function NotasPage() {
  const { user } = useApp();
  const [notes, setNotes] = useState(readNotes);
  const [form, setForm] = useState({ title: '', body: '' });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  function addNote(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      return;
    }

    setNotes((current) => [
      {
        id: `${Date.now()}`,
        title: form.title.trim(),
        body: form.body.trim()
      },
      ...current
    ]);
    setForm({ title: '', body: '' });
  }

  function deleteNote(noteId) {
    setNotes((current) => current.filter((note) => note.id !== noteId));
  }

  return (
    <section className="student-page student-page-wide">
      <div className="student-page-header">
        <span>Notas</span>
        <h1>Apuntes de {user.name?.split(' ')[0] || 'estudio'}</h1>
        <p>
          Escribe tus apuntes de recordatorio aqui:
        </p>
      </div>

      <form className="notes-form" onSubmit={addNote}>
        <input
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Titulo de la nota"
          value={form.title}
        />
        <textarea
          onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
          placeholder="Escribe tu apunte..."
          rows="4"
          value={form.body}
        />
        <button className="primary-setup-button compact-action" type="submit">
          Guardar nota
        </button>
      </form>

      <div className="notes-grid">
        {notes.map((note) => (
          <article className="student-info-card note-card" key={note.id}>
            <strong>{note.title}</strong>
            <p>{note.body}</p>
            <button className="text-button" onClick={() => deleteNote(note.id)} type="button">
              Eliminar
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
