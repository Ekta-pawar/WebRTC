import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import meetingReducer from './slices/meetingSlice.js'
import aiReducer from './slices/aiSlice.js'
import notificationsReducer from './slices/notificationsSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meeting: meetingReducer,
    ai: aiReducer,
    notifications: notificationsReducer,
  },
})
