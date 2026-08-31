import { useCallback, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { chatMessageAdded } from '../store/slices/meetingSlice.js'
import { mockChatAutoReplies } from '../services/mockData.js'

// Stand-in for a real Socket.IO connection. A real implementation would be:
//
//   const socket = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } })
//   socket.emit('meeting:join', { meetingId })
//   socket.on('chat:message', (msg) => dispatch(chatMessageAdded(msg)))
//   socket.on('participant:joined', (p) => dispatch(participantJoined(p)))
//
// Until that backend exists, this hook simulates the same events so the
// Chat panel and Participants panel can be built and tested against real
// interaction patterns.
export function useMeetingSocket() {
  const dispatch = useDispatch()
  const replyIndex = useRef(0)

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim()) return
      dispatch(
        chatMessageAdded({
          id: 'c_' + Date.now(),
          author: 'You',
          text: text.trim(),
          time: currentTime(),
        })
      )

      const reply = mockChatAutoReplies[replyIndex.current % mockChatAutoReplies.length]
      replyIndex.current += 1
      setTimeout(() => {
        dispatch(
          chatMessageAdded({
            id: 'c_' + Date.now() + '_r',
            author: reply.author,
            text: reply.text,
            time: currentTime(),
          })
        )
      }, 1400 + Math.random() * 900)
    },
    [dispatch]
  )

  return { sendMessage }
}

function currentTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
