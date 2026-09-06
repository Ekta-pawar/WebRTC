import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiCalendar } from 'react-icons/fi'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import UpcomingMeetingCard from '../../components/meeting/UpcomingMeetingCard.jsx'
import { getUpcomingMeetings, cancelMeeting } from '../../services/meeting.js'
import { notifySuccess } from '../../utils/toast.jsx'
import '../../styles/meetings.css'

export default function UpcomingMeetingsPage() {
  const [meetings, setMeetings] = useState(null)

  useEffect(() => {
    getUpcomingMeetings().then(setMeetings)
  }, [])

  const handleCancel = async (meeting) => {
    await cancelMeeting(meeting.id)
    setMeetings((prev) => prev.filter((m) => m.id !== meeting.id))
    notifySuccess('Meeting cancelled.')
  }

  const handleCopyLink = (meeting) => {
    navigator.clipboard?.writeText(`${window.location.origin}/meeting/${meeting.id}`)
    notifySuccess('Meeting link copied.')
  }

  return (
    <div>
      <div className="tabs">
        <NavLink to="/upcoming" className={({ isActive }) => (isActive ? 'is-active' : '')}>Upcoming</NavLink>
        <NavLink to="/previous" className={({ isActive }) => (isActive ? 'is-active' : '')}>Previous</NavLink>
      </div>

      {!meetings ? (
        <div className="card-list"><Spinner /></div>
      ) : meetings.length === 0 ? (
        <div className="card-list">
          <EmptyState icon={<FiCalendar size={22} />} title="No upcoming meetings" description="Schedule a meeting to see it here." />
        </div>
      ) : (
        <div className="card-list">
          {meetings.map((m) => (
            <UpcomingMeetingCard key={m.id} meeting={m} onCancel={handleCancel} onCopyLink={handleCopyLink} />
          ))}
        </div>
      )}
    </div>
  )
}
