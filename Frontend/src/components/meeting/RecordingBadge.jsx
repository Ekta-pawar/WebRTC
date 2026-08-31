import { formatClock } from '../../utils/formatDate.js'

export default function RecordingBadge({ seconds }) {
  return (
    <span className="recording-badge">
      🔴 Recording {formatClock(seconds)}
    </span>
  )
}
