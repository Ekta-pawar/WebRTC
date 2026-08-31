import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import UpcomingMeetingCard from '../../components/meeting/UpcomingMeetingCard.jsx'
import { getUpcomingMeetings, getPreviousMeetings, cancelMeeting } from '../../services/meeting.js'
import { formatDateLabel, formatDuration } from '../../utils/formatDate.js'
import '../../styles/dashboard.css'
import '../../styles/meetings.css'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const user = useSelector((s) => s.auth.user)
  const navigate = useNavigate()
  const [upcoming, setUpcoming] = useState(null)
  const [recent, setRecent] = useState(null)

  useEffect(() => {
    getUpcomingMeetings().then(setUpcoming)
    getPreviousMeetings().then((all) => setRecent(all.slice(0, 3)))
  }, [])

  const handleCancel = async (meeting) => {
    await cancelMeeting(meeting.id)
    setUpcoming((prev) => prev.filter((m) => m.id !== meeting.id))
  }

  const handleCopyLink = (meeting) => {
    navigator.clipboard?.writeText(`${window.location.origin}/meeting/${meeting.id}`)
  }

  return (
    <div>
      <div className="dashboard-greeting">
        <h1>{greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
        <p>Here’s what’s happening with your meetings.</p>
      </div>

      <div className="quick-actions">
        <Button variant="primary" icon="➕" onClick={() => navigate('/schedule')}>New Meeting</Button>
        <Button variant="secondary" icon="🔗" onClick={() => navigate('/join')}>Join Meeting</Button>
      </div>

      <div className="section-header">
        <h2 className="section-title" style={{ margin: 0 }}>Upcoming</h2>
        <Link to="/upcoming">View all</Link>
      </div>

      {!upcoming ? (
        <div className="card-list"><Spinner /></div>
      ) : upcoming.length === 0 ? (
        <div className="card-list">
          <EmptyState icon="📅" title="No upcoming meetings" description="Schedule one to see it here." />
        </div>
      ) : (
        <div className="card-list">
          {upcoming.slice(0, 2).map((m) => (
            <UpcomingMeetingCard key={m.id} meeting={m} onCancel={handleCancel} onCopyLink={handleCopyLink} />
          ))}
        </div>
      )}

      <div className="section-header">
        <h2 className="section-title" style={{ margin: 0 }}>Recent Meetings</h2>
        <Link to="/previous">View all</Link>
      </div>

      {!recent ? (
        <div className="card-list"><Spinner /></div>
      ) : recent.length === 0 ? (
        <div className="card-list">
          <EmptyState icon="🗒️" title="No meetings yet" description="Your completed meetings will show up here." />
        </div>
      ) : (
        <div className="card-list">
          {recent.map((m) => (
            <Card key={m.id} className="meeting-card">
              <div className="meeting-card__title">{m.title}</div>
              <div className="meeting-card__meta">
                <span>📅 {formatDateLabel(m.date)}</span>
                <span>⏱ {formatDuration(m.duration)}</span>
              </div>
              {m.hasNotes && (
                <div className="meeting-card__actions">
                  <Button variant="secondary" onClick={() => navigate(`/notes?meeting=${m.id}`)}>View Notes</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
