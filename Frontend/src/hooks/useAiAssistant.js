import { useCallback, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
  aiStatusChanged,
  transcriptLineAdded,
  topicAdded,
  decisionAdded,
  actionItemAdded,
  questionAdded,
} from '../store/slices/aiSlice.js'
import { meetingScript } from '../services/mockData.js'

// Simulates the live pipeline: speech -> speech-to-text -> AI analysis ->
// structured notes. A real integration would replace the setTimeout
// playback below with socket listeners, e.g.:
//
//   socket.on('ai:transcript', (line) => dispatch(transcriptLineAdded(line)))
//   socket.on('ai:note', (note) => dispatch(applyNote(note)))
//   socket.on('ai:status', (status) => dispatch(aiStatusChanged(status)))
//
// The AI is a silent assistant: this hook only ever updates panel state,
// it never dispatches anything that would interrupt the meeting UI.
export function useAiAssistant() {
  const dispatch = useDispatch()
  const timeouts = useRef([])
  const scriptIndex = useRef(0)

  const clearTimers = () => {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
  }

  const applyNote = useCallback(
    (note) => {
      if (!note) return
      if (note.type === 'topic') dispatch(topicAdded(note.value))
      if (note.type === 'decision') dispatch(decisionAdded(note.value))
      if (note.type === 'question') dispatch(questionAdded(note.value))
      if (note.type === 'actionItem') {
        dispatch(
          actionItemAdded({
            id: 'ai_' + Date.now(),
            assignee: note.assignee,
            text: note.value,
            due: note.due,
            done: false,
          })
        )
      }
    },
    [dispatch]
  )

  const playNext = useCallback(() => {
    const entry = meetingScript[scriptIndex.current]
    if (!entry) return

    const t = setTimeout(() => {
      dispatch(
        transcriptLineAdded({
          id: 't_' + Date.now(),
          speaker: entry.speaker,
          time: currentTime(),
          text: entry.text,
        })
      )
      dispatch(aiStatusChanged('processing'))

      const t2 = setTimeout(() => {
        applyNote(entry.note)
        dispatch(aiStatusChanged('active'))
        scriptIndex.current += 1
        playNext()
      }, 700)
      timeouts.current.push(t2)
    }, entry.delay)

    timeouts.current.push(t)
  }, [applyNote, dispatch])

  const start = useCallback(() => {
    dispatch(aiStatusChanged('connecting'))
    const t = setTimeout(() => {
      dispatch(aiStatusChanged('active'))
      playNext()
    }, 1100)
    timeouts.current.push(t)
  }, [dispatch, playNext])

  const stop = useCallback(() => {
    clearTimers()
    dispatch(aiStatusChanged('stopped'))
  }, [dispatch])

  const retry = useCallback(() => {
    clearTimers()
    start()
  }, [start])

  useEffect(() => clearTimers, [])

  return { start, stop, retry }
}

function currentTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
