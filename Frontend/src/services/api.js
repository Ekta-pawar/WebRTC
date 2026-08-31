import axios from 'axios'

// Central Axios instance. Once a real backend exists, point
// VITE_API_BASE_URL at it and the rest of the app needs no changes —
// every call in auth.js / meeting.js / notes.js already goes through here.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Small helper the mock services use to simulate network latency,
// so loading states can be built and tested honestly.
export function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
