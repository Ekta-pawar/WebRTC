import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import { formatDateLabel, formatTimeLabel, formatDuration } from '../../utils/formatDate.js'

const STATUS_VARIANT = { confirmed: 'success', pending: 'warning' }

export default function UpcomingMeetingCard({ meeting, onCancel, onCopyLink }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menuOpen])

  return (
    <Card className="meeting-card">
      <div className="meeting-card__top">
        <div>
          <div className="meeting-card__title">{meeting.title}</div>
          <div className="meeting-card__meta">
            <span>📅 {formatDateLabel(meeting.date)}</span>
            <span>🕐 {formatTimeLabel(meeting.time)}</span>
            <span>⏱ {formatDuration(meeting.duration)}</span>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[meeting.status] || 'neutral'}>{meeting.status}</Badge>
      </div>

      {meeting.description && <p className="meeting-card__desc">{meeting.description}</p>}

      <div className="meeting-card__meta">
        <span>👤 Host: {meeting.host}</span>
      </div>

      <div className="meeting-card__actions">
        <Button variant="primary" onClick={() => navigate(`/meeting/${meeting.id}`)}>Join</Button>
        <Button variant="outline" onClick={() => navigate(`/schedule?edit=${meeting.id}`)}>Edit</Button>
        <div className="meeting-card__menu" ref={menuRef}>
          <Button variant="outline" onClick={() => setMenuOpen((o) => !o)} aria-label="More options">•••</Button>
          {menuOpen && (
            <div className="meeting-card__menu-panel">
              <button onClick={() => { onCopyLink?.(meeting); setMenuOpen(false) }}>🔗 Copy Link</button>
              <button className="danger" onClick={() => { onCancel?.(meeting); setMenuOpen(false) }}>🗑 Cancel</button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
