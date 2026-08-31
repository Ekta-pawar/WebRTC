import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Modal from '../../components/ui/Modal.jsx'
import TranscriptPanel from '../../components/ai/TranscriptPanel.jsx'
import { useIsMobile } from '../../hooks/useMediaQuery.js'
import { getNotes, updateNote, deleteNote } from '../../services/notes.js'
import { formatDateLabel } from '../../utils/formatDate.js'
import '../../styles/notes.css'

export default function NotesPage() {
  const [searchParams] = useSearchParams()
  const isMobile = useIsMobile()

  const [notes, setNotes] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [tab, setTab] = useState(searchParams.get('tab') === 'transcript' ? 'transcript' : 'notes')
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ summary: '', topics: '' })
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    getNotes().then((data) => {
      setNotes(data)
      const targetMeeting = searchParams.get('meeting')
      if (targetMeeting) {
        const match = data.find((n) => n.meetingId === targetMeeting)
        if (match) setSelectedId(match.id)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    if (!notes) return null
    if (!query.trim()) return notes
    const q = query.toLowerCase()
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.topics.some((t) => t.toLowerCase().includes(q))
    )
  }, [notes, query])

  const selectedNote = notes?.find((n) => n.id === selectedId) || null

  const handleSelect = (note) => {
    setSelectedId(note.id)
    setEditing(false)
    setTab('notes')
  }

  const startEdit = () => {
    setEditForm({ summary: selectedNote.summary, topics: selectedNote.topics.join(', ') })
    setEditing(true)
  }

  const saveEdit = async () => {
    const patch = { summary: editForm.summary, topics: editForm.topics.split(',').map((t) => t.trim()).filter(Boolean) }
    const updated = await updateNote(selectedNote.id, patch)
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
    setEditing(false)
  }

  const handleDelete = async () => {
    await deleteNote(selectedNote.id)
    setNotes((prev) => prev.filter((n) => n.id !== selectedNote.id))
    setSelectedId(null)
    setConfirmDelete(false)
  }

  const handleExport = () => {
    const lines = [
      selectedNote.title,
      formatDateLabel(selectedNote.date),
      '',
      'Summary:',
      selectedNote.summary,
      '',
      'Topics:',
      ...selectedNote.topics.map((t) => `- ${t}`),
      '',
      'Decisions:',
      ...selectedNote.decisions.map((d) => `- ${d}`),
      '',
      'Action Items:',
      ...selectedNote.actionItems.map((a) => `- [${a.done ? 'x' : ' '}] ${a.assignee}: ${a.text}${a.due ? ` (${a.due})` : ''}`),
      '',
      'Questions:',
      ...selectedNote.questions.map((q) => `- ${q}`),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedNote.title.replace(/\s+/g, '-').toLowerCase()}-notes.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const showList = !isMobile || !selectedNote
  const showDetail = !isMobile || Boolean(selectedNote)

  return (
    <div className={`notes-layout ${!isMobile ? 'notes-layout--split' : ''}`}>
      {showList && (
        <div className="notes-list-col">
          <Input placeholder="Search notes..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <div style={{ height: 12 }} />

          {!filtered ? (
            <Spinner />
          ) : filtered.length === 0 ? (
            <EmptyState icon="🔍" title="No notes found" description="Try a different search term." />
          ) : (
            filtered.map((n) => (
              <button
                key={n.id}
                className={`note-list-item ${selectedId === n.id ? 'is-active' : ''}`}
                onClick={() => handleSelect(n)}
              >
                <div className="note-list-item__title">{n.title}</div>
                <div className="note-list-item__date">{formatDateLabel(n.date)}</div>
                <div className="note-list-item__summary">{n.summary}</div>
              </button>
            ))
          )}
        </div>
      )}

      {showDetail && (
        <div className="notes-detail">
          {!selectedNote ? (
            <EmptyState icon="📝" title="Select a note" description="Choose a meeting from the list to view its notes." />
          ) : (
            <>
              {isMobile && (
                <button className="notes-detail__back" onClick={() => setSelectedId(null)}>← Back to Notes</button>
              )}

              <div className="notes-detail__header">
                <div>
                  <h2>{selectedNote.title}</h2>
                  <div className="notes-detail__meta">{formatDateLabel(selectedNote.date)}</div>
                </div>
              </div>

              <div className="notes-detail__actions">
                {!editing ? (
                  <Button size="sm" variant="outline" onClick={startEdit}>Edit</Button>
                ) : (
                  <>
                    <Button size="sm" variant="primary" onClick={saveEdit}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                  </>
                )}
                <Button size="sm" variant="outline" onClick={handleExport}>Export</Button>
                <Button size="sm" variant="danger" onClick={() => setConfirmDelete(true)}>Delete</Button>
              </div>

              <div className="notes-detail__tabs">
                <button className={tab === 'notes' ? 'is-active' : ''} onClick={() => setTab('notes')}>Notes</button>
                <button className={tab === 'transcript' ? 'is-active' : ''} onClick={() => setTab('transcript')}>Transcript</button>
              </div>

              {tab === 'transcript' ? (
                <TranscriptPanel lines={selectedNote.transcript} className="transcript-panel--light" />
              ) : editing ? (
                <div className="notes-section">
                  <h4>Summary</h4>
                  <textarea
                    className="notes-edit-field"
                    value={editForm.summary}
                    onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                  />
                  <div style={{ height: 14 }} />
                  <h4>Topics (comma separated)</h4>
                  <textarea
                    className="notes-edit-field"
                    style={{ minHeight: 50 }}
                    value={editForm.topics}
                    onChange={(e) => setEditForm({ ...editForm, topics: e.target.value })}
                  />
                </div>
              ) : (
                <>
                  <div className="notes-section">
                    <h4>Summary</h4>
                    <p>{selectedNote.summary}</p>
                  </div>

                  {selectedNote.topics.length > 0 && (
                    <div className="notes-section notes-section--topics">
                      <h4>Topics</h4>
                      <ul>{selectedNote.topics.map((t) => <li key={t}>{t}</li>)}</ul>
                    </div>
                  )}

                  {selectedNote.decisions.length > 0 && (
                    <div className="notes-section notes-section--decisions">
                      <h4>Decisions</h4>
                      <ul>{selectedNote.decisions.map((d, i) => <li key={i}>{d}</li>)}</ul>
                    </div>
                  )}

                  {selectedNote.actionItems.length > 0 && (
                    <div className="notes-section notes-section--actions">
                      <h4>Action Items</h4>
                      <ul>
                        {selectedNote.actionItems.map((a) => (
                          <li key={a.id}>
                            <input type="checkbox" checked={a.done} readOnly />
                            <span>
                              <strong>{a.assignee}</strong> — {a.text}
                              {a.due && <span className="due"> · Due {a.due}</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedNote.questions.length > 0 && (
                    <div className="notes-section notes-section--questions">
                      <h4>Questions</h4>
                      <ul>{selectedNote.questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete note?">
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 18 }}>
          This will permanently delete “{selectedNote?.title}”. This can’t be undone.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="danger" block onClick={handleDelete}>Delete</Button>
          <Button variant="ghost" block onClick={() => setConfirmDelete(false)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}
