import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authService from '../../services/auth.js'

const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem('webrtc_user') || 'null')
  } catch {
    return null
  }
})()

const initialState = {
  user: storedUser,
  token: localStorage.getItem('webrtc_token') || null,
  isAuthenticated: Boolean(localStorage.getItem('webrtc_token')),
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
}

export const loginUser = createAsyncThunk('auth/login', async (credentials) => {
  return authService.login(credentials)
})

export const registerUser = createAsyncThunk('auth/register', async (payload) => {
  return authService.register(payload)
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authService.logout()
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.status = 'idle'
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        applyAuthPayload(state, action.payload)
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading'
          state.error = null
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.error?.message || 'Something went wrong.'
        }
      )
  },
})

function applyAuthPayload(state, { user, token }) {
  state.status = 'succeeded'
  state.user = user
  state.token = token
  state.isAuthenticated = true
  localStorage.setItem('webrtc_token', token)
  localStorage.setItem('webrtc_user', JSON.stringify(user))
}

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
