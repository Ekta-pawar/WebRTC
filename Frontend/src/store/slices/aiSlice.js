import { createSlice } from '@reduxjs/toolkit'

// Drives the Live AI Notes panel + transcript. Status values map directly
// to the UI states in the spec: inactive, connecting, active, processing,
// error, stopped.
const initialState = {
  status: 'inactive',
  notes: {
    topics: [],
    decisions: [],
    actionItems: [],
    questions: [],
  },
  transcript: [],
}

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    aiStatusChanged(state, action) {
      state.status = action.payload
    },
    transcriptLineAdded(state, action) {
      state.transcript.push(action.payload)
    },
    topicAdded(state, action) {
      if (!state.notes.topics.includes(action.payload)) state.notes.topics.push(action.payload)
    },
    decisionAdded(state, action) {
      state.notes.decisions.push(action.payload)
    },
    actionItemAdded(state, action) {
      state.notes.actionItems.push(action.payload)
    },
    actionItemToggled(state, action) {
      const item = state.notes.actionItems.find((i) => i.id === action.payload)
      if (item) item.done = !item.done
    },
    questionAdded(state, action) {
      if (!state.notes.questions.includes(action.payload)) state.notes.questions.push(action.payload)
    },
    aiReset() {
      return initialState
    },
  },
})

export const {
  aiStatusChanged,
  transcriptLineAdded,
  topicAdded,
  decisionAdded,
  actionItemAdded,
  actionItemToggled,
  questionAdded,
  aiReset,
} = aiSlice.actions

export default aiSlice.reducer
