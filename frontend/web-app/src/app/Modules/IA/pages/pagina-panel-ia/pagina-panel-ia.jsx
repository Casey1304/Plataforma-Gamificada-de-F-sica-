import { useRef, useState } from 'react';
import { useApp } from '@/app/Core/Context/usar-app.js';
import { askConnor } from '@/app/Core/Services/servicio-ia.js';
import { StatusMessage } from '@/app/Shared/Components/mensaje-estado/mensaje-estado.jsx';
import { AiSidePanel } from '@/app/Shared/Components/panel-lateral-ia/panel-lateral-ia.jsx';
import '@/app/Modules/Estudiante/pages/paginas-estudiante.css';
import './pagina-panel-ia.css';

const QUESTION_LIMIT = 500;
const CONTEXT_LIMIT = 4;
const SUGGESTIONS = [
  '¿Cuál es la diferencia entre masa y peso?',
  'Explícame la segunda ley de Newton con un ejemplo.',
  '¿Cómo calculo la aceleración de un objeto?'
];

function recentContext(messages) {
  return messages
    .filter((message) => !message.failed && !message.pending)
    .slice(-CONTEXT_LIMIT)
    .map(({ role, content }) => ({ rol: role, contenido: content }));
}

export function PanelIAPage() {
  const {
    aiRecommendations,
    analytics,
    generateAiExercise,
    isGenerating,
    prediction,
    user
  } = useApp();
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasQuestionError, setHasQuestionError] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [lastFailed, setLastFailed] = useState(null);
  const messageSequence = useRef(0);

  async function sendQuestion(text, options = {}) {
    const cleanQuestion = text.trim();
    const existingMessageId = options.messageId;
    const userMessageId = existingMessageId ?? `usuario-${++messageSequence.current}`;
    const context = options.context ?? recentContext(messages);

    if (!cleanQuestion || cleanQuestion.length > QUESTION_LIMIT || isSending) {
      return;
    }

    if (existingMessageId) {
      setMessages((current) =>
        current.map((message) =>
          message.id === existingMessageId
            ? { ...message, failed: false, pending: true }
            : message
        )
      );
    } else {
      setMessages((current) => [
        ...current,
        {
          id: userMessageId,
          role: 'usuario',
          content: cleanQuestion,
          pending: true
        }
      ]);
    }

    setQuestion('');
    setErrorMessage('');
    setHasQuestionError(false);
    setLastFailed(null);
    setIsSending(true);
    setAnnouncement('Connor está preparando una respuesta.');

    try {
      const response = await askConnor(user.userId, cleanQuestion, context);
      const assistantMessage = {
        id: `connor-${++messageSequence.current}`,
        role: 'asistente',
        content: response.respuesta
      };

      setMessages((current) => [
        ...current.map((message) =>
          message.id === userMessageId ? { ...message, pending: false } : message
        ),
        assistantMessage
      ]);
      setAnnouncement(`Respuesta de Connor: ${response.respuesta}`);
    } catch (error) {
      setMessages((current) =>
        current.map((message) =>
          message.id === userMessageId
            ? { ...message, failed: true, pending: false }
            : message
        )
      );
      setErrorMessage(error.message);
      setHasQuestionError(error.status === 400);
      setLastFailed({ question: cleanQuestion, context, messageId: userMessageId });
      setAnnouncement('No se pudo obtener la respuesta de Connor.');
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendQuestion(question);
  }

  function retryLastQuestion() {
    if (lastFailed) {
      sendQuestion(lastFailed.question, {
        context: lastFailed.context,
        messageId: lastFailed.messageId
      });
    }
  }

  function clearConversation() {
    if (messages.length === 0 || !window.confirm('¿Deseas borrar toda la conversación con Connor?')) {
      return;
    }

    setMessages([]);
    setQuestion('');
    setErrorMessage('');
    setHasQuestionError(false);
    setLastFailed(null);
    setAnnouncement('La conversación se borró correctamente.');
  }

  return (
    <>
      <section aria-labelledby="connor-title" className="student-page ia-main-page connor-page">
        <header className="student-page-header connor-page-header">
          <span>Tutor IA</span>
          <div className="connor-heading-row">
            <div aria-hidden="true" className="connor-avatar">C</div>
            <div>
              <h1 id="connor-title">Connor, tu tutor de física</h1>
              <p>Pregunta sobre física y recibe una explicación breve para continuar aprendiendo.</p>
            </div>
          </div>
        </header>

        <section aria-labelledby="conversation-title" className="connor-conversation">
          <div className="connor-section-heading">
            <h2 id="conversation-title">Conversación</h2>
            <button
              className="connor-clear-button"
              disabled={messages.length === 0 || isSending}
              onClick={clearConversation}
              type="button"
            >
              Limpiar conversación
            </button>
          </div>

          <div
            aria-label="Mensajes de la conversación con Connor"
            className="connor-chat-log"
            tabIndex="0"
          >
            <article aria-label="Mensaje de Connor" className="connor-message connor-message--assistant">
              <strong>Connor</strong>
              <p>
                Hola, soy Connor, tu tutor de física. Puedo ayudarte con movimiento, fuerzas,
                energía, gravedad, vectores y otros temas escolares de física. Escribe tu pregunta
                para comenzar.
              </p>
            </article>
            {messages.map((message) => (
              <article
                aria-label={message.role === 'asistente' ? 'Mensaje de Connor' : 'Tu mensaje'}
                className={`connor-message connor-message--${message.role}`}
                key={message.id}
              >
                <strong>{message.role === 'asistente' ? 'Connor' : 'Tú'}</strong>
                <p>{message.content}</p>
                {message.pending && <span className="connor-message-state">Enviando…</span>}
                {message.failed && <span className="connor-message-state">No se pudo enviar.</span>}
              </article>
            ))}
            {isSending && (
              <p aria-hidden="true" className="connor-thinking">Connor está pensando…</p>
            )}
          </div>

          <StatusMessage id="connor-error" message={errorMessage} />
          {lastFailed && (
            <button
              className="secondary-button connor-retry-button"
              disabled={isSending}
              onClick={retryLastQuestion}
              type="button"
            >
              Reintentar la última pregunta
            </button>
          )}

          <form className="connor-form" onSubmit={handleSubmit}>
            <label htmlFor="connor-question">Tu pregunta de física</label>
            <p id="connor-question-help">Escribe un concepto, una fórmula o los datos de un ejercicio.</p>
            <textarea
              aria-describedby={`connor-question-help connor-question-count${hasQuestionError ? ' connor-error' : ''}`}
              aria-invalid={hasQuestionError}
              disabled={isSending}
              id="connor-question"
              maxLength={QUESTION_LIMIT}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ejemplo: ¿Cómo calculo la fuerza si conozco la masa y la aceleración?"
              rows="4"
              value={question}
            />
            <div className="connor-form-footer">
              <span id="connor-question-count">{question.length} de {QUESTION_LIMIT} caracteres</span>
              <button
                aria-busy={isSending}
                className="primary-setup-button connor-send-button"
                disabled={isSending || !question.trim() || !user.userId}
                type="submit"
              >
                {isSending ? 'Enviando pregunta…' : 'Enviar pregunta'}
              </button>
            </div>
          </form>

          <section aria-labelledby="suggestions-title" className="connor-suggestions">
            <h3 id="suggestions-title">Ideas para comenzar</h3>
            <div>
              {SUGGESTIONS.map((suggestion) => (
                <button
                  disabled={isSending}
                  key={suggestion}
                  onClick={() => setQuestion(suggestion)}
                  type="button"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </section>
        </section>

        <section aria-labelledby="learning-summary-title" className="connor-learning-summary">
          <h2 id="learning-summary-title">Tu práctica recomendada</h2>
          <div className="student-card-grid two-columns">
            <article className="student-info-card">
              <h3>Diagnóstico actual</h3>
              <p>{prediction.alerta}</p>
              <span>{prediction.tendencia}</span>
            </article>
            <article className="student-info-card">
              <h3>Actividad sugerida</h3>
              <p>{aiRecommendations[0] ?? 'Completa un reto para recibir recomendaciones.'}</p>
              <button
                aria-busy={isGenerating}
                className="primary-setup-button compact-action"
                disabled={isGenerating || !user.studentId}
                onClick={generateAiExercise}
                type="button"
              >
                {isGenerating ? 'Generando…' : 'Generar reto personalizado'}
              </button>
            </article>
          </div>
        </section>

        <p aria-atomic="true" aria-live="polite" className="sr-only" role="status">
          {announcement}
        </p>
      </section>

      <AiSidePanel
        aiRecommendations={aiRecommendations}
        analytics={analytics}
        isGenerating={isGenerating}
        onGenerateAiExercise={generateAiExercise}
        prediction={prediction}
        user={user}
      />
    </>
  );
}
