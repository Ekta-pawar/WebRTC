import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import { formatDateLabel, formatDuration } from '../../utils/formatDate.js'

export default function PreviousMeetingCard({ meeting }) {
  const navigate = useNavigate()

  return (
    <Card className="meeting-card">
      <div className="meeting-card__top">
        <div>
          <div className="meeting-card__title">{meeting.title}</div>
          <div className="meeting-card__meta">
            <span>📅 {formatDateLabel(meeting.date)}</span>
            <span>⏱ {formatDuration(meeting.duration)}</span>
          </div>
        </div>
      </div>

      <div className="participant-stack">
        👥&nbsp;{meeting.participants.join(', ')}
      </div>

      <div className="meeting-card__actions">
        {meeting.hasNotes && (
          <Button variant="secondary" onClick={() => navigate(`/notes?meeting=${meeting.id}`)}>View Notes</Button>
        )}
        {meeting.hasTranscript && (
          <Button variant="outline" onClick={() => navigate(`/notes?meeting=${meeting.id}&tab=transcript`)}>Transcript</Button>
        )}
        <Button variant="ghost" onClick={() => navigate(`/notes?meeting=${meeting.id}`)}>Details</Button>
      </div>
    </Card>
  )
}
