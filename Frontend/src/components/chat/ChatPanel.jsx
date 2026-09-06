import { useEffect, useRef, useState } from 'react'
import { FiSend } from 'react-icons/fi'

const REACTIONS = ['👍', '❤️', '😂', '👏', '🎉']

export default function ChatPanel({ messages, onSend, onReact }) {
  const [text, setText] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  return (
    <div className="chat-panel">
      <div className="chat-panel__reactions">
        {REACTIONS.map((emoji) => (
          <button key={emoji} onClick={() => onReact?.(emoji)} aria-label={`React with ${emoji}`}>
            {emoji}
          </button>
        ))}
      </div>

      <div className="chat-panel__messages scroll-y" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`chat-message ${m.author === 'You' ? 'chat-message--own' : ''}`}>
            <div className="chat-message__meta">
              <span className="chat-message__author">{m.author}</span>
              <span className="chat-message__time">{m.time}</span>
            </div>
            <div className="chat-message__text">{m.text}</div>
          </div>
        ))}
      </div>

      <form className="chat-panel__input" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn btn--primary btn--sm" disabled={!text.trim()}><FiSend /> Send</button>
      </form>
    </div>
  )
}
