import { delay } from './api.js'
import { mockUser } from './mockData.js'

// Mock auth service. Every function returns the same shape a real REST
// endpoint would (see comment above each), so swapping in `api.post(...)`
// later is a one-line change per function.

export async function login({ email, password }) {
  await delay(700)
  if (!email || !password) throw new Error('Email and password are required.')
  if (password.length < 6) throw new Error('Invalid email or password.')
  // Real call: const { data } = await api.post('/auth/login', { email, password })
  const token = 'mock_token_' + Date.now()
  return { user: { ...mockUser, email }, token }
}

export async function loginWithGoogle() {
  await delay(600)
  // Real call: redirect to backend OAuth endpoint / exchange code
  const token = 'mock_token_google_' + Date.now()
  return { user: mockUser, token }
}

export async function register({ name, email, password }) {
  await delay(800)
  if (!name || !email || !password) throw new Error('All fields are required.')
  // Real call: const { data } = await api.post('/auth/register', payload)
  return { user: { ...mockUser, name, email }, needsVerification: true }
}

export async function verifyEmail(token) {
  await delay(600)
  // Real call: const { data } = await api.post('/auth/verify-email', { token })
  return { verified: true }
}

export async function resendVerificationEmail(email) {
  await delay(500)
  // Real call: await api.post('/auth/resend-verification', { email })
  return { sent: true }
}

export async function forgotPassword(email) {
  await delay(700)
  if (!email) throw new Error('Email is required.')
  // Real call: await api.post('/auth/forgot-password', { email })
  return { sent: true }
}

export async function resetPassword({ token, password }) {
  await delay(700)
  if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.')
  // Real call: await api.post('/auth/reset-password', { token, password })
  return { success: true }
}

export function logout() {
  localStorage.removeItem('nexus_token')
  localStorage.removeItem('nexus_user')
}
