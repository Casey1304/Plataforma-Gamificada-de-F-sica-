import { useEffect, useState } from 'react';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { StatusMessage } from '@/app/Shared/Components/mensaje-estado/mensaje-estado.jsx';
import '../paginas-estudiante.css';

const STORAGE_KEY = 'physicsplay_student_notes';

const DEFAULT_NOTES = [
  {
    id: 'formula-newton',
    title: 'Segunda ley de Newton',
    body: 'F = m x a. Multiplica masa por aceleración para hallar la fuerza neta.'
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
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  function addNote(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setErrorMessage('Completa el título y el contenido de la nota.');
      setSuccessMessage('');
      return;
    }

    setErrorMessage('');
    setNotes((current) => [
      {
        id: `${Date.now()}`,
        title: form.title.trim(),
        body: form.body.trim()
      },
      ...current
    ]);
    setForm({ title: '', body: '' });
    setSuccessMessage('La nota se guardó correctamente.');
  }

  function deleteNote(noteId) {
    const note = notes.find((item) => item.id === noteId);
    if (!window.confirm(`¿Confirmas que deseas eliminar la nota "${note?.title ?? ''}"?`)) {
      return;
    }
    setNotes((current) => current.filter((note) => note.id !== noteId));
    setErrorMessage('');
    setSuccessMessage('La nota se eliminó correctamente.');
  }

  return (
    <section className="student-page student-page-wide">
      <div className="student-page-header">
        <span>Notas</span>
        <h1>Apuntes de {user.name?.split(' ')[0] || 'estudio'}</h1>
        <p>
          Guarda fórmulas, ideas y recordatorios para consultarlos durante tu estudio.
        </p>
      </div>

      <form aria-describedby="notes-required-hint" className="notes-form" noValidate onSubmit={addNote}>
        <h2>Nueva nota</h2>
        <p className="field-hint" id="notes-required-hint">Todos los campos son obligatorios.</p>
        <label htmlFor="note-title">
          Título <span aria-hidden="true">*</span>
        </label>
        <input
          aria-describedby={errorMessage && !form.title.trim() ? 'note-title-error' : undefined}
          aria-invalid={Boolean(errorMessage && !form.title.trim())}
          id="note-title"
          onChange={(event) => {
            setForm((current) => ({ ...current, title: event.target.value }));
            setErrorMessage('');
            setSuccessMessage('');
          }}
          required
          value={form.title}
        />
        {errorMessage && !form.title.trim() && (
          <small className="field-error" id="note-title-error" role="alert">
            Error: escribe un título para la nota.
          </small>
        )}
        <label htmlFor="note-body">
          Contenido <span aria-hidden="true">*</span>
        </label>
        <textarea
          aria-describedby={errorMessage && !form.body.trim() ? 'note-body-error' : undefined}
          aria-invalid={Boolean(errorMessage && !form.body.trim())}
          id="note-body"
          onChange={(event) => {
            setForm((current) => ({ ...current, body: event.target.value }));
            setErrorMessage('');
            setSuccessMessage('');
          }}
          required
          rows="4"
          value={form.body}
        />
        {errorMessage && !form.body.trim() && (
          <small className="field-error" id="note-body-error" role="alert">
            Error: escribe el contenido de la nota.
          </small>
        )}
        <StatusMessage message={successMessage} type="success" />
        <button className="primary-setup-button compact-action" type="submit">
          Guardar nota
        </button>
      </form>

      <section aria-labelledby="saved-notes-title">
        <h2 className="section-title" id="saved-notes-title">Notas guardadas</h2>
        {notes.length === 0 && <p className="empty-state">Todavía no tienes notas guardadas.</p>}
        <div className="notes-grid">
        {notes.map((note) => (
          <article className="student-info-card note-card" key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
            <button
              aria-label={`Eliminar nota: ${note.title}`}
              className="text-button destructive-action"
              onClick={() => deleteNote(note.id)}
              type="button"
            >
              Eliminar
            </button>
          </article>
        ))}
        </div>
      </section>
    </section>
  );
}
