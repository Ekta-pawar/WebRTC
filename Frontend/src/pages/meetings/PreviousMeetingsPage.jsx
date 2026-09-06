import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import Input from '../../components/ui/Input.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import PreviousMeetingCard from '../../components/meeting/PreviousMeetingCard.jsx'
import { getPreviousMeetings } from '../../services/meeting.js'
import '../../styles/meetings.css'

export default function PreviousMeetingsPage() {
  const [meetings, setMeetings] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    getPreviousMeetings().then(setMeetings)
  }, [])

  const filtered = useMemo(() => {
    if (!meetings) return null
    if (!query.trim()) return meetings
    const q = query.toLowerCase()
    return meetings.filter((m) => m.title.toLowerCase().includes(q))
  }, [meetings, query])

  return (
    <div>
      <div className="tabs">
        <NavLink to="/upcoming" className={({ isActive }) => (isActive ? 'is-active' : '')}>Upcoming</NavLink>
        <NavLink to="/previous" className={({ isActive }) => (isActive ? 'is-active' : '')}>Previous</NavLink>
      </div>

      <div className="search-input-wrap">
        <Input placeholder="Search meetings..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {!filtered ? (
        <div className="card-list"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="card-list">
          <EmptyState icon={<FiSearch size={22} />} title="No meetings found" description="Try a different search term." />
        </div>
      ) : (
        <div className="card-list">
          {filtered.map((m) => (
            <PreviousMeetingCard key={m.id} meeting={m} />
          ))}
        </div>
      )}
    </div>
  )
}
