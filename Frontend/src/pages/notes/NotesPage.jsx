import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiFileText, FiArrowLeft, FiEdit2, FiDownload, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Modal from '../../components/ui/Modal.jsx'
import TranscriptPanel from '../../components/ai/TranscriptPanel.jsx'
import { useIsMobile } from '../../hooks/useMediaQuery.js'
import { getNotes, updateNote, deleteNote } from '../../services/notes.js'
import { formatDateLabel } from '../../utils/formatDate.js'
import { notifySuccess } from '../../utils/toast.jsx'
import '../../styles/notes.css'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending Actions' },
  { key: 'week', label: 'This Week' },
]

function actionProgress(note) {
  if (!note.actionItems.length) return null
  const done = note.actionItems.filter((a) => a.done).length
  return { done, total: note.actionItems.length }
}

function isWithinLastWeek(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const diffDays = (Date.now() - date.getTime()) / 86400000
  return diffDays >= 0 && diffDays <= 7
}

export default function NotesPage() {
  const [searchParams] = useSearchParams()
  const isMobile = useIsMobile()

  const [notes, setNotes] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
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
    let list = notes
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.topics.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (filter === 'pending') list = list.filter((n) => n.actionItems.some((a) => !a.done))
    if (filter === 'week') list = list.filter((n) => isWithinLastWeek(n.date))
    return list
  }, [notes, query, filter])

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
    notifySuccess('Note updated.')
  }

  const toggleActionItem = async (itemId) => {
    const actionItems = selectedNote.actionItems.map((a) => (a.id === itemId ? { ...a, done: !a.done } : a))
    setNotes((prev) => prev.map((n) => (n.id === selectedNote.id ? { ...n, actionItems } : n)))
    await updateNote(selectedNote.id, { actionItems })
  }

  const handleDelete = async () => {
    await deleteNote(selectedNote.id)
    setNotes((prev) => prev.filter((n) => n.id !== selectedNote.id))
    setSelectedId(null)
    setConfirmDelete(false)
    notifySuccess('Note deleted.')
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
    notifySuccess('Note exported.')
  }

  const showList = !isMobile || !selectedNote
  const showDetail = !isMobile || Boolean(selectedNote)

  return (
    <div className={`notes-layout ${!isMobile ? 'notes-layout--split' : ''}`}>
      {showList && (
        <div className="notes-list-col">
          <div className="notes-list-header">
            <h1 style={{ fontSize: '1.1rem' }}>My Notes</h1>
            {notes && <span className="notes-list-header__count">{notes.length} total</span>}
          </div>

          <Input placeholder="Search notes..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <div style={{ height: 12 }} />

          <div className="notes-filter-chips">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`notes-filter-chip ${filter === f.key ? 'is-active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {!filtered ? (
            <Spinner />
          ) : filtered.length === 0 ? (
            <EmptyState icon={<FiSearch size={22} />} title="No notes found" description="Try a different search or filter." />
          ) : (
            filtered.map((n) => {
              const progress = actionProgress(n)
              const pct = progress ? Math.round((progress.done / progress.total) * 100) : 0
              return (
                <button
                  key={n.id}
                  className={`note-list-item ${selectedId === n.id ? 'is-active' : ''}`}
                  onClick={() => handleSelect(n)}
                >
                  <div className="note-list-item__title">{n.title}</div>
                  <div className="note-list-item__date">{formatDateLabel(n.date)}</div>
                  <div className="note-list-item__summary">{n.summary}</div>
                  {progress && (
                    <div className="note-list-item__progress">
                      <div className="note-progress-bar">
                        <div
                          className={`note-progress-bar__fill ${pct === 100 ? 'is-complete' : ''}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="note-list-item__progress-label">{progress.done}/{progress.total} done</span>
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>
      )}

      {showDetail && (
        <div className="notes-detail">
          {!selectedNote ? (
            <EmptyState icon={<FiFileText size={22} />} title="Select a note" description="Choose a meeting from the list to view its notes." />
          ) : (
            <>
              {isMobile && (
                <button className="notes-detail__back" onClick={() => setSelectedId(null)}><FiArrowLeft /> Back to Notes</button>
              )}

              <div className="notes-detail__card" key={selectedNote.id}>
                <div className="notes-detail__header">
                  <div>
                    <h2>{selectedNote.title}</h2>
                    <div className="notes-detail__meta">{formatDateLabel(selectedNote.date)}</div>
                  </div>
                </div>

                <div className="notes-detail__actions">
                  {!editing ? (
                    <Button size="sm" variant="outline" icon={<FiEdit2 />} onClick={startEdit}>Edit</Button>
                  ) : (
                    <>
                      <Button size="sm" variant="primary" icon={<FiCheck />} onClick={saveEdit}>Save</Button>
                      <Button size="sm" variant="ghost" icon={<FiX />} onClick={() => setEditing(false)}>Cancel</Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" icon={<FiDownload />} onClick={handleExport}>Export</Button>
                  <Button size="sm" variant="danger" icon={<FiTrash2 />} onClick={() => setConfirmDelete(true)}>Delete</Button>
                </div>

                <div className="notes-detail__tabs">
                  <button className={tab === 'notes' ? 'is-active' : ''} onClick={() => setTab('notes')}>Notes</button>
                  <button className={tab === 'transcript' ? 'is-active' : ''} onClick={() => setTab('transcript')}>Transcript</button>
                </div>

                <div className="notes-detail__tab-content" key={tab}>
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
                          <div className="notes-section--actions__header">
                            <h4>Action Items</h4>
                            <span className="notes-section--actions__count">
                              {selectedNote.actionItems.filter((a) => a.done).length}/{selectedNote.actionItems.length} done
                            </span>
                          </div>
                          <ul>
                            {selectedNote.actionItems.map((a) => (
                              <li key={a.id} onClick={() => toggleActionItem(a.id)}>
                                <span className={`notes-checkbox ${a.done ? 'is-done' : ''}`}>{a.done && <FiCheck />}</span>
                                <span className={a.done ? 'notes-text--done' : ''}>
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
                </div>
              </div>
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
