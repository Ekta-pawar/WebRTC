import { delay } from './api.js'
import { mockUpcomingMeetings, mockPreviousMeetings } from './mockData.js'

// In-memory copy so schedule/cancel feel persistent within a session.
let upcoming = [...mockUpcomingMeetings]
const previous = [...mockPreviousMeetings]

export async function getUpcomingMeetings() {
  await delay(500)
  // Real call: const { data } = await api.get('/meetings/upcoming')
  return upcoming
}

export async function getPreviousMeetings() {
  await delay(500)
  // Real call: const { data } = await api.get('/meetings/previous')
  return previous
}

export async function scheduleMeeting({ title, date, time, description, duration = 30, options = {} }) {
  await delay(700)
  if (!title || !date || !time) throw new Error('Title, date and time are required.')
  const meeting = {
    id: 'mtg_' + Date.now(),
    title,
    description,
    date,
    time,
    duration,
    host: 'You',
    status: 'confirmed',
    code: generateMeetingCode(),
    passcode: options.requirePasscode ? generatePasscode() : null,
    options,
  }
  // Real call: const { data } = await api.post('/meetings', payload)
  upcoming = [meeting, ...upcoming]
  return meeting
}

export async function updateMeeting(id, { title, date, time, description, duration, options }) {
  await delay(700)
  if (!title || !date || !time) throw new Error('Title, date and time are required.')
  // Real call: const { data } = await api.patch(`/meetings/${id}`, payload)
  upcoming = upcoming.map((m) => (m.id === id ? { ...m, title, date, time, description, duration, options } : m))
  return upcoming.find((m) => m.id === id)
}

export async function cancelMeeting(id) {
  await delay(500)
  // Real call: await api.delete(`/meetings/${id}`)
  upcoming = upcoming.filter((m) => m.id !== id)
  return { success: true }
}

export async function validateJoinCode(code) {
  await delay(600)
  const trimmed = code.trim()
  if (!trimmed) throw new Error('Enter a meeting code or link.')
  // Real call: const { data } = await api.post('/meetings/join', { code: trimmed })
  const codeMatch = trimmed.match(/[A-Za-z]{2,5}-?\d{2,4}-?[A-Za-z0-9]{2,5}/)
  const meetingId = codeMatch ? codeMatch[0].toUpperCase() : trimmed.toUpperCase()
  return { meetingId }
}

export async function getMeetingById(id) {
  await delay(400)
  const found = upcoming.find((m) => m.id === id)
  // Real call: const { data } = await api.get(`/meetings/${id}`)
  return (
    found || {
      id,
      title: 'Live Meeting',
      description: '',
      host: 'You',
      status: 'confirmed',
    }
  )
}

function generateMeetingCode() {
  const letters = () =>
    Array.from({ length: 3 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)]).join('')
  const digits = () => String(Math.floor(100 + Math.random() * 900))
  return `${letters()}-${digits()}-${letters()}`
}

function generatePasscode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}
