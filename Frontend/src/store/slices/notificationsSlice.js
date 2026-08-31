import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
  toasts: [],
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    toastShown: {
      reducer(state, action) {
        state.toasts.push(action.payload)
      },
      prepare(message, type = 'info') {
        return { payload: { id: nanoid(), message, type } }
      },
    },
    toastDismissed(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
  },
})

export const { toastShown, toastDismissed } = notificationsSlice.actions
export default notificationsSlice.reducer
