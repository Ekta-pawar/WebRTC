import { createSlice } from '@reduxjs/toolkit'
import { mockParticipants, mockChatSeed } from '../../services/mockData.js'

// Shared session state for the active Meeting Room — read/written by the
// control bar, participants panel and chat panel at the same time, so it
// belongs in Redux rather than local component state.
const initialState = {
  meetingId: null,
  meetingName: '',
  isLive: false,
  connectionState: 'idle', // idle | connecting | connected | reconnecting | disconnected
  micEnabled: true,
  cameraEnabled: true,
  screenSharing: false,
  participants: [],
  chatMessages: [],
}

const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    meetingJoined(state, action) {
      state.meetingId = action.payload.meetingId
      state.meetingName = action.payload.meetingName
      state.isLive = true
      state.connectionState = 'connected'
      state.participants = mockParticipants
      state.chatMessages = mockChatSeed
    },
    connectionStateChanged(state, action) {
      state.connectionState = action.payload
    },
    micToggled(state) {
      state.micEnabled = !state.micEnabled
      const you = state.participants.find((p) => p.isYou)
      if (you) you.micOn = state.micEnabled
    },
    cameraToggled(state) {
      state.cameraEnabled = !state.cameraEnabled
      const you = state.participants.find((p) => p.isYou)
      if (you) you.cameraOn = state.cameraEnabled
    },
    screenShareStarted(state) {
      state.screenSharing = true
    },
    screenShareStopped(state) {
      state.screenSharing = false
    },
    participantJoined(state, action) {
      state.participants.push(action.payload)
    },
    participantMutedByHost(state, action) {
      const p = state.participants.find((p) => p.id === action.payload)
      if (p) p.micOn = false
    },
    participantRemoved(state, action) {
      state.participants = state.participants.filter((p) => p.id !== action.payload)
    },
    chatMessageAdded(state, action) {
      state.chatMessages.push(action.payload)
    },
    meetingLeft() {
      return initialState
    },
  },
})

export const {
  meetingJoined,
  connectionStateChanged,
  micToggled,
  cameraToggled,
  screenShareStarted,
  screenShareStopped,
  participantJoined,
  participantMutedByHost,
  participantRemoved,
  chatMessageAdded,
  meetingLeft,
} = meetingSlice.actions

export default meetingSlice.reducer
