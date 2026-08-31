import { delay } from './api.js'
import { mockNotes } from './mockData.js'

let notes = [...mockNotes]

export async function getNotes() {
  await delay(450)
  // Real call: const { data } = await api.get('/notes')
  return notes
}

export async function getNoteById(id) {
  await delay(350)
  // Real call: const { data } = await api.get(`/notes/${id}`)
  return notes.find((n) => n.id === id) || null
}

export async function updateNote(id, patch) {
  await delay(500)
  // Real call: const { data } = await api.patch(`/notes/${id}`, patch)
  notes = notes.map((n) => (n.id === id ? { ...n, ...patch } : n))
  return notes.find((n) => n.id === id)
}

export async function deleteNote(id) {
  await delay(450)
  // Real call: await api.delete(`/notes/${id}`)
  notes = notes.filter((n) => n.id !== id)
  return { success: true }
}
