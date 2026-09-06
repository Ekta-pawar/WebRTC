import { BsRecordCircle } from 'react-icons/bs'
import { formatClock } from '../../utils/formatDate.js'

export default function RecordingBadge({ seconds }) {
  return (
    <span className="recording-badge">
      <BsRecordCircle /> Recording {formatClock(seconds)}
    </span>
  )
}
