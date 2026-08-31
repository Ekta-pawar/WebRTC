import { useDispatch } from 'react-redux'
import { actionItemToggled } from '../../store/slices/aiSlice.js'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'

const STATUS_CONFIG = {
  inactive: { label: '✨ Start AI Notes', tone: 'neutral' },
  connecting: { label: '⏳ Connecting AI...', tone: 'neutral' },
  active: { label: '🟢 AI Notes Active', tone: 'success' },
  processing: { label: '✨ Updating notes...', tone: 'success' },
  error: { label: '⚠ AI connection lost', tone: 'danger' },
  stopped: { label: 'AI Notes Off', tone: 'neutral' },
}

export default function AiNotesPanel({ status, notes, onStart, onStop, onRetry }) {
  const dispatch = useDispatch()
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.inactive
  const hasAnyNotes =
    notes.topics.length || notes.decisions.length || notes.actionItems.length || notes.questions.length

  return (
    <div className="ai-panel">
      <div className="ai-panel__header">
        <div>
          <div className="ai-panel__title">✨ AI Meeting Assistant</div>
          <div className={`ai-panel__status ai-panel__status--${config.tone}`}>
            {status === 'connecting' && <Spinner />}
            {config.label}
          </div>
        </div>

        {status === 'inactive' && <Button size="sm" variant="primary" onClick={onStart}>Start</Button>}
        {(status === 'active' || status === 'processing') && (
          <Button size="sm" variant="outline" onClick={onStop}>Stop</Button>
        )}
        {status === 'error' && <Button size="sm" variant="danger" onClick={onRetry}>Retry</Button>}
        {status === 'stopped' && <Button size="sm" variant="secondary" onClick={onStart}>Resume</Button>}
      </div>

      {!hasAnyNotes ? (
        <div className="ai-panel__placeholder">
          {status === 'inactive'
            ? 'Start the AI assistant to capture topics, decisions and action items live.'
            : 'Listening for topics, decisions and action items…'}
        </div>
      ) : (
        <div className="ai-panel__body scroll-y">
          {notes.topics.length > 0 && (
            <section className="ai-section">
              <h4>Topics</h4>
              <ul className="ai-list ai-list--topics">
                {notes.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          )}

          {notes.decisions.length > 0 && (
            <section className="ai-section">
              <h4>Decisions</h4>
              <ul className="ai-list ai-list--decisions">
                {notes.decisions.map((d, i) => (
                  <li key={i}>✓ {d}</li>
                ))}
              </ul>
            </section>
          )}

          {notes.actionItems.length > 0 && (
            <section className="ai-section">
              <h4>Action Items</h4>
              <ul className="ai-list ai-list--actions">
                {notes.actionItems.map((item) => (
                  <li key={item.id} onClick={() => dispatch(actionItemToggled(item.id))}>
                    <span className={`ai-checkbox ${item.done ? 'is-done' : ''}`}>{item.done ? '☑' : '☐'}</span>
                    <span className={item.done ? 'ai-text--done' : ''}>
                      <strong>{item.assignee}</strong> — {item.text}
                      {item.due && <span className="ai-due"> · {item.due}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {notes.questions.length > 0 && (
            <section className="ai-section">
              <h4>Questions</h4>
              <ul className="ai-list ai-list--questions">
                {notes.questions.map((q, i) => (
                  <li key={i}>? {q}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
